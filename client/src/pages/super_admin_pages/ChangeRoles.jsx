import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ChangeRoles = () => {
  const [users, setUsers] = useState([]); // Fetched users
  const [view, setView] = useState("grid"); // View state: grid, list, card
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for role update
  const [privileges, setPrivileges] = useState([]); // User privileges
  const [availableRoutes, setAvailableRoutes] = useState([]); // Available routes for privileges

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchRoutes();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3006/api/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const fetchRoutes = () => {
    const routes = [
      { name: "Homepage", path: "/" },
      { name: "Contact Us", path: "/contact-us" },
      { name: "All Users", path: "/all-users" },
      { name: "All Orders", path: "/all-orders" },
      { name: "Superadmin Dashboard", path: "/superadmin-dashboard" },
      { name: "Admin Dashboard", path: "/admin-dashboard" },
    ];
    setAvailableRoutes(routes);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setPrivileges(user.privileges || []);
  };

  const handleCheckboxChange = (routePath) => {
    setPrivileges((prev) =>
      prev.includes(routePath)
        ? prev.filter((path) => path !== routePath)
        : [...prev, routePath]
    );
  };

  const handleRoleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3006/api/update-user-role/${selectedUser._id}`,
        { role: selectedUser.role, privileges },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Role and privileges updated successfully!");
      setSelectedUser(null);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating role:", error.message);
      alert("Failed to update user role.");
    }
  };

  const getImageUrl = (avatar, role) => {
    if (avatar) {
      const normalizedPath = avatar.replace(/\\/g, "/").split("/").pop();
      return `http://localhost:3006/uploads/${role}/${normalizedPath}`;
    }
    return "https://via.placeholder.com/150";
  };

  const filteredUsers = users.filter((user) =>
    ["name", "email", "role"].some((key) =>
      user[key]?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-3xl font-bold text-gray-900">
            Change User Roles
          </h2>
          <div className="flex items-center space-x-4">
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
                className="pl-10 pr-4 py-2 border rounded-md"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* User Views */}
        <div className="mt-10">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col items-start cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <img
                    src={getImageUrl(user.avatar, user.role)}
                    alt={user.name || "User"}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <h3 className="mt-2 text-md font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
              ))}
            </div>
          )}
          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-4 bg-gray-100 rounded-lg shadow cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <img
                    src={getImageUrl(user.avatar, user.role)}
                    alt={user.name || "User"}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="mt-2 text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
              ))}
            </div>
          )}
          {view === "list" && (
            <ul className="space-y-4">
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <img
                    src={getImageUrl(user.avatar, user.role)}
                    alt={user.name || "User"}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Role Update Section */}
        {selectedUser && (
          <div className="mt-10 border-t pt-5">
            <h3 className="text-xl font-semibold mb-2">
              Update Role for {selectedUser.name}
            </h3>
            <div className="flex gap-10">
              <div>
                <label className="block text-gray-700 mb-2">Select Role:</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="employee">Employee</option>
                </select>
                <button
                  onClick={handleRoleUpdate}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update Role
                </button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Manage Page Privileges</h4>
                {availableRoutes.map((route) => (
                  <label
                    key={route.path}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={privileges.includes(route.path)}
                      onChange={() => handleCheckboxChange(route.path)}
                    />
                    <span>{route.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeRoles;
