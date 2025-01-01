import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SingleAssignedDelivery = () => {
  const { deliveryAgentId, deliveryId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    const fetchAssignedDelivery = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3006/api/delivery-agent/${deliveryAgentId}/delivery/${deliveryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDelivery(response.data);
        setStatus(response.data.deliveryStatus);
        setComments(response.data.comments || "");
      } catch (error) {
        console.error("Error fetching delivery:", error.message);
        toast.error("Failed to fetch delivery details.");
      }
    };

    fetchAssignedDelivery();
  }, [deliveryAgentId, deliveryId]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:3006/api/delivery-agent/${deliveryAgentId}/update-delivery/${deliveryId}`,
        { status, comments },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Delivery status updated successfully.");
      setDelivery(response.data); // Update delivery state directly
    } catch (error) {
      console.error("Error updating delivery status:", error.message);
      toast.error("Failed to update delivery status.");
    }
  };

  const sendOtp = async (type) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3006/api/delivery/${deliveryId}/send-${type}-otp`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(
        `${
          type === "delivery" ? "Delivery" : "Cancellation"
        } OTP sent successfully.`
      );
      toast.success(
        `${
          type === "delivery" ? "Delivery" : "Cancellation"
        } OTP sent successfully.`
      );
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      toast.error("Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3006/api/delivery/${deliveryId}/verify-otp`,
        { otp, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("OTP verified and status updated successfully.");
      alert(`OTP verified successfully. Order has been marked as ${status}.`);
      setDelivery(response.data.deliveryTask); // Update delivery state directly
      setOtp(""); // Clear OTP input
      setIsVerifyingOtp(false); // Reset OTP verification state
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      toast.error(error.response?.data?.message || "Failed to verify OTP.");
    }
  };

  if (!delivery) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white w-full md:w-5/6 mx-auto py-6 px-4 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Assigned Delivery Details
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Details</h3>
        <p>Order ID: {delivery.orderId}</p>
        <p>Delivery Status: {delivery.deliveryStatus}</p>
        <p>Comments: {delivery.comments}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Update Status</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="Assigned">Assigned</option>
          <option value="Picked Up">Picked Up</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Not Delivered">Not Delivered</option>
          <option value="Returned">Returned</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Write comments..."
          className="w-full border rounded mt-4 p-2"
        />
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Update Status
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">
          OTP Verification
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => sendOtp("delivery")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Send Delivery OTP
          </button>
          <button
            onClick={() => sendOtp("cancellation")}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Send Cancellation OTP
          </button>
        </div>
        {isVerifyingOtp && (
          <div className="mt-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border rounded px-4 py-2 w-full"
            />
            <button
              onClick={verifyOtp}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Verify OTP
            </button>
          </div>
        )}
        {!isVerifyingOtp && (
          <button
            onClick={() => setIsVerifyingOtp(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
          >
            Start OTP Verification
          </button>
        )}
      </div>
    </div>
  );
};

export default SingleAssignedDelivery;
