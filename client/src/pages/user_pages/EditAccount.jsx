import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const EditAccount = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null); // Store user role

  // Extract user ID and role from the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setId(decodedToken.id); // Assuming the token contains the user ID as `id`
        setRole(decodedToken.role); // Assuming the token contains the user's role as `role`
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
        navigate("/my-account");
      }
    } else {
      logout();
      navigate("/my-account");
    }
  }, [logout, navigate]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/my-account");
    }
  }, [isLoggedIn, navigate]);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3006/api/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        navigate("/my-account");
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id, navigate]);

  // Logout function
  const handleLogout = () => {
    logout();
    navigate("/my-account");
  };

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const togglePasswordVisibility = (passwordType) => {
    if (passwordType === "current") {
      setShowCurrentPassword((prevState) => !prevState);
    } else if (passwordType === "new") {
      setShowNewPassword((prevState) => !prevState);
    } else if (passwordType === "confirm") {
      setShowConfirmPassword((prevState) => !prevState);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation and submission logic here
    console.log("Form data submitted:", formData);
    if (profileImage) {
      console.log("Profile image uploaded:", profileImage.name);
    }
  };

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
        {/* Left Section */}
        <div className="w-full md:w-1/5 mb-6 md:mb-0">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Navigation
          </h3>
          <ul className="space-y-4">
            <li>
              <Link
                to={`/${
                  role === "superadmin"
                    ? "superadmin-dashboard"
                    : "user-dashboard"
                }/${id}`}
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

        {/* Right Section */}
        <div className="w-full md:w-4/5">
          <p className="mb-5 font-semibold text-xl">Reset Password</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Profile Image Upload */}
            <div>
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Profile Image
              </label>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Change */}
            <fieldset className="border rounded-md p-4">
              <legend className="text-lg font-semibold text-gray-700">
                Password Change
              </legend>

              {/* Current Password */}
              <div className="mt-4">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Password (leave blank to keep unchanged)
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-500"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showCurrentPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mt-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password (leave blank to keep unchanged)
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$"
                    title="Must contain 1 uppercase, 1 lowercase, 1 number, 1 special character, and be 6-15 characters long"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-500"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showNewPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mt-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-500"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </fieldset>

            {/* Save Changes Button */}
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
