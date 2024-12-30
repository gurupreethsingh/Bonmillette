import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SingleIssue = () => {
  const { id } = useParams(); // Issue ID from URL
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [issue, setIssue] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication required. Redirecting to login.");
          navigate("/my-account");
          return;
        }

        // Fetch the logged-in user's details
        const userResponse = await axios.get("http://localhost:3006/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { id: fetchedUserId, role: userRole } = userResponse.data;
        setUserId(fetchedUserId);
        setRole(userRole);

        // Fetch issue details
        const issueResponse = await axios.get(
          `http://localhost:3006/api/single-issue/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIssue(issueResponse.data.issue);

        // Fetch employees if the user is a superadmin
        if (userRole === "superadmin") {
          const employeesResponse = await axios.get(
            "http://localhost:3006/api/all-users",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setEmployees(
            employeesResponse.data.filter((user) => user.role !== "user")
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err.response || err);
        if (err.response?.status === 404) {
          toast.error("Issue not found. Redirecting to issues list.");
          navigate("/all-issues");
        } else {
          toast.error("Failed to fetch issue details.");
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleAssign = async () => {
    if (!selectedEmployee) {
      toast.warn("Please select an employee to assign.", {
        position: "top-right",
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3006/api/update-issues/${id}`,
        { status: "assigned", assigned_to: selectedEmployee },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        toast.success("Issue successfully assigned!", {
          position: "top-right",
        });
        navigate("/all-issues");
      }
    } catch (err) {
      console.error("Error assigning issue:", err.response || err);
      toast.error("Failed to assign the issue.", {
        position: "top-right",
      });
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      toast.warn("Please select a status to update.", {
        position: "top-right",
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3006/api/update-issues/${id}`,
        { status: selectedStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        toast.success("Issue status updated successfully!", {
          position: "top-right",
        });
        setIssue((prev) => ({ ...prev, status: selectedStatus }));
      }
    } catch (err) {
      console.error("Error updating issue status:", err.response || err);
      toast.error("Failed to update the issue status.", {
        position: "top-right",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/my-account");
  };

  if (!issue) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading issue details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-5 mb-5">
      <ToastContainer />
      <div className="relative flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4 gap-6">
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
                    ? `superadmin-dashboard/${userId}`
                    : role === "admin"
                    ? `admin-dashboard/${userId}`
                    : role === "employee"
                    ? `employee-dashboard/${userId}`
                    : `user-dashboard/${userId}`
                }`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to={`/my-orders/${userId}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📦 Orders
              </Link>
            </li>
            <li>
              <Link
                to={`/addresses/${userId}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📍 Addresses
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

        {/* Issue Details Section */}
        <div className="w-full md:w-4/5 rounded-lg p-6 bg-white shadow relative">
          {/* Dropdown on Top Right (Only for Super Admin) */}
          {role === "superadmin" && (
            <div className="absolute top-4 right-4 w-64">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-2 py-1 border rounded-md text-sm focus:ring focus:ring-blue-300 mb-2"
              >
                <option value="">-- Assign Employee --</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name} - {employee.role}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                className="w-full bg-red-500 text-white font-bold rounded-pill px-2 py-1 mt-2 rounded-md hover:bg-red-600"
              >
                Assign
              </button>

              {/* Status Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-2 py-1 border rounded-md text-sm focus:ring focus:ring-blue-300 mt-4"
              >
                <option value="">-- Change Status --</option>
                <option value="reassigned">Re-Opened</option>
                <option value="closed">Closed</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="w-full bg-red-500 text-white font-bold rounded-pill px-2 py-1 mt-2 rounded-md hover:bg-red-600"
              >
                Update Status
              </button>
            </div>
          )}

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Issue Details
          </h2>

          {/* Images */}
          <h3 className="text-xl font-semibold mt-6 mb-2">Images</h3>
          <div className="grid grid-cols-4 gap-4">
            {issue.issue_images.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden"
                onClick={() => setFocusedImage(image)}
              >
                <img
                  src={`http://localhost:3006/uploads/issues_images/${image}`}
                  alt={`Issue Image ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg transition-transform transform group-hover:scale-110 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-4 mt-6">
            <p>
              <strong>Order ID:</strong> {issue.order_id?.orderId || "N/A"}
            </p>
            <p>
              <strong>Title:</strong> {issue.title}
            </p>
            <p>
              <strong>Description:</strong> {issue.description}
            </p>
            <p>
              <strong>Customer Name:</strong> {issue.customer_id?.name || "N/A"}
            </p>
            <p>
              <strong>Complaint Raised Date:</strong>{" "}
              {new Date(issue.createdAt).toLocaleDateString() || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {issue.status}
            </p>
            {role === "superadmin" && issue.assigned_to && (
              <p>
                <strong>Assigned To:</strong> {issue.assigned_to.name}
              </p>
            )}
            {issue.assigned_by && (
              <p>
                <strong>Assigned By:</strong> {issue.assigned_by.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleIssue;
