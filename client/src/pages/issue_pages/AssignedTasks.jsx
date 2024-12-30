import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/AuthContext";
import {
  FiHome,
  FiUser,
  FiLogOut,
  FiSearch,
  FiList,
  FiGrid,
  FiSquare,
} from "react-icons/fi";

const AssignedTasks = () => {
  const { user, logout } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState("list"); // Default view type
  const [statusUpdates, setStatusUpdates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAssignedIssues = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/issues/assigned/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIssues(response.data.issues || []);
      } catch (error) {
        console.error(
          "Error fetching assigned issues:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchAssignedIssues();
  }, [user.id]);

  const handleStatusChange = (issueId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [issueId]: newStatus }));
  };

  const updateStatus = async (issueId) => {
    const newStatus = statusUpdates[issueId];
    if (!newStatus) {
      alert("Please select a status to update.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3006/api/update-issues/${issueId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Status updated successfully.");
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue._id === issueId ? { ...issue, status: newStatus } : issue
          )
        );
      }
    } catch (error) {
      console.error("Error updating issue status:", error.message);
      alert("Failed to update status. Please try again.");
    }
  };

  const filteredIssues = issues.filter((issue) =>
    ["title", "description", "status", "customer_id.name"]
      .map((key) => issue[key]?.toLowerCase() || "")
      .some((field) => field.includes(searchQuery.toLowerCase()))
  );

  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "text-green-700 bg-green-200 p-2 rounded mt-2";
      case "in-progress":
        return "text-gray-900 bg-blue-200 p-2 rounded mt-2";
      case "fixed":
        return "text-black  bg-yellow-200 p-2 rounded mt-2";
      case "closed":
        return "text-black bg-gray-200 p-2 rounded mt-2";
      default:
        return "text-gray-700 p-2 rounded m-2";
    }
  };

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row w-full md:w-5/6 mx-auto py-6 px-4 gap-6">
        {/* Navigation Section */}
        <div className="w-full md:w-1/5 p-4 bg-gray-50 shadow-md rounded-lg">
          <ul className="space-y-4">
            <li>
              <Link
                to={`/dashboard/${user.id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiHome size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiUser size={20} />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => logout()}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-4/5">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Assigned Tasks</h2>
            <div className="relative w-1/2 md:w-1/3">
              <input
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full shadow focus:outline-none focus:ring focus:ring-blue-300"
              />
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
                <FiSearch size={20} />
              </span>
            </div>
          </div>

          {/* View Type Buttons */}
          <div className="flex justify-end mb-4">
            <button
              className={`px-4 py-2 rounded-l-lg ${
                viewType === "list"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setViewType("list")}
            >
              <FiList />
            </button>
            <button
              className={`px-4 py-2 ${
                viewType === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setViewType("grid")}
            >
              <FiGrid />
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg ${
                viewType === "card"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setViewType("card")}
            >
              <FiSquare />
            </button>
          </div>

          {/* Render Issues Based on View Type */}
          {viewType === "list" && (
            <div>
              {paginatedIssues.map((issue) => (
                <div
                  key={issue._id}
                  className="flex items-center bg-white shadow-md rounded-lg p-4 mb-4"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{issue.title}</h4>
                    <p className="text-gray-600">{issue.description}</p>
                    <span
                      className={`text-sm ${getStatusStyles(issue.status)}`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      className="border rounded px-2 py-1 focus:ring"
                      onChange={(e) =>
                        handleStatusChange(issue._id, e.target.value)
                      }
                      value={statusUpdates[issue._id] || ""}
                    >
                      <option value="">Select Status</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="fixed">Fixed/Complete</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => updateStatus(issue._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewType === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedIssues.map((issue) => (
                <div
                  key={issue._id}
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <h4 className="font-bold text-lg">{issue.title}</h4>
                  <p className="text-gray-600">{issue.description}</p>
                  <span className={`text-sm ${getStatusStyles(issue.status)}`}>
                    {issue.status}
                  </span>
                  <div className="mt-4">
                    <select
                      className="border rounded px-2 py-1 focus:ring w-full"
                      onChange={(e) =>
                        handleStatusChange(issue._id, e.target.value)
                      }
                      value={statusUpdates[issue._id] || ""}
                    >
                      <option value="">Select Status</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="fixed">Fixed/Complete</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => updateStatus(issue._id)}
                      className="bg-blue-500 text-white w-full px-4 py-2 rounded mt-2 hover:bg-blue-600"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewType === "card" && (
            <div className="flex flex-wrap gap-6">
              {paginatedIssues.map((issue) => (
                <div
                  key={issue._id}
                  className="bg-white shadow-md rounded-lg p-6 w-full sm:w-1/2 md:w-1/3"
                >
                  <h4 className="font-bold text-lg">{issue.title}</h4>
                  <p className="text-gray-600">{issue.description}</p>
                  <span className={`text-sm ${getStatusStyles(issue.status)}`}>
                    {issue.status}
                  </span>
                  <div className="mt-4">
                    <select
                      className="border rounded px-2 py-1 focus:ring w-full"
                      onChange={(e) =>
                        handleStatusChange(issue._id, e.target.value)
                      }
                      value={statusUpdates[issue._id] || ""}
                    >
                      <option value="">Select Status</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="fixed">Fixed/Complete</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => updateStatus(issue._id)}
                      className="bg-blue-500 text-white w-full px-4 py-2 rounded mt-2 hover:bg-blue-600"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedTasks;
