import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SingleCoupon = () => {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCouponDetails = async () => {
      try {
        const couponResponse = await axios.get(
          `http://localhost:3006/api/coupons/get-coupon-by-id/${id}`
        );
        const historyResponse = await axios.get(
          `http://localhost:3006/api/coupons/get-coupon-history/${id}`
        );

        setCoupon(couponResponse.data);
        setHistory(historyResponse.data);
        setFormData(couponResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coupon details:", error);
        toast.error("Failed to load coupon details.");
      }
    };

    fetchCouponDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3006/api/coupons/update-coupon/${id}`,
        formData
      );
      toast.success("Coupon updated successfully!");
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error("Failed to update coupon.");
    }
  };

  const expiryColor =
    coupon && new Date(coupon.expirationDate) < new Date()
      ? "text-red-500"
      : "text-green-500";

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
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
                to="/all-coupons"
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                👥 All Coupons
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
          </ul>
        </div>

        {/* Right Section - Coupon Details */}
        <div className="w-full md:w-4/5">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupon Details */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Coupon Details
                </h2>
                <form onSubmit={handleUpdateCoupon} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-gray-300 p-2 text-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-gray-300 p-2 text-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max Discount Amount
                    </label>
                    <input
                      type="number"
                      name="maxDiscountAmount"
                      value={formData.maxDiscountAmount || ""}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-gray-300 p-2 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      name="expirationDate"
                      value={
                        formData.expirationDate
                          ? formData.expirationDate.split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-gray-300 p-2 text-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit || ""}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-gray-300 p-2 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum Cart Value
                    </label>
                    <input
                      type="number"
                      name="minCartValue"
                      value={formData.minCartValue || ""}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-gray-300 p-2 text-gray-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                  >
                    Update Coupon
                  </button>
                </form>
              </div>

              {/* Coupon History */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Coupon History
                </h2>
                <p>
                  <strong>Expiry:</strong>{" "}
                  <span className={expiryColor}>
                    {new Date(coupon.expirationDate).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <strong>Times Used:</strong> {coupon.usedCount}
                </p>
                <p>
                  <strong>Remaining Uses:</strong>{" "}
                  {coupon.usageLimit - coupon.usedCount || "Unlimited"}
                </p>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Usage Details:
                  </h3>
                  <ul className="mt-2">
                    {history.length > 0 ? (
                      history.map((entry) => (
                        <li
                          key={entry._id}
                          className="border-b border-gray-300 py-2"
                        >
                          <p>
                            <strong>Product:</strong>{" "}
                            <span className="text-gray-700">
                              {entry.productId?.name || "N/A"}
                            </span>
                          </p>
                          <p>
                            <strong>User:</strong>{" "}
                            <span className="text-gray-700">
                              {entry.userId?.name || "Unknown User"} (
                              {entry.userId?.email || "No Email"})
                            </span>
                          </p>
                          <p>
                            <strong>Discount Applied:</strong> ₹
                            {entry.discountApplied}
                          </p>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500">No usage history found.</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCoupon;
