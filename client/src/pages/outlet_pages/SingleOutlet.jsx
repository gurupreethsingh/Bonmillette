// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaBuilding,
//   FaMapMarkerAlt,
//   FaBox,
// } from "react-icons/fa";

// const SingleOutlet = () => {
//   const { outletId } = useParams();
//   const [outlet, setOutlet] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOutletDetails = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3006/api/get-outlet-by-id/${outletId}`
//         );
//         setOutlet(response.data);
//       } catch (error) {
//         console.error("Error fetching outlet details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOutletDetails();
//   }, [outletId]);

//   if (loading) {
//     return <div>Loading outlet details...</div>;
//   }

//   if (!outlet) {
//     return <div>Outlet not found</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {/* Left Column - Outlet Details */}
//         <div>
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
//             <h3 className="text-lg font-semibold leading-7 text-gray-900">
//               Outlet Information
//             </h3>
//             <div className="flex space-x-2 mt-2 sm:mt-0">
//               <Link to="/all-outlets">
//                 <button className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-1 px-3 rounded-md shadow text-sm hover:opacity-90 transition-opacity">
//                   Go to All Outlets
//                 </button>
//               </Link>
//             </div>
//           </div>

//           <div className="border-t border-gray-100 mt-6">
//             <dl className="divide-y divide-gray-100">
//               <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaUser className="text-indigo-600 mr-2" /> Outlet Name
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {outlet.outlet_name}
//                 </dd>
//               </div>

//               <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaEnvelope className="text-green-500 mr-2" /> Outlet Email
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {outlet.outlet_email}
//                 </dd>
//               </div>

//               <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaPhone className="text-yellow-500 mr-2" /> Outlet Phone
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {outlet.outlet_phone}
//                 </dd>
//               </div>

//               <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaMapMarkerAlt className="text-red-500 mr-2" /> Address
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   <p>Street: {outlet.outlet_address.street}</p>
//                   <p>City: {outlet.outlet_address.city}</p>
//                   <p>State: {outlet.outlet_address.state}</p>
//                   <p>Zip Code: {outlet.outlet_address.zip_code}</p>
//                   <p>Country: {outlet.outlet_address.country}</p>
//                 </dd>
//               </div>

//               <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//                 <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
//                   <FaBuilding className="text-blue-600 mr-2" /> Company Name
//                 </dt>
//                 <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
//                   {outlet.company_name}
//                 </dd>
//               </div>
//             </dl>
//           </div>
//         </div>

//         {/* Right Column - Outlet Products */}
//         <div>
//           <h3 className="text-lg font-semibold leading-7 text-gray-900 mb-4">
//             Products ({outlet.products.length})
//           </h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {outlet.products.map(({ product, quantity }, index) =>
//               product ? (
//                 <div
//                   key={product._id || index}
//                   className={`rounded-lg shadow p-4 flex flex-col items-center text-center ${
//                     quantity <= 5
//                       ? "bg-red-500 text-white animate-pulse"
//                       : quantity <= 20
//                       ? "bg-yellow-300 text-gray-900"
//                       : "bg-green-200 text-gray-900"
//                   }`}
//                   style={
//                     quantity <= 5
//                       ? {
//                           animation: "pulse 1.5s infinite",
//                           transformOrigin: "center",
//                         }
//                       : {}
//                   }
//                 >
//                   {product.product_image ? (
//                     <img
//                       src={`http://localhost:3006/${product.product_image}`}
//                       alt={product.product_name}
//                       className="h-16 w-16 object-cover rounded-full mb-2"
//                     />
//                   ) : (
//                     <FaBox className="text-3xl" />
//                   )}
//                   <p className="mt-2 text-sm font-medium">
//                     {product.product_name}
//                   </p>
//                   <p className="mt-1 text-xs">Stock: {quantity || "N/A"}</p>
//                 </div>
//               ) : (
//                 <div
//                   key={index}
//                   className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center"
//                 >
//                   <FaBox className="text-3xl text-gray-400" />
//                   <p className="mt-2 text-sm text-gray-500">
//                     Product not available
//                   </p>
//                 </div>
//               )
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Animation styles */}
//       <style>
//         {`
//         @keyframes pulse {
//           0%, 100% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.05);
//           }
//         }
//         `}
//       </style>
//     </div>
//   );
// };

// export default SingleOutlet;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaBox,
} from "react-icons/fa";

const SingleOutlet = () => {
  const { outletId } = useParams();
  const [outlet, setOutlet] = useState(null);
  const [products, setProducts] = useState([]); // Separate state for products
  const [loading, setLoading] = useState(true);

  // Fetch outlet details
  useEffect(() => {
    const fetchOutletDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/get-outlet-by-id/${outletId}`
        );
        setOutlet(response.data);
      } catch (error) {
        console.error("Error fetching outlet details:", error);
      }
    };

    fetchOutletDetails();
  }, [outletId]);

  // Fetch products for the outlet
  useEffect(() => {
    const fetchOutletProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/products-by-outlet/${outletId}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching outlet products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutletProducts();
  }, [outletId]);

  if (loading) {
    return <div>Loading outlet details...</div>;
  }

  if (!outlet) {
    return <div>Outlet not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Column - Outlet Details */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-semibold leading-7 text-gray-900">
              Outlet Information
            </h3>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <Link to="/all-outlets">
                <button className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-1 px-3 rounded-md shadow text-sm hover:opacity-90 transition-opacity">
                  Go to All Outlets
                </button>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-6">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaUser className="text-indigo-600 mr-2" /> Outlet Name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {outlet.outlet_name}
                </dd>
              </div>
              {/* Other details */}
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaBuilding className="text-blue-600 mr-2" /> Company Name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {outlet.company_name}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column - Outlet Products */}
        <div>
          <h3 className="text-lg font-semibold leading-7 text-gray-900 mb-4">
            Products ({products.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div
                  key={product._id || index}
                  className={`rounded-lg shadow p-4 flex flex-col items-center text-center ${
                    product.stock <= 5
                      ? "bg-red-500 text-white animate-pulse"
                      : product.stock <= 20
                      ? "bg-yellow-300 text-gray-900"
                      : "bg-green-200 text-gray-900"
                  }`}
                >
                  {product.product_image ? (
                    <img
                      src={`http://localhost:3006/${product.product_image}`}
                      alt={product.product_name}
                      className="h-16 w-16 object-cover rounded-full mb-2"
                    />
                  ) : (
                    <FaBox className="text-3xl" />
                  )}
                  <p className="mt-2 text-sm font-medium">
                    {product.product_name}
                  </p>
                  <p className="mt-1 text-xs">
                    Stock: {product.stock || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p>No products available for this outlet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOutlet;
