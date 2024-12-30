import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AllOutlets() {
  const [outlets, setOutlets] = useState([]); // State to hold fetched outlets
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch outlets from the backend
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3006/api/all-outlets"
        );
        setOutlets(response.data);
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };

    fetchOutlets();
  }, []);

  // Function to display location correctly
  const displayLocation = (outlet_address) => {
    if (!outlet_address) return "N/A";
    const { street, city, state, zip_code, country } = outlet_address;
    return [street, city, state, zip_code, country].filter(Boolean).join(", ");
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center flex-wrap">
          {/* Left section: Heading */}
          <div>
            <h2 className="text-left text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              All Outlets
            </h2>
          </div>
          {/* Right section: View Icons, Search Field, and Add Outlet Button */}
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
              <FaSearch className="absolute left-3 top-2 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-1 border rounded-md focus:outline-none text-sm"
                placeholder="Search outlets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/add-outlet">
              <button className="ml-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-1 px-3 rounded-md shadow hover:opacity-90 transition-opacity text-sm">
                Add Outlet
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-10">
          {/* Grid View */}
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {outlets
                .filter((outlet) =>
                  [
                    outlet?.outlet_name,
                    outlet?.outlet_address?.street,
                    outlet?.outlet_address?.city,
                    outlet?.outlet_address?.state,
                    outlet?.company_name,
                  ]
                    .map((field) => field?.toLowerCase() || "")
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((outlet) => (
                  <Link
                    key={outlet._id}
                    to={`/single-outlet/${outlet._id}`}
                    className="flex flex-col items-start bg-white rounded-lg shadow p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 text-left">
                      {outlet.outlet_name || "Unknown Outlet"}
                    </h3>
                    <p className="text-sm text-gray-600 text-left mt-2">
                      Location: {displayLocation(outlet.outlet_address)}
                    </p>
                    <p className="text-sm text-gray-600 text-left mt-1">
                      Company: {outlet.company_name || "N/A"}
                    </p>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
