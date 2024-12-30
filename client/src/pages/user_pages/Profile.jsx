import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserShield,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieve the user ID from the URL

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in localStorage.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3006/api/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data);
        console.log("Fetched user data:", response.data); // Debug log
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        if (error.response) {
          console.error(
            `Response Error: ${error.response.status} - ${error.response.data.message}`
          );
        }
      }
    };

    fetchUserData();
  }, [id]); // Depend on `id` to refetch if it changes

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleUpdateProfile = () => {
    navigate(`/update-profile/${userData._id}`);
  };

  const getImageUrl = (avatar, role) => {
    if (avatar) {
      // Ensure the avatar path matches the role folder dynamically
      if (avatar.startsWith("uploads/")) {
        const parts = avatar.split("/");
        if (parts[1] !== role) {
          parts[1] = role; // Replace the folder with the correct role
        }
        return `http://localhost:3006/${parts.join("/")}`;
      }
      // If avatar doesn't include "uploads/", append the role and construct the URL
      return `http://localhost:3006/uploads/${role}/${avatar}`;
    }
    // Fallback to a placeholder image
    return "https://via.placeholder.com/150";
  };

  console.log("Image URL:", getImageUrl(userData.avatar, userData.role)); // Debug log

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <motion.img
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          src={getImageUrl(userData.avatar, userData.role)}
          alt={userData.name}
          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg sm:rounded-xl mb-4 sm:mb-0 sm:mr-6"
          style={{ maxWidth: "100%", height: "auto" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150"; // Fallback for errors
          }}
        />

        <div className="w-full">
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl font-bold leading-7 text-gray-900 text-left"
          >
            Profile Information (Will Be Considered As Billing Address)
          </motion.h3>

          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <ProfileField
                icon={<FaUser className="text-indigo-600 mr-2" />}
                label="Full Name"
                value={userData.name}
              />
              <ProfileField
                icon={<FaEnvelope className="text-green-500 mr-2" />}
                label="Email Address"
                value={userData.email}
              />
              <ProfileField
                icon={<FaPhone className="text-yellow-500 mr-2" />}
                label="Phone"
                value={userData.phone || "N/A"}
              />
              <ProfileField
                icon={<FaUserShield className="text-red-500 mr-2" />}
                label="Role"
                value={userData.role}
              />
              <ProfileField
                icon={<FaMapMarkerAlt className="text-blue-500 mr-2" />}
                label="Street"
                value={userData.address?.street || "N/A"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt className="text-blue-500 mr-2" />}
                label="City"
                value={userData.address?.city || "N/A"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt className="text-blue-500 mr-2" />}
                label="State"
                value={userData.address?.state || "N/A"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt className="text-blue-500 mr-2" />}
                label="Postal Code"
                value={userData.address?.postalCode || "N/A"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt className="text-blue-500 mr-2" />}
                label="Country"
                value={userData.address?.country || "N/A"}
              />
            </dl>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="mt-6 flex justify-end"
          >
            <button
              onClick={handleUpdateProfile}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-pill hover:bg-red-700 focus:outline-none"
            >
              <MdEdit className="mr-2" />
              Update Billing Address
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
    >
      <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
        {icon} {label}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {value}
      </dd>
    </motion.div>
  );
}
