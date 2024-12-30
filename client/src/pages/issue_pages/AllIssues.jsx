import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../components/AuthContext";

const AllIssues = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();

  // Decode the token and set role and id
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedToken = JSON.parse(atob(base64));
        setId(decodedToken.id);
        setRole(decodedToken.role); // Get the user's role
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
        navigate("/my-account", { replace: true });
      }
    } else {
      logout();
      navigate("/my-account", { replace: true });
    }
  }, [logout, navigate]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/my-account", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Fetch issues based on role
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const url =
          role === "superadmin"
            ? "http://localhost:3006/api/get-all-issues"
            : `http://localhost:3006/api/issues/customer/${id}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setIssues(response.data.issues || []);
      } catch (error) {
        console.error(
          "Error fetching issues:",
          error.response?.data || error.message
        );
      }
    };

    if (role) fetchIssues();
  }, [role, id]);

  // Handle browser back navigation
  useEffect(() => {
    if (location.state && location.state.fromDashboard) {
      navigate(location.state.fromDashboard, { replace: true });
    }
  }, [location, navigate]);

  // Filter issues based on search query
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = ["title", "description", "status", "customer_id.name"]
      .map((key) => issue[key]?.toLowerCase() || "")
      .some((field) => field.includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getImageUrl = (images) => {
    if (images && images.length > 0) {
      return `http://localhost:3006/uploads/issues_images/${images[0]}`;
    }
    return "https://via.placeholder.com/150";
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700";
      case "assigned":
        return "bg-blue-100 text-blue-700";
      case "fixed":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/my-account", { replace: true });
  };

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
        {/* Navigation Section */}
        <div className="w-full md:w-1/5 mb-6 md:mb-0">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Navigation
          </h3>
          <ul className="space-y-4">
            <li>
              <Link
                to={`/${
                  role === "superadmin"
                    ? `superadmin-dashboard/${id}`
                    : role === "admin"
                    ? `admin-dashboard/${id}`
                    : role === "employee"
                    ? `employee-dashboard/${id}`
                    : `user-dashboard/${id}`
                }`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={`/my-orders/${id}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📦 Orders
              </Link>
            </li>
            <li>
              <Link
                to={`/addresses/${id}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📍 Addresses
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${id}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                ⚙️ Account Details
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content Section */}
        <div className="w-full md:w-4/5">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">All Issues</h2>
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
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Views */}
          <div
            className={`${
              view === "list"
                ? "space-y-4"
                : view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            }`}
          >
            {paginatedIssues.map((issue) => (
              <Link
                key={issue._id}
                to={`/single-issue/${issue._id}`}
                className={`bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 ${
                  view === "grid" || view === "card"
                    ? "block"
                    : "flex items-center"
                }`}
              >
                <img
                  src={getImageUrl(issue.issue_images)}
                  alt="Issue"
                  className={`${
                    view === "list" ? "w-16 h-16" : "w-full h-48"
                  } object-cover rounded-lg`}
                />
                <div className={`${view === "list" ? "ml-4" : "mt-4"}`}>
                  <h3 className="text-lg font-bold text-gray-800">
                    {issue.title || "No Title"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {issue.description || "No Description"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Customer:{" "}
                    <span className="font-semibold text-blue-600">
                      {issue.customer_id?.name || "N/A"}
                    </span>
                  </p>
                  <p
                    className={`inline-block px-3 py-1 mt-3 rounded-full text-sm font-semibold ${getStatusStyles(
                      issue.status
                    )}`}
                  >
                    {issue.status}
                  </p>
                  {role === "superadmin" && (
                    <p className="text-sm text-gray-600 mt-2">
                      Assigned to:{" "}
                      <span className="font-semibold text-teal-600">
                        {issue.assigned_to?.name || "N/A"}
                      </span>{" "}
                      | Fixed Date:{" "}
                      <span className="font-semibold text-indigo-600">
                        {formatDate(issue.fixed_date)}
                      </span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentPage === index + 1
                    ? "bg-indigo-700 text-white"
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

export default AllIssues;
