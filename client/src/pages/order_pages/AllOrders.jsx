import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const dispatchOptions = ["Not Dispatched", "Dispatch", "Don't Dispatch"];
  const deliveryOptions = [
    "Assigned",
    "Picked Up",
    "Out for Delivery",
    "Pending",
    "Shipped",
    "Delivered",
    "Not Delivered",
    "Returned",
    "Cancelled",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized. Please log in.");

        const ordersResponse = await axios.get(
          "http://localhost:3006/api/get-all-orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchedOrders = ordersResponse.data.orders || [];
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
        setLoadingOrders(false);
      } catch (err) {
        setError(err.message);
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);

    const filtered = orders.filter((order) => {
      return (
        order.orderId.toLowerCase().includes(keyword) ||
        (order.user?.name && order.user.name.toLowerCase().includes(keyword)) ||
        (order.user?.email &&
          order.user.email.toLowerCase().includes(keyword)) ||
        order.products.some((product) =>
          product.product_name.toLowerCase().includes(keyword)
        ) ||
        (order.total_cost && order.total_cost.toString().includes(keyword)) ||
        (order.dispatchStatus &&
          order.dispatchStatus.toLowerCase().includes(keyword)) ||
        (order.delivery_status &&
          order.delivery_status.toLowerCase().includes(keyword))
      );
    });

    setFilteredOrders(filtered);
  };

  const updateDispatchStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3006/api/orders/${id}/update-dispatch-status`,
        { dispatchStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Dispatch status updated successfully!");
      window.location.reload(); // Reload the page
    } catch (error) {
      alert("Failed to update dispatch status.");
    }
  };

  const updateDeliveryStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3006/api/orders/${id}/update-delivery-status`,
        { delivery_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, delivery_status: newStatus } : order
          )
        );
        setFilteredOrders((prevFiltered) =>
          prevFiltered.map((order) =>
            order._id === id ? { ...order, delivery_status: newStatus } : order
          )
        );
        alert("Delivery status updated successfully!");
      } else {
        throw new Error("Failed to update delivery status.");
      }
    } catch (error) {
      alert("Failed to update delivery status.");
    }
  };

  const getStatusColor = (status, type) => {
    const colors = {
      dispatch: {
        "Not Dispatched": "text-red-600",
        Dispatch: "text-orange-600",
        "Don't Dispatch": "text-gray-600",
      },
      delivery: {
        Assigned: "text-indigo-600",
        "Picked Up": "text-teal-600",
        "Out for Delivery": "text-orange-600",
        Pending: "text-yellow-600",
        Shipped: "text-blue-600",
        Delivered: "text-green-600",
        "Not Delivered": "text-red-500",
        Returned: "text-purple-600",
        Cancelled: "text-red-600",
      },
    };

    return colors[type][status] || "text-gray-600";
  };

  if (loadingOrders) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col bg-gray-50 mt-5 mb-5 w-full md:w-5/6 mx-auto py-6 px-4 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-3xl font-semibold text-gray-700">All Orders</p>
        </div>
        <div className="relative w-1/2 md:w-1/3">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-4 pr-10 py-2 rounded-full shadow focus:outline-none focus:ring focus:ring-blue-300"
          />
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
            <FaSearch />
          </span>
        </div>
        <div>
          <a
            href="/assign-order-for-delivery"
            className="btn btn-sm border btn-outline-dark font-bold rounded-pill"
          >
            Assign Order
          </a>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg text-sm">
          <thead className="bg-gray-200 text-gray-600 uppercase text-center">
            <tr>
              <th className="py-2 px-3 text-left w-20">Order ID</th>
              <th className="py-2 px-3 text-left w-40">User</th>
              <th className="py-2 px-3 text-left w-60">Products & Quantity</th>
              <th className="py-2 px-3 text-left">Total Cost</th>
              <th className="py-2 px-3 text-left">Created At</th>
              <th className="py-2 px-3 text-left">Dispatch</th>
              <th className="py-2 px-3 text-left">Delivery</th>
              <th className="py-2 px-3 text-center">View Details</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredOrders.map((order, index) => (
              <tr
                key={order._id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="py-2 px-3 font-medium text-gray-800">
                  {order.orderId}
                </td>
                <td className="py-2 px-3 text-gray-600">
                  {order.user
                    ? `${order.user.name} (${order.user.email})`
                    : "User data not available"}
                </td>
                <td className="py-2 px-3 text-gray-600">
                  {order.products
                    .map(
                      (product) =>
                        `${product.product_name} (x${product.quantity})`
                    )
                    .join(", ")}
                </td>
                <td className="py-2 px-3 text-green-600 font-bold">
                  ₹{order.total_cost}
                </td>
                <td className="py-2 px-3 text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-3 text-center">
                  <select
                    className={`border rounded p-1 ${getStatusColor(
                      order.dispatchStatus,
                      "dispatch"
                    )}`}
                    value={order.dispatchStatus || "Select"}
                    onChange={(e) =>
                      updateDispatchStatus(order._id, e.target.value)
                    }
                  >
                    <option disabled>Select</option>
                    {dispatchOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-3 text-center">
                  <select
                    className={`border rounded p-1 ${getStatusColor(
                      order.delivery_status,
                      "delivery"
                    )}`}
                    value={order.delivery_status || "Select"}
                    onChange={(e) =>
                      updateDeliveryStatus(order._id, e.target.value)
                    }
                  >
                    <option disabled>Select</option>
                    {deliveryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-3 flex justify-center">
                  <Link
                    to={`/all-user-orders/${order.user?._id}`}
                    state={{
                      name: order.user?.name,
                      email: order.user?.email,
                    }}
                    className=" py-1 px-3"
                  >
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
