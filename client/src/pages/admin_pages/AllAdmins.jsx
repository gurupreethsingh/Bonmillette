import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaSearch, FaTrash } from "react-icons/fa";

export default function AllAdmins() {
  const [users, setUsers] = useState([]); // State to hold fetched users
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3006/api/get-all-admins",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        if (error.response) {
          console.error(
            "Response Error:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("Request Error:", error.request);
        } else {
          console.error("General Error:", error.message);
        }
      }
    };

    fetchUsers();
  }, []);

  const getImageUrl = (avatar, role) => {
    if (avatar) {
      const normalizedPath = avatar.replace(/\\/g, "/").split("/").pop();
      return `http://localhost:3006/uploads/${role}/${normalizedPath}`;
    }
    return "https://via.placeholder.com/150";
  };

  const handleDeleteUser = async (userId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (!confirmation) return;

    try {
      const response = await axios.delete(
        `http://localhost:3006/api/delete-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("User deleted successfully.");
        setUsers(users.filter((user) => user._id !== userId)); // Remove the deleted user from the UI
      } else {
        alert("Error deleting user. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
      alert("Error deleting user. Please try again.");
    }
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              All Users
            </h2>
          </div>
          <div className="flex items-center space-x-4 flex-wrap">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("grid")}
            />
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {users
                .filter((user) =>
                  [user.name, user.email, user.role]
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col items-start relative"
                  >
                    <img
                      src={getImageUrl(user.avatar, user.role)}
                      alt={user.name}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                    <h3 className="mt-2 text-md font-semibold text-gray-900 text-left">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-left">
                      {user.email}
                    </p>
                    <p className="text-sm text-gray-600 text-left">
                      {user.role}
                    </p>
                  </div>
                ))}
            </div>
          )}
          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users
                .filter((user) =>
                  [user.name, user.email, user.role]
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col items-start bg-white rounded-lg shadow relative"
                  >
                    <img
                      src={getImageUrl(user.avatar, user.role)}
                      alt={user.name}
                      className="w-full h-96 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 text-left">
                      {user.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 text-left">
                      {user.email}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 text-left">
                      {user.role}
                    </p>
                  </div>
                ))}
            </div>
          )}
          {view === "list" && (
            <div className="space-y-6">
              {users
                .filter((user) =>
                  [user.name, user.email, user.role]
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center space-x-4 bg-white rounded-lg shadow relative"
                  >
                    <img
                      src={getImageUrl(user.avatar, user.role)}
                      alt={user.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 text-left">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-left">
                        {user.email}
                      </p>
                      <p className="text-sm text-gray-600 text-left">
                        {user.role}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
