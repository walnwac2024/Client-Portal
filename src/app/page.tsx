"use client";
import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import axios from "axios";
import { toast } from "react-hot-toast";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      
      <div className="absolute top-4 right-4">
        <button 
          className="flex items-center px-6 py-2 bg-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
          onClick={() => router.push(routes.addClient)}
        >
          <span className="mr-2 text-xl font-bold">+</span> Figma
        </button>
      </div>
  
      {/* Centered SortableTable */}
      <div className="flex justify-center items-center w-full px-4">
        <SortableTable />
      </div>
    </div>
  );
}

const SortableTable = () => {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users/protectedUser");
        setData(response.data);
        console.log("Fetched data:", response.data);
        toast.success("Data loaded successfully!");
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
        toast.error("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-gray-900 w-full max-w-4xl mx-auto p-4 rounded-lg shadow-lg">
      <h1 className="text-center text-2xl text-white mb-4">Hi! Admin, Welcome to the Client Portal</h1>
      <h2 className="text-2xl text-white mb-4">User Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-gray-300 cursor-pointer" onClick={() => requestSort('name')}>
                ID
              </th>
              <th className="py-3 px-4 text-left text-gray-300 cursor-pointer" onClick={() => requestSort('age')}>
                User Name
              </th>
              <th className="py-3 px-4 text-left text-gray-300 cursor-pointer" onClick={() => requestSort('email')}>
                Email
              </th>
              <th className="py-3 px-4 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {sortedData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-600">
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4 flex space-x-3 text-gray-300">
                  <button className="hover:text-blue-500">
                    <FaEye className="h-5 w-5" title="View" />
                  </button>
                  <button className="hover:text-yellow-500">
                    <FaEdit className="h-5 w-5" title="Edit" />
                  </button>
                  <button className="hover:text-red-500">
                    <FaTrash className="h-5 w-5" title="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
