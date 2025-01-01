import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const AllDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]); // State to hold fetched deliveries
  const [view, setView] = useState("grid"); // View mode: grid, list, card
  const [searchQuery, setSearchQuery] = useState(""); // Search query

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3006/api/get-all-deliveries",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDeliveries(response.data);
      } catch (error) {
        console.error("Error fetching deliveries:", error.message);
        toast.error("Failed to fetch deliveries.");
      }
    };

    fetchDeliveries();
  }, []);

  const handleDeleteDelivery = async (deliveryId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this delivery? This action cannot be undone."
    );

    if (!confirmation) return;

    try {
      const response = await axios.delete(
        `http://localhost:3006/api/delete-delivery/${deliveryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Delivery deleted successfully.");
        setDeliveries(
          deliveries.filter((delivery) => delivery._id !== deliveryId)
        ); // Remove deleted delivery from the UI
      } else {
        throw new Error("Failed to delete delivery.");
      }
    } catch (error) {
      console.error("Error deleting delivery:", error.message);
      toast.error("Error deleting delivery. Please try again.");
    }
  };

  const filteredDeliveries = deliveries.filter((delivery) =>
    ["orderId", "deliveryStatus", "deliveryNotes"]
      .map((key) => delivery[key]?.toLowerCase() || "") // Ensure safe access
      .some((field) => field.includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            All Deliveries
          </h2>
          <div className="flex items-center space-x-4 flex-wrap">
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("grid")}
            />
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search deliveries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredDeliveries.map((delivery) => (
                <Link
                  key={delivery._id}
                  to={`/single-delivery/${delivery._id}`}
                  className="flex flex-col items-start relative shadow p-3 rounded"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation on delete
                      handleDeleteDelivery(delivery._id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                    title="Delete Delivery"
                  >
                    <FaTrash />
                  </button>
                  <h3 className="mt-2 text-md font-semibold text-gray-900 text-left">
                    Order ID: {delivery.orderId}
                  </h3>
                  <p className="text-sm text-gray-600 text-left">
                    Status: {delivery.deliveryStatus}
                  </p>
                  <p className="text-sm text-gray-600 text-left">
                    Notes: {delivery.deliveryNotes || "No Notes"}
                  </p>
                </Link>
              ))}
            </div>
          )}
          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeliveries.map((delivery) => (
                <Link
                  key={delivery._id}
                  to={`/single-delivery/${delivery._id}`}
                  className="flex flex-col items-start bg-white rounded-lg shadow relative p-3"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation on delete
                      handleDeleteDelivery(delivery._id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                    title="Delete Delivery"
                  >
                    <FaTrash />
                  </button>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 text-left">
                    Order ID: {delivery.orderId}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 text-left">
                    Status: {delivery.deliveryStatus}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 text-left">
                    Notes: {delivery.deliveryNotes || "No Notes"}
                  </p>
                </Link>
              ))}
            </div>
          )}
          {view === "list" && (
            <div className="space-y-6">
              {filteredDeliveries.map((delivery) => (
                <Link
                  key={delivery._id}
                  to={`/single-delivery/${delivery._id}`}
                  className="flex items-center space-x-4 bg-white rounded-lg shadow relative"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation on delete
                      handleDeleteDelivery(delivery._id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                    title="Delete Delivery"
                  >
                    <FaTrash />
                  </button>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 text-left">
                      Order ID: {delivery.orderId}
                    </h3>
                    <p className="text-sm text-gray-600 text-left">
                      Status: {delivery.deliveryStatus}
                    </p>
                    <p className="text-sm text-gray-600 text-left">
                      Notes: {delivery.deliveryNotes || "No Notes"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDeliveries;
