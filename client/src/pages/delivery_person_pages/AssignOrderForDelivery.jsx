import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignOrderForDelivery = () => {
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [assignedAgent, setAssignedAgent] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedOutletDetails, setSelectedOutletDetails] = useState(null);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized. Please log in.");

        const [agentsResponse, ordersResponse, outletsResponse] =
          await Promise.all([
            axios.get("http://localhost:3006/api/delivery-agents", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:3006/api/get-all-orders", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:3006/api/all-outlets", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setDeliveryAgents(agentsResponse.data);
        setOrders(ordersResponse.data.orders);
        setOutlets(outletsResponse.data); // Populate outlets
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOrderSelection = async (orderId) => {
    setSelectedOrder(orderId);
    try {
      const token = localStorage.getItem("token");
      const orderResponse = await axios.get(
        `http://localhost:3006/api/get-order-details-by-orderid/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrderDetails(orderResponse.data.order); // Update state with full order details
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to fetch order details.");
    }
  };

  const handleOutletSelection = (outletId) => {
    const outlet = outlets.find((out) => out._id === outletId);
    setSelectedOutlet(outletId);
    setSelectedOutletDetails(outlet || null);
  };

  const formatAddress = (address) => {
    if (!address) return "Not provided";
    const { street, city, state, zip_code, country } = address;
    return `${street}, ${city}, ${state}, ${zip_code}, ${country}`;
  };

  const handleAssignOrder = async () => {
    if (!assignedAgent || !selectedOrder || !selectedOutlet) {
      alert("Please select all required fields.");
      return;
    }

    const confirmAssignment = window.confirm(
      "Are you sure you want to assign this order?"
    );
    if (!confirmAssignment) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3006/api/assign-order-for-delivery",
        {
          orderId: selectedOrder,
          deliveryAgentId: assignedAgent,
          outletId: selectedOutlet,
          message: deliveryMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order assigned successfully!");
    } catch (err) {
      console.error("Error assigning order:", err);
      alert("Failed to assign the order. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Assign Delivery Page
      </h1>

      <div className="bg-white p-6 shadow-lg rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Delivery Agent
            </label>
            <select
              value={assignedAgent}
              onChange={(e) => setAssignedAgent(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            >
              <option value="">-- Select an Agent --</option>
              {deliveryAgents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name} ({agent.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Order ID
            </label>
            <select
              value={selectedOrder || ""}
              onChange={(e) => handleOrderSelection(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            >
              <option value="">-- Select an Order --</option>
              {orders.map((order) => (
                <option key={order._id} value={order.orderId}>
                  {order.orderId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Outlet
            </label>
            <select
              value={selectedOutlet}
              onChange={(e) => handleOutletSelection(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            >
              <option value="">-- Select an Outlet --</option>
              {outlets.map((outlet) => (
                <option key={outlet._id} value={outlet._id}>
                  {outlet.outlet_name} ({outlet.location})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedOutletDetails && (
          <div className="border p-4 rounded bg-gray-50 mb-6">
            <h3 className="text-lg font-semibold mb-4">Outlet Details</h3>
            <p>
              <strong>Name:</strong> {selectedOutletDetails.outlet_name}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {formatAddress(selectedOutletDetails.outlet_address)}
            </p>
            <p>
              <strong>Email:</strong> {selectedOutletDetails.outlet_email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOutletDetails.outlet_phone}
            </p>
          </div>
        )}

        {/* Order Details Section */}
        {orderDetails && (
          <div className="border p-4 rounded bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <p>
              <strong>Customer Name:</strong> {orderDetails.user?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {orderDetails.user?.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {orderDetails.user?.phone || "N/A"}
            </p>
            <p>
              <strong>Billing Address:</strong>{" "}
              {orderDetails.billing_address
                ? `${orderDetails.billing_address.street}, ${orderDetails.billing_address.city}, ${orderDetails.billing_address.state}, ${orderDetails.billing_address.postalCode}, ${orderDetails.billing_address.country}`
                : "N/A"}
            </p>
            <p>
              <strong>Shipping Address:</strong>{" "}
              {orderDetails.shipping_address
                ? `${orderDetails.shipping_address.street}, ${orderDetails.shipping_address.city}, ${orderDetails.shipping_address.state}, ${orderDetails.shipping_address.postalCode}, ${orderDetails.shipping_address.country}`
                : "N/A"}
            </p>
            <p>
              <strong>Products:</strong>
            </p>
            <ul className="list-disc ml-5">
              {orderDetails.products.map((product, index) => (
                <li key={index}>
                  {product.name} - Quantity: {product.quantity}
                </li>
              ))}
            </ul>
            <p>
              <strong>Total Cost:</strong> ₹{orderDetails.total_cost}
            </p>
            <p>
              <strong>Order Status:</strong> {orderDetails.status}
            </p>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Message to Delivery Agent
          </label>
          <textarea
            value={deliveryMessage}
            onChange={(e) => setDeliveryMessage(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
            rows="4"
            placeholder="Enter any instructions for the delivery agent"
          ></textarea>
        </div>

        <button
          onClick={handleAssignOrder}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full md:w-auto"
        >
          Assign Order
        </button>
      </div>
    </div>
  );
};

export default AssignOrderForDelivery;
