"use client"
import React, { useEffect, useState, useMemo, useCallback } from "react"; 
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner/spinner";
import SearchBar from "../SearchBar";

// Type definition for Client
interface Client {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  cnic: string;
  phone: string;
  assigned_to: string;
}

export default function SortableTableforAllClients() {
  const router = useRouter();
  const [data, setData] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ 
    key: "firstname" as keyof Client, 
    direction: "ascending" as "ascending" | "descending" 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Client[]>("/api/users/AdminAllClients");
      setData(response.data);
    } catch (error) {
      toast.error("Failed to load data.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Enhanced filtering logic
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    const query = searchQuery?.toLowerCase().trim();
    return data.filter((client) => {
      const searchFields = [
        `${client?.firstname} ${client?.lastname}`?.toLowerCase(), // Full name
        client?.firstname?.toLowerCase(),
        client?.lastname?.toLowerCase(),
        client?.email?.toLowerCase(),
        client?.cnic,
        client?.phone,
        client?.assigned_to?.toLowerCase()
      ];
      
      return searchFields.some(field => field.includes(query));
    });
  }, [data, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      
      if (valueA < valueB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const requestSort = useCallback((key: keyof Client) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ascending" 
        ? "descending" 
        : "ascending",
    }));
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const viewUser = useCallback((user: Client) => {
    const userString = encodeURIComponent(JSON.stringify(user));
    router.push(`${routes.viewUsers}?user=${userString}`);
  }, [router]);

  const editUser = useCallback((user: Client) => {
    const userString = encodeURIComponent(JSON.stringify(user));
    router.push(`${routes.editUsers}?user=${userString}`);
  }, [router]);

  const openDeleteModal = useCallback((user: Client) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedUser) return;

    try {
      await axios.put(`/api/users/deleteclient/?id=${selectedUser.id}`);
      setData(prevData => prevData.filter(user => user.id !== selectedUser.id));
      toast.success("Client deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete Client.");
      console.error("Error:", error);
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  }, [selectedUser]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handlePageChange = useCallback((page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

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
          {filteredData.length === 0 ? (
            <div className="text-center text-black">
              <p>{data.length === 0 ? 
                "You have not been assigned any users. Kindly add users to see them listed here." : 
                "No clients found matching your search criteria. Please try a different search term."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-[#E6E8EA] rounded-lg overflow-hidden">
                <thead className="bg-[#E62E2D]">
                  <tr>
                    {[
                      { key: 'id', label: 'ID' },
                      { key: 'firstname', label: 'Full Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'cnic', label: 'CNIC' },
                      { key: 'phone', label: 'Phone Number' },
                      { key: 'assigned_to', label: 'Added By' }
                    ].map(({ key, label }) => (
                      <th 
                        key={key} 
                        className="py-3 px-4 text-left text-white cursor-pointer" 
                        onClick={() => requestSort(key as keyof Client)}
                      >
                        {label}
                      </th>
                    ))}
                    <th className="py-3 px-4 text-left text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {paginatedData.map((client) => (
                    <tr key={client.id} className="hover:bg-red-200">
                      <td className="py-3 px-4">{client.id}</td>
                      <td className="py-3 px-4">{client.firstname} {client.lastname}</td>
                      <td className="py-3 px-4">{client.email}</td>
                      <td className="py-3 px-4">{client.cnic}</td>
                      <td className="py-3 px-4">{client.phone}</td>
                      <td className="py-3 px-4">{client.assigned_to}</td>
                      <td className="py-3 px-4 flex space-x-3 text-gray-700">
                        <button className="hover:text-blue-500" onClick={() => viewUser(client)}>
                          <FaEye className="h-5 w-5" title="View" />
                        </button>
                        <button className="hover:text-yellow-500" onClick={() => editUser(client)}>
                          <FaEdit className="h-5 w-5" title="Edit" />
                        </button>
                        <button className="hover:text-red-500" onClick={() => openDeleteModal(client)}>
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

      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <label htmlFor="rowsPerPage" className="mr-2">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {[5, 10, 20].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="flex items-center mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}