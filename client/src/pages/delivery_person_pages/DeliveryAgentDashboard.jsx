import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../components/AuthContext";
import {
  FiHome,
  FiBox,
  FiMapPin,
  FiUser,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";

const DeliveryAgentDashboard = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [counts, setCounts] = useState({
    assignedDeliveries: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setId(decodedToken.id);
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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/my-account");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchAssignedDeliveries = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:3006/api/count-assigned-deliveries?deliveryAgentId=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCounts({
          assignedDeliveries: response.data.assignedDeliveries || 0,
        });
      } catch (error) {
        console.error(
          "Error fetching assigned deliveries count:",
          error.message
        );
      }
    };

    if (id) {
      fetchAssignedDeliveries();
    }
  }, [id]);

  const filteredCards = (keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return [
      {
        title: "Assigned Deliveries",
        value: counts.assignedDeliveries,
        link: `/deliveries-by-agent/${id}`, // Link to assigned deliveries page
        category: "deliveries",
        bgColor: "bg-blue-100",
        textColor: "text-blue-500",
      },
    ].filter((card) => card.title.toLowerCase().includes(lowerKeyword));
  };

  const cardsToRender = filteredCards(searchTerm);

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row w-full md:w-5/6 mx-auto py-6 px-4 gap-6">
        {/* Modern Left Navigation */}
        <div className="w-full md:w-1/5 p-4 bg-gray-50 shadow-md rounded-lg">
          <ul className="space-y-4">
            <li>
              <Link
                to={`/delivery-agent-dashboard/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiHome size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/assigned-deliveries/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiBox size={20} />
                <span>Assigned Deliveries</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiUser size={20} />
                <span>Account Details</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                  navigate("/my-account");
                }}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-4/5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-3xl font-semibold text-gray-700">
                Delivery Agent Dashboard
              </p>
            </div>
            <div className="relative w-1/2 md:w-1/3">
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full shadow focus:outline-none focus:ring focus:ring-blue-300"
              />
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
                <FiSearch size={20} />
              </span>
            </div>
          </div>

          {/* Filtered Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-3">
            {cardsToRender.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className={`relative card h-full ${card.bgColor} border-0 shadow hover:scale-105 transition-transform`}
              >
                <div className="card-body text-center">
                  <h5 className={`card-title text-gray-900`}>{card.title}</h5>
                  <p className={`card-text ${card.textColor} text-2xl`}>
                    {card.value}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgentDashboard;
