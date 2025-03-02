"use client";

import { useEffect, useMemo, useState } from "react";

interface Advocate {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string | number;
}

const filterAdvocatesList = (advocates: Advocate[], searchTerm: string): Advocate[] => {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return advocates.filter((advocate) => {
    return (
      `${advocate.firstName} ${advocate.lastName}`.toLowerCase().includes(lowerSearchTerm) ||
      advocate.city.toLowerCase().includes(lowerSearchTerm) ||
      advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
      advocate.specialties.some((s) => s.toLowerCase().includes(lowerSearchTerm)) ||
      String(advocate.yearsOfExperience).toLowerCase().includes(lowerSearchTerm)
    );
  });
};

const formatPhoneNumber = (phone: string | number): string => {
  const phoneStr = phone.toString();
  const cleaned = phoneStr.replace(/\D/g, "");
  if (cleaned.length !== 10) return cleaned;
  const areaCode = cleaned.slice(0, 3);
  const firstPart = cleaned.slice(3, 6);
  const secondPart = cleaned.slice(6);
  return `(${areaCode})-${firstPart}-${secondPart}`;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/advocates")
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
      });
  }, []);

  const filteredAdvocates = useMemo(
    () => filterAdvocatesList(advocates, searchTerm),
    [advocates, searchTerm]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#3D5C50] shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Solace Advocates</h1>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-row items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name, city, or degree..."
                className="block w-full md:w-80 rounded-md border-gray-300 shadow-xl focus:border-[#3D5C50] focus:ring-[#3D5C50] px-3 py-2 placeholder:text-sm h-10"
              />
              <button
                onClick={handleResetSearch}
                className="inline-flex items-center px-4 py-2 h-10 bg-[#3D5C50] text-white rounded-md shadow-xl hover:bg-[#2F483F] focus:outline-none"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-2xl">
            <table className="min-w-full table-fixed divide-y divide-gray-200 bg-white text-sm">
              <thead className="bg-[#3D5C50]">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-white uppercase">Name</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-white uppercase">City</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-white uppercase">Degree</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-white uppercase">Specialties</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-white uppercase">Years of Exp</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-white uppercase">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdvocates.map((advocate) => (
                  <tr key={advocate.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                      {advocate.firstName} {advocate.lastName}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">{advocate.city}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">{advocate.degree}</td>
                    <td className="px-4 py-2 whitespace-normal">
                      <ul className="list-disc pl-4 space-y-1">
                        {advocate.specialties.map((s, index) => (
                          <li key={index} className="bg-gray-100 px-1 rounded-sm">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">{advocate.yearsOfExperience}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                      {formatPhoneNumber(advocate.phoneNumber)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAdvocates.length === 0 && (
              <div className="text-center text-gray-600 py-4">No advocates found.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}