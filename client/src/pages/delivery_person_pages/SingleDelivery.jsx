import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SingleDelivery = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3006/api/single-delivery/${deliveryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDelivery(response.data);
      } catch (error) {
        console.error("Error fetching delivery:", error.message);
        toast.error("Failed to fetch delivery details.");
      }
    };

    fetchDelivery();
  }, [deliveryId]);

  if (!delivery) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this delivery? This action cannot be undone."
    );

    if (!confirmation) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3006/api/delete-delivery/${deliveryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Delivery deleted successfully.");
      navigate("/get-all-deliveries");
    } catch (error) {
      console.error("Error deleting delivery:", error.message);
      toast.error("Failed to delete delivery. Please try again.");
    }
  };

  return (
    <div className="bg-white w-full md:w-5/6 mx-auto py-6 px-4  shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Delivery Details
      </h2>

      {/* Customer Information */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Customer</h3>
        <p className="text-gray-600">
          Name: {delivery.customer?.name || "N/A"}
        </p>
        <p className="text-gray-600">
          Email: {delivery.customer?.email || "N/A"}
        </p>
        <p className="text-gray-600">
          Phone: {delivery.customer?.phone || "N/A"}
        </p>
        <p className="text-gray-600">
          Address:{" "}
          {delivery.customer?.address
            ? `${delivery.customer.address.street || ""}, ${
                delivery.customer.address.city || ""
              }, ${delivery.customer.address.state || ""}, ${
                delivery.customer.address.postalCode || ""
              }, ${delivery.customer.address.country || ""}`
            : "N/A"}
        </p>
      </div>

      {/* Outlet Information */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Outlet</h3>
        <p className="text-gray-600">Name: {delivery.outlet?.name || "N/A"}</p>
        <p className="text-gray-600">
          Email: {delivery.outlet?.outlet_email || "N/A"}
        </p>
        <p className="text-gray-600">
          Address:{" "}
          {delivery.outlet?.outlet_address
            ? `${delivery.outlet.outlet_address.street || ""}, ${
                delivery.outlet.outlet_address.city || ""
              }, ${delivery.outlet.outlet_address.state || ""}, ${
                delivery.outlet.outlet_address.zip_code || ""
              }, ${delivery.outlet.outlet_address.country || ""}`
            : "N/A"}
        </p>
      </div>

      {/* Delivery Agent Information */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Delivery Agent</h3>
        <p className="text-gray-600">
          Name: {delivery.deliveryAgent?.name || "N/A"}
        </p>
        <p className="text-gray-600">
          Email: {delivery.deliveryAgent?.email || "N/A"}
        </p>
        <p className="text-gray-600">
          Phone: {delivery.deliveryAgent?.phone || "N/A"}
        </p>
      </div>

      {/* Order Information */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Order</h3>
        <p className="text-gray-600">Order ID: {delivery.orderId || "N/A"}</p>
        <p className="text-gray-600">
          Delivery Status: {delivery.deliveryStatus || "N/A"}
        </p>
        <h4 className="text-lg font-semibold text-gray-700 mt-4">Products:</h4>
        <ul className="list-disc ml-6">
          {delivery.products?.length > 0
            ? delivery.products.map((product, index) => (
                <li key={index} className="text-gray-600">
                  {product.product_name || "N/A"} - Quantity:{" "}
                  {product.quantity || "N/A"}
                </li>
              ))
            : "No products available."}
        </ul>
      </div>

      {/* Status Timings */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Status Timings</h3>
        {delivery.statusTimings
          ? Object.entries(delivery.statusTimings).map(([key, value]) => (
              <p key={key} className="text-gray-600">
                {key.replace(/([A-Z])/g, " $1")}:{" "}
                {value ? new Date(value).toLocaleString() : "Not updated"}
              </p>
            ))
          : "No status timings available."}
      </div>

      {/* History */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">History</h3>
        <ul className="list-disc ml-6">
          {delivery.history?.length > 0
            ? delivery.history.map((record, index) => (
                <li key={index} className="text-gray-600">
                  {record.status || "N/A"} -{" "}
                  {record.timestamp
                    ? new Date(record.timestamp).toLocaleString()
                    : "N/A"}
                </li>
              ))
            : "No history available."}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        >
          Delete Delivery
        </button>
      </div>
    </div>
  );
};

export default SingleDelivery;
