import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../components/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const CreateCoupon = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [id, setId] = useState(null); // State for ID
  const [role, setRole] = useState(null); // State for role
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    maxDiscountAmount: "",
    expirationDate: "",
    usageLimit: "",
    minCartValue: "",
    isActive: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        // Log decoded token for debugging
        console.log("Decoded Token:", decodedToken);

        // Check if the token has expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.error("Token has expired");
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/my-account");
          return;
        }

        // Valid token
        setId(decodedToken.id);
        setRole(decodedToken.role); // Set role
      } catch (error) {
        console.error("Error decoding token:", error.message);
        toast.error("Invalid token. Please log in again.");
        logout();
        navigate("/my-account");
      }
    } else {
      console.error("No token found");
      toast.error("You need to log in first.");
      logout();
      navigate("/my-account");
    }
  }, [logout, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3006/api/coupons/create-coupon",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Coupon created successfully!");
      setFormData({
        code: "",
        discount: "",
        maxDiscountAmount: "",
        expirationDate: "",
        usageLimit: "",
        minCartValue: "",
        isActive: true,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon.");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
  };

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <ToastContainer />
      <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
        {/* Left Section - Navigation */}
        <div className="w-full md:w-1/5 mb-6 md:mb-0">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Navigation
          </h3>
          <ul className="space-y-4">
            <li>
              <Link
                to={`/superadmin-dashboard/${id}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/all-coupons"
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                👥 All Coupons
              </Link>
            </li>
            <li>
              <Link
                to="/all-orders"
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📦 Orders
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${id}`} // Use the id state
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                ⚙️ Profile
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

        {/* Right Section - Create Coupon Form */}
        <div className="w-full md:w-4/5">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create a New Coupon
            </h2>{" "}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Coupon Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter coupon code"
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Discount */}
              <div>
                <label
                  htmlFor="discount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Discount Percentage
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="Enter discount percentage"
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Max Discount Amount */}
              <div>
                <label
                  htmlFor="maxDiscountAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Maximum Discount Amount
                </label>
                <input
                  type="number"
                  id="maxDiscountAmount"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleInputChange}
                  placeholder="Enter maximum discount amount"
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label
                  htmlFor="expirationDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiration Date
                </label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Usage Limit */}
              <div>
                <label
                  htmlFor="usageLimit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Usage Limit
                </label>
                <input
                  type="number"
                  id="usageLimit"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  placeholder="Enter usage limit"
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Minimum Cart Value */}
              <div>
                <label
                  htmlFor="minCartValue"
                  className="block text-sm font-medium text-gray-700"
                >
                  Minimum Cart Value
                </label>
                <input
                  type="number"
                  id="minCartValue"
                  name="minCartValue"
                  value={formData.minCartValue}
                  onChange={handleInputChange}
                  placeholder="Enter minimum cart value"
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Is Active */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:outline-none"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;
