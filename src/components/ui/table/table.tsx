import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner/spinner";

export default function SortableTable() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/users/protectedUser");
      setData(response.data);
    } catch (error) {
      toast.error("Failed to load data.");
    } finally {
      setIsLoading(false); // Set loading to false after data fetch
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ascending" ? "descending" : "ascending",
    }));
  }, []);

  const viewUser = useCallback((user) => {
    const userString = encodeURIComponent(JSON.stringify(user));
    router.push(`${routes.viewClient}?user=${userString}`);
  }, [router]);

  const editUser = useCallback((user) => {
    const userString = encodeURIComponent(JSON.stringify(user));
    router.push(`${routes.editClient}?user=${userString}`);
  }, [router]);

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.put(`/api/users/deleteclient/?id=${selectedUser.id}`);
      setData(data.filter((user) => user.status !== selectedUser.status));
      toast.success("Client deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete Client.");
      console.error("Error:", error);
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="bg-gray-900 w-full max-w-4xl mx-auto p-4 rounded-lg shadow-lg">
      <h1 className="text-center text-2xl text-white mb-4">Hi! Admin, Welcome to the Client Portal</h1>
      <h2 className="text-2xl text-white mb-4">User Table</h2>
      
      {isLoading ? (
        <Spinner /> // Show the spinner while loading
      ) : (
        <>
          {data.length === 0 ? (
            <div className="text-center text-gray-300">
              <p>You have no clients. Kindly press the button above to add a client.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-300 cursor-pointer" onClick={() => requestSort("id")}>
                      ID
                    </th>
                    <th className="py-3 px-4 text-left text-gray-300 cursor-pointer" onClick={() => requestSort("username")}>
                      User Name
                    </th>
                    <th className="py-3 px-4 text-left text-gray-300 cursor-pointer" onClick={() => requestSort("email")}>
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

      {/* Modal for delete confirmation */}
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
