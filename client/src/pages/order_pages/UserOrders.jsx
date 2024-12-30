import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/AuthContext";
import { MdEdit } from "react-icons/md";

const UserOrders = () => {
  const { id } = useParams();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("dateDesc");
  const [userDetails, setUserDetails] = useState({
    name: location.state?.name || "Unknown User",
    email: location.state?.email || "Unknown Email",
  });

  useEffect(() => {
    const fetchOrdersAndIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized. Please log in.");
        }

        const [ordersResponse, issuesResponse] = await Promise.all([
          axios.get(`http://localhost:3006/api/all-user-orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3006/api/get-all-issues", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const fetchedOrders = ordersResponse.data.orders || [];
        const fetchedIssues = issuesResponse.data.issues || [];

        const unresolvedIssues = fetchedIssues.filter(
          (issue) => issue.status !== "closed" && issue.order_id?.orderId
        );

        fetchedOrders.forEach((order) => {
          const match = unresolvedIssues.some(
            (issue) => String(issue.order_id.orderId) === String(order.orderId)
          );
          order.hasUnresolvedIssue = match;
        });

        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndIssues();
  }, [id]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orders.filter((order) =>
      [order.orderId, userDetails.name, userDetails.email]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
    setFilteredOrders(filtered);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    const filtered =
      status === "All"
        ? orders
        : orders.filter((order) => order.delivery_status === status);
    setFilteredOrders(filtered);
  };

  const sortOrders = (orderList, sort) => {
    const sorted = [...orderList].sort((a, b) => {
      if (sort === "priceAsc") return a.total_cost - b.total_cost;
      if (sort === "priceDesc") return b.total_cost - a.total_cost;
      if (sort === "dateAsc")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFilteredOrders(sorted);
  };

  const handleSort = (e) => {
    const sort = e.target.value;
    setSortOrder(sort);
    sortOrders(filteredOrders, sort);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading user's orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col bg-white mt-5 mb-5 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 text-left">
            Orders for {userDetails.name}
          </h1>
          <p className="text-gray-600">Email: {userDetails.email}</p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by Order ID"
            className="border border-gray-300 rounded-full py-2 px-4 w-full sm:w-64 focus:outline-none focus:ring focus:ring-blue-200"
            value={searchTerm}
            onChange={handleSearch}
          />

          <select
            value={sortOrder}
            onChange={handleSort}
            className="border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="dateDesc">Sort by Date (Newest)</option>
            <option value="dateAsc">Sort by Date (Oldest)</option>
            <option value="priceDesc">Sort by Price (High to Low)</option>
            <option value="priceAsc">Sort by Price (Low to High)</option>
          </select>

          <div className="flex gap-2 flex-wrap">
            {["All", "Pending", "Shipped", "Delivered", "Canceled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`py-2 px-4 rounded-full shadow-md transition text-sm ${
                    statusFilter === status
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg text-sm">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 w-1/6">Order ID</th>
                <th className="py-3 px-4 w-1/4">Products</th>
                <th className="py-3 px-4 w-1/6">Total Cost</th>
                <th className="py-3 px-4 w-1/6">Order Date</th>
                <th className="py-3 px-4 w-1/6">Dispatch Status</th>
                <th className="py-3 px-4 w-1/6">Delivery Status</th>
                <th className="py-3 px-4 w-1/6">Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-3 px-4 relative">
                    {order.orderId}
                    {order.hasUnresolvedIssue && (
                      <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    )}
                  </td>
                  <td className="py-3 px-4 truncate">
                    {order.products
                      .map(
                        (product) =>
                          `${product.product_name} (x${product.quantity})`
                      )
                      .join(", ")}
                  </td>
                  <td className="py-3 px-4">₹{order.total_cost}</td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className={`py-3 px-4 font-semibold ${
                      order.dispatchStatus === "Dispatched"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {order.dispatchStatus || "Not Dispatched"}
                  </td>
                  <td
                    className={`py-3 px-4 font-semibold ${
                      order.delivery_status === "Pending"
                        ? "text-orange-500"
                        : order.delivery_status === "Shipped"
                        ? "text-blue-500"
                        : order.delivery_status === "Delivered"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {order.delivery_status || "Unknown"}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/update-order/${order._id}`}
                      state={{
                        orderId: order.orderId,
                        delivery_status: order.delivery_status,
                        dispatch_status: order.dispatch_status,
                        products: order.products,
                        total_cost: order.total_cost,
                        createdAt: order.createdAt,
                        billing_address: order.billing_address,
                        shipping_address: order.shipping_address,
                        user: order.user,
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <MdEdit />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          No orders found for this user.
        </p>
      )}
    </div>
  );
};

export default UserOrders;
