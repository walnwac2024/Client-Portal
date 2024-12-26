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

// Type for Sort Configuration
interface SortConfig {
  key: keyof Client;
  direction: 'ascending' | 'descending';
}

export default function SortableTableForUsers() {
  const router = useRouter();
  
  // Typed state management
  const [data, setData] = useState<Client[]>([]);
  const [filteredData, setFilteredData] = useState<Client[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'id', 
    direction: 'ascending' 
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state with type safety
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Memoized data fetching
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Client[]>("/api/users/clientDetails");
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      toast.error("Failed to load clients.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimized sorting logic with type safety
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) 
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) 
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Improved sort request handler with type safety
  const requestSort = useCallback((key: keyof Client) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ascending" 
        ? "descending" 
        : "ascending",
    }));
  }, []);

  // Enhanced search handler
  const handleSearch = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = data.filter(
      (client) =>
        client.firstname.toLowerCase().includes(lowerQuery) ||
        client.lastname.toLowerCase().includes(lowerQuery) ||
        client.email.toLowerCase().includes(lowerQuery) ||
        client.cnic.toLowerCase().includes(lowerQuery) ||
        client.phone.toLowerCase().includes(lowerQuery)
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [data]);

  // Consolidated navigation handler
  const navigateToPage = useCallback((route: string, client: Client) => {
    const clientString = encodeURIComponent(JSON.stringify(client));
    router.push(`${route}?user=${clientString}`);
  }, [router]);

  // Improved delete handler
  const confirmDelete = useCallback(async () => {
    if (!selectedUser) return;

    try {
      await axios.put(`/api/users/deleteclient/?id=${selectedUser.id}`);
      
      // Functional state updates
      setData(prevData => prevData.filter(client => client.id !== selectedUser.id));
      setFilteredData(prevFiltered => prevFiltered.filter(client => client.id !== selectedUser.id));
      
      toast.success("Client deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete client.");
      console.error(error);
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  }, [selectedUser]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  // Improved page change handler
  const handlePageChange = useCallback((page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  // Render action buttons
  const renderActionButtons = useCallback((client: Client) => (
    <td className="py-3 px-4 flex space-x-3 text-gray-700">
      <button 
        className="hover:text-blue-500" 
        onClick={() => navigateToPage(routes.viewUsers, client)}
      >
        <FaEye className="h-5 w-5" title="View" />
      </button>
      <button 
        className="hover:text-yellow-500" 
        onClick={() => navigateToPage(routes.editUsers, client)}
      >
        <FaEdit className="h-5 w-5" title="Edit" />
      </button>
      <button 
        className="hover:text-red-500" 
        onClick={() => {
          setSelectedUser(client);
          setIsModalOpen(true);
        }}
      >
        <FaTrash className="h-5 w-5" title="Delete" />
      </button>
    </td>
  ), [navigateToPage]);

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
              <p>No clients found. Add clients to see them listed here.</p>
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
                      {renderActionButtons(client)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold">Confirm Client Deletion</h3>
            <p className="text-gray-700 my-4">Are you sure you want to delete this client? This action cannot be undone.</p>
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
          <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
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
          <span className="flex items-center">
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