"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { routes } from "@/config/routes";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "../Spinner/spinner";
import SearchBar from "../SearchBar";
import { motion } from "framer-motion";

export default function SpecificClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<any | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      const userString = searchParams.get("user");
      if (userString) {
        try {
          const decodedUser = JSON.parse(decodeURIComponent(userString));
          setFormData(decodedUser); // Set formData
          const response = await axios.post("/api/users/allClients", decodedUser );
          setData(response.data);
          setFilteredData(response.data);
        } catch (error) {
          console.error("Failed to fetch client data:", error);
          toast.error("Failed to load client data.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchClientData();
  }, [searchParams]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const requestSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ascending" ? "descending" : "ascending",
    }));
  }, []);

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = data.filter(
      (user) =>
        user.username.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    );
    setFilteredData(filtered);
  };

  const viewUser = useCallback(
    (user) => {
      const userString = encodeURIComponent(JSON.stringify(user));
      router.push(`${routes.viewClient}?user=${userString}`);
    },
    [router]
  );

  const editUser = useCallback(
    (user) => {
      const userString = encodeURIComponent(JSON.stringify(user));
      router.push(`${routes.editClient}?user=${userString}`);
    },
    [router]
  );

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.put(`/api/users/deleteclient/?id=${selectedUser.id}`);
      setData(data.filter((user) => user.id !== selectedUser.id));
      setFilteredData(filteredData.filter((user) => user.id !== selectedUser.id));
      toast.success("Client deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete Client.");
      console.error("Error:", error);
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  // Handle page change and rows per page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
 console.log("the lenth of the data is:",data.length)
  return (
    <div className="bg-gray-300 w-full max-w-4xl mx-auto p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4 mt-4">
        <h2 className="text-2xl text-black">{formData?.firstname} {formData?.lastname}  Clients</h2>
        <SearchBar onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {data.length == 0 ? (
            <div className="text-center text-black">
              <p>You have no clients. Kindly press the button above to add a client.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-[#E6E8EA] rounded-lg overflow-hidden">
                <thead className="bg-[#E62E2D]">
                  <tr>
                    <th className="py-3 px-4 text-left text-white cursor-pointer" onClick={() => requestSort("id")}>
                      ID
                    </th>
                    <th className="py-3 px-4 text-left text-white cursor-pointer" onClick={() => requestSort("username")}>
                      User Name
                    </th>
                    <th className="py-3 px-4 text-left text-white cursor-pointer" onClick={() => requestSort("email")}>
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-white cursor-pointer" onClick={() => requestSort("assigned_to")}>
                      Assigned To
                    </th>
                    <th className="py-3 px-4 text-left text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {paginatedData.map((user) => (
                    <tr key={user.id} className="hover:bg-red-200">
                      <td className="py-3 px-4">{user.id}</td>
                      <td className="py-3 px-4">{user.username}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.assigned_to}</td>
                      <td className="py-3 px-4 flex space-x-3 text-gray-700">
                        <button className="hover:text-blue-500" onClick={() => viewUser(user)}>
                          <FaEye className="h-5 w-5" title="View" />
                        </button>
                        <button className="hover:text-yellow-500" onClick={() => editUser(user)}>
                          <FaEdit className="h-5 w-5" title="Edit" />
                        </button>
                        <button className="hover:text-red-500" onClick={() => openDeleteModal(user)}>
                          <FaTrash className="h-5 w-5" title="Delete" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold">Are you sure you want to delete this user?</h3>
            <p className="text-gray-700 my-4">This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <div>
          <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
          <select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange} className="border p-2 rounded">
            {[5, 10, 20, 50].map((rows) => (
              <option key={rows} value={rows}>
                {rows}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`mr-2 ${currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "hover:bg-gray-200"}`}
          >
            Previous
          </button>
          <span className="mx-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`ml-2 ${currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "hover:bg-gray-200"}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}