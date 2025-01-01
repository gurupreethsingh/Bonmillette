// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
// import { toast } from "react-toastify";

// const DeliveriesByAgent = () => {
//   const { id: id } = useParams();
//   const [deliveries, setDeliveries] = useState([]); // State to hold deliveries
//   const [view, setView] = useState("grid"); // View mode: grid, list, card
//   const [searchQuery, setSearchQuery] = useState(""); // Search query

//   useEffect(() => {
//     const fetchDeliveries = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:3006/api/deliveries-by-agent/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setDeliveries(response.data);
//       } catch (error) {
//         console.error("Error fetching deliveries:", error.message);
//         toast.error("Failed to fetch deliveries.");
//       }
//     };

//     fetchDeliveries();
//   }, [id]);

//   const filteredDeliveries = deliveries.filter((delivery) =>
//     ["customer.name", "deliveryStatus", "orderId"]
//       .map((key) => {
//         const keys = key.split(".");
//         let value = delivery;
//         for (const k of keys) {
//           value = value?.[k];
//         }
//         return value?.toLowerCase() || "";
//       })
//       .some((field) => field.includes(searchQuery.toLowerCase()))
//   );

//   return (
//     <div className="bg-white py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         <div className="flex justify-between items-center flex-wrap">
//           <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//             Deliveries Assigned to Agent
//           </h2>
//           <div className="flex items-center space-x-4 flex-wrap">
//             <FaThList
//               className={`text-xl cursor-pointer ${
//                 view === "list" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               onClick={() => setView("list")}
//             />
//             <FaThLarge
//               className={`text-xl cursor-pointer ${
//                 view === "card" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               onClick={() => setView("card")}
//             />
//             <FaTh
//               className={`text-xl cursor-pointer ${
//                 view === "grid" ? "text-indigo-600" : "text-gray-600"
//               }`}
//               onClick={() => setView("grid")}
//             />
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
//                 placeholder="Search deliveries..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mt-10">
//           {view === "grid" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//               {filteredDeliveries.map((delivery) => (
//                 <Link
//                   key={delivery._id}
//                   to={`/single-delivery/${delivery._id}`}
//                   className="flex flex-col items-start relative p-4 border rounded-lg shadow-md hover:shadow-lg"
//                 >
//                   <h3 className="mt-2 text-md font-semibold text-gray-900 text-left">
//                     Order ID: {delivery.orderId}
//                   </h3>
//                   <p className="text-sm text-gray-600 text-left">
//                     Customer: {delivery.customer?.name || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-600 text-left">
//                     Status: {delivery.deliveryStatus}
//                   </p>
//                 </Link>
//               ))}
//             </div>
//           )}

//           {view === "card" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredDeliveries.map((delivery) => (
//                 <Link
//                   key={delivery._id}
//                   to={`/single-delivery/${delivery._id}`}
//                   className="flex flex-col items-start bg-white rounded-lg shadow relative p-6 border"
//                 >
//                   <h3 className="mt-4 text-lg font-semibold text-gray-900 text-left">
//                     Order ID: {delivery.orderId}
//                   </h3>
//                   <p className="mt-2 text-sm text-gray-600 text-left">
//                     Customer: {delivery.customer?.name || "N/A"}
//                   </p>
//                   <p className="mt-2 text-sm text-gray-600 text-left">
//                     Status: {delivery.deliveryStatus}
//                   </p>
//                 </Link>
//               ))}
//             </div>
//           )}

//           {view === "list" && (
//             <div className="space-y-6">
//               {filteredDeliveries.map((delivery) => (
//                 <Link
//                   key={delivery._id}
//                   to={`/single-delivery/${delivery._id}`}
//                   className="flex items-center space-x-4 bg-white rounded-lg shadow relative p-6 border"
//                 >
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 text-left">
//                       Order ID: {delivery.orderId}
//                     </h3>
//                     <p className="text-sm text-gray-600 text-left">
//                       Customer: {delivery.customer?.name || "N/A"}
//                     </p>
//                     <p className="text-sm text-gray-600 text-left">
//                       Status: {delivery.deliveryStatus}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveriesByAgent;

//

import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

const DeliveriesByAgent = () => {
  const { id: deliveryAgentId } = useParams(); // Use deliveryAgentId for clarity
  const [deliveries, setDeliveries] = useState([]); // State to hold deliveries
  const [view, setView] = useState("grid"); // View mode: grid, list, card
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3006/api/deliveries-by-agent/${deliveryAgentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDeliveries(response.data);
      } catch (error) {
        console.error("Error fetching deliveries:", error.message);
        toast.error("Failed to fetch deliveries.");
      }
    };

    fetchDeliveries();
  }, [deliveryAgentId]);

  const filteredDeliveries = deliveries.filter((delivery) =>
    ["customer.name", "deliveryStatus", "orderId"]
      .map((key) => {
        const keys = key.split(".");
        let value = delivery;
        for (const k of keys) {
          value = value?.[k];
        }
        return value?.toLowerCase() || "";
      })
      .some((field) => field.includes(searchQuery.toLowerCase()))
  );

  // Navigate to the single assigned delivery page
  const handleCardClick = (deliveryId) => {
    navigate(`/delivery-agent/${deliveryAgentId}/delivery/${deliveryId}`);
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Deliveries Assigned to Agent
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
                <div
                  key={delivery._id}
                  onClick={() => handleCardClick(delivery._id)}
                  className="flex flex-col items-start relative p-4 border rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                >
                  <h3 className="mt-2 text-md font-semibold text-gray-900 text-left">
                    Order ID: {delivery.orderId}
                  </h3>
                  <p className="text-sm text-gray-600 text-left">
                    Customer: {delivery.customer?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 text-left">
                    Status: {delivery.deliveryStatus}
                  </p>
                </div>
              ))}
            </div>
          )}

          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeliveries.map((delivery) => (
                <div
                  key={delivery._id}
                  onClick={() => handleCardClick(delivery._id)}
                  className="flex flex-col items-start bg-white rounded-lg shadow relative p-6 border cursor-pointer"
                >
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 text-left">
                    Order ID: {delivery.orderId}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 text-left">
                    Customer: {delivery.customer?.name || "N/A"}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 text-left">
                    Status: {delivery.deliveryStatus}
                  </p>
                </div>
              ))}
            </div>
          )}

          {view === "list" && (
            <div className="space-y-6">
              {filteredDeliveries.map((delivery) => (
                <div
                  key={delivery._id}
                  onClick={() => handleCardClick(delivery._id)}
                  className="flex items-center space-x-4 bg-white rounded-lg shadow relative p-6 border cursor-pointer"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 text-left">
                      Order ID: {delivery.orderId}
                    </h3>
                    <p className="text-sm text-gray-600 text-left">
                      Customer: {delivery.customer?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 text-left">
                      Status: {delivery.deliveryStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveriesByAgent;
