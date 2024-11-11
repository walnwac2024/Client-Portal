"use client"
import React, { useEffect, useState, useMemo, useCallback } from "react"; 
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner/spinner";
import SearchBar from "../SearchBar";

export default function SortableTableforAllClients() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>(data);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);  // Default rows per page
  const [currentPage, setCurrentPage] = useState(1);    // Current page number

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/users/AdminAllClients");
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      toast.error("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      router.push(`${routes.viewUsers}?user=${userString}`);
    },
    [router]
  );

  const editUser = useCallback(
    (user) => {
      const userString = encodeURIComponent(JSON.stringify(user));
      router.push(`${routes.editUsers}?user=${userString}`);
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
    setCurrentPage(1);  // Reset to first page when rows per page is changed
  };

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  return (
    <div className="bg-gray-300 w-full mx-auto p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4 mt-4">
        <h2 className="text-2xl text-black">Clients Table</h2>
        <SearchBar onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {data.length === 0 ? (
            <div className="text-center text-black">
              <p>You have not been assigned any users. Kindly add users to see them listed here.</p>
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
                      Full Name
                    </th>
                    <th className="py-3 px-4 text-left text-white cursor-pointer" onClick={() => requestSort("email")}>
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-white cursor-pointer" onClick={() => requestSort("email")}>
                      CNIC
                    </th>
                    <th className="py-3 px-4 text-left text-white cursor-pointer" onClick={() => requestSort("email")}>
                      Phone Number
                    </th>
                    <th className="py-3 px-4 text-left text-white cursor-pointer" onClick={() => requestSort("email")}>
                      Added By
                    </th>
                    <th className="py-3 px-4 text-left text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {paginatedData.map((user) => (
                    <tr key={user.id} className="hover:bg-red-200">
                      <td className="py-3 px-4">{user.id}</td>
                      <td className="py-3 px-4">{user.firstname} {user.lastname}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.cnic}</td>
                      <td className="py-3 px-4">{user.phone}</td>
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
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <label htmlFor="rowsPerPage" className="mr-2">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-gray-300" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
