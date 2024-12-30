import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa"; // Import trash icon from react-icons
import { AuthContext } from "../../components/AuthContext";

const AllCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3006/api/coupons/get-all-coupons"
        );
        setCoupons(response.data);
        setFilteredCoupons(response.data);
      } catch (error) {
        toast.error("Failed to fetch coupons.");
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCoupons(coupons);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = coupons.filter(
        (coupon) =>
          coupon.code.toLowerCase().includes(query) ||
          String(coupon.discount).includes(query) ||
          String(coupon.maxDiscountAmount).includes(query) ||
          coupon.expirationDate.toLowerCase().includes(query) ||
          String(coupon.usageLimit).includes(query) ||
          String(coupon.minCartValue).includes(query)
      );
      setFilteredCoupons(filtered);
    }
  }, [searchQuery, coupons]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (couponId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this coupon?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:3006/api/coupons/delete-coupon/${couponId}`
      );
      toast.success("Coupon deleted successfully.");
      setCoupons(coupons.filter((coupon) => coupon._id !== couponId));
      setFilteredCoupons(
        filteredCoupons.filter((coupon) => coupon._id !== couponId)
      );
    } catch (error) {
      toast.error("Failed to delete coupon.");
    }
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
                to="/superadmin-dashboard"
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/create-coupon"
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                ➕ Create Coupon
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
                to="/profile"
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                ⚙️ Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section - Coupons List */}
        <div className="w-full md:w-4/5">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Coupons</h2>
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="rounded-lg border border-gray-300 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Coupons List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="relative bg-white shadow-md rounded-lg p-4 border border-gray-200"
                  >
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={20} />
                    </button>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {coupon.code}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Discount: {coupon.discount}%<br />
                      Max Discount: ₹{coupon.maxDiscountAmount || "N/A"}
                      <br />
                      Expiry:{" "}
                      {new Date(coupon.expirationDate).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/single-coupon/${coupon._id}`}
                      className="mt-4 inline-block bg-orange-700 text-white py-2 px-4 rounded-pill hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      View Details
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 w-full">
                  No coupons found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCoupons;
