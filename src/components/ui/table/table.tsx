"use client"
import React, { useEffect, useState, useMemo, useCallback } from "react"; 
import { FaEye, FaEdit, FaTrash, FaCaretRight } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner/spinner";
import SearchBar from "../SearchBar";

// Type definition for User to improve type safety
interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
}

export default function SortableTable() {
  console.log("i'm in the admin sotable table")
  const router = useRouter();
  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState({ 
    key: "username" as keyof User, 
    direction: "ascending" 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = useCallback((page: number) => {
    // Only update if the page is within valid range
    if (page > 0 && page <= Math.ceil(filteredData.length / rowsPerPage)) {
      setCurrentPage(page);
    }
  }, [filteredData, rowsPerPage]);
  // Memoized fetch data to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<User[]>("/api/users/protectedUser");
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      toast.error("Failed to load data.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimized sorting logic
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      
      if (valueA < valueB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Memoized sort request handler
  const requestSort = useCallback((key: keyof User) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ascending" 
        ? "descending" 
        : "ascending",
    }));
  }, []);

  // Optimized search handler
  const handleSearch = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = data.filter(
      (user) =>
        user.username.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.firstname.toLowerCase().includes(lowerQuery) ||
        user.lastname.toLowerCase().includes(lowerQuery)
    );
    setFilteredData(filtered);
    setCurrentPage(1);  // Reset to first page on search
  }, [data]);

  // Navigation handlers with type safety
  const navigateTo = useCallback((route: string, user: User) => {
    const userString = encodeURIComponent(JSON.stringify(user));
    router.push(`${route}?user=${userString}`);
  }, [router]);

  // Delete user handler
  const confirmDelete = useCallback(async () => {
    if (!selectedUser) return;

    try {
      await axios.put(`/api/users/deleteuser/?id=${selectedUser.id}`);
      
      // Functional update to ensure we're working with the most recent state
      setData(prevData => prevData.filter((user) => user.id !== selectedUser.id));
      setFilteredData(prevFilteredData => 
        prevFilteredData.filter((user) => user.id !== selectedUser.id)
      );
      
      toast.success("Client deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete Client.");
      console.error("Error:", error);
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  }, [selectedUser]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Render methods
  const renderActionButtons = useCallback((user: User) => (
    <td className="py-3 px-4 flex space-x-3 text-gray-700">
      <button className="hover:text-blue-500" onClick={() => navigateTo(routes.viewClient, user)}>
        <FaEye className="h-5 w-5" title="View" />
      </button>
      <button className="hover:text-yellow-500" onClick={() => navigateTo(routes.editClient, user)}>
        <FaEdit className="h-5 w-5" title="Edit" />
      </button>
      <button className="hover:text-red-500" onClick={() => {
        setSelectedUser(user);
        setIsModalOpen(true);
      }}>
        <FaTrash className="h-5 w-5" title="Delete" />
      </button>
      <button className="hover:text-yellow-500" onClick={() => navigateTo(routes.specificUsers, user)}>
        <FaCaretRight className="h-5 w-5" title="Show Clients" />
      </button>
    </td>
  ), [navigateTo]);

  return (
    <div className="bg-gray-300 w-full mx-auto p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4 mt-4">
        <h2 className="text-2xl text-black">Users Table</h2>
        <SearchBar onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {filteredData.length === 0 ? (
            <div className="text-center text-black">
              <p>No Users found. Please add users.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-[#E6E8EA] rounded-lg overflow-hidden">
                  <thead className="bg-[#E62E2D]">
                    <tr>
                      {[
                        { key: 'id', label: 'ID' },
                        { key: 'firstname', label: 'Full Name' },
                        { key: 'username', label: 'User Name' },
                        { key: 'email', label: 'Email' },
                        { key: 'phone', label: 'Phone Number' }
                      ].map(({ key, label }) => (
                        <th 
                          key={key} 
                          className="py-3 px-4 text-left text-white cursor-pointer" 
                          onClick={() => requestSort(key as keyof User)}
                        >
                          {label}
                        </th>
                      ))}
                      <th className="py-3 px-4 text-left text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {paginatedData.map((user) => (
                      <tr key={user.id} className="hover:bg-red-200">
                        <td className="py-3 px-4">{user.id}</td>
                        <td className="py-3 px-4">{user.firstname} {user.lastname}</td>
                        <td className="py-3 px-4">{user.username}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.phone}</td>
                        {renderActionButtons(user)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
                  <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="p-2 border rounded"
                  >
                    {[5, 10, 20].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2 items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
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
    </div>
  );
}