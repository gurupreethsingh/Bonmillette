// import React, { useState, useEffect } from "react";
// import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import axios from "axios"; // Import axios for API calls

// export default function AllAddedProducts() {
//   const [products, setProducts] = useState([]);
//   const [view, setView] = useState("grid");
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3006/api/all-added-products"
//         );
//         setProducts(response.data); // Update state with fetched products
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []); // Fetch products when the component mounts

//   // Get correct image URL from backend
//   const getImageUrl = (imageUrl) => {
//     if (imageUrl) {
//       const normalizedPath = imageUrl
//         .replace(/\\/g, "/")
//         .split("uploads/")
//         .pop(); // Normalize path
//       return `http://localhost:3006/uploads/${normalizedPath}`; // Adjust according to folder structure
//     }
//     return "https://via.placeholder.com/150"; // Default placeholder if no image
//   };

//   return (
//     <div className="bg-white py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">
//         <div className="flex justify-between items-center flex-wrap">
//           <div>
//             <h2 className="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//               All Products
//             </h2>
//           </div>
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
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <Link to="/add-product">
//               <button className="ml-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:opacity-90 transition-opacity">
//                 Add Product
//               </button>
//             </Link>
//           </div>
//         </div>
//         <div className="mt-10">
//           {view === "grid" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//               {products
//                 .filter((product) =>
//                   [product.product_name]
//                     .map((field) => field.toLowerCase())
//                     .some((field) => field.includes(searchQuery.toLowerCase()))
//                 )
//                 .map((product) => (
//                   <Link
//                     to={`/single-added-product/${product._id}`}
//                     key={product._id}
//                     className="flex flex-col items-start relative"
//                   >
//                     <img
//                       src={getImageUrl(product.product_image)}
//                       alt={product.product_name}
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                     <h3 className="mt-2 text-md font-semibold text-gray-900 text-left">
//                       {product.product_name}
//                     </h3>
//                     <p className="text-gray-500">${product.selling_price}</p>
//                   </Link>
//                 ))}
//             </div>
//           )}
//           {view === "card" && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products
//                 .filter((product) =>
//                   [product.product_name]
//                     .map((field) => field.toLowerCase())
//                     .some((field) => field.includes(searchQuery.toLowerCase()))
//                 )
//                 .map((product) => (
//                   <Link
//                     to={`/single-added-product/${product._id}`}
//                     key={product._id}
//                     className="flex flex-col items-start bg-white rounded-lg shadow relative"
//                   >
//                     <img
//                       src={getImageUrl(product.product_image)}
//                       alt={product.product_name}
//                       className="w-full h-96 object-cover rounded-lg"
//                     />
//                     <h3 className="mt-4 text-lg font-semibold text-gray-900 text-left">
//                       {product.product_name}
//                     </h3>
//                     <p className="text-gray-500">${product.selling_price}</p>
//                   </Link>
//                 ))}
//             </div>
//           )}
//           {view === "list" && (
//             <div className="space-y-6">
//               {products
//                 .filter((product) =>
//                   [product.product_name]
//                     .map((field) => field.toLowerCase())
//                     .some((field) => field.includes(searchQuery.toLowerCase()))
//                 )
//                 .map((product) => (
//                   <Link
//                     to={`/single-added-product/${product._id}`}
//                     key={product._id}
//                     className="flex items-center space-x-4 bg-white rounded-lg shadow relative"
//                   >
//                     <img
//                       src={getImageUrl(product.product_image)}
//                       alt={product.product_name}
//                       className="w-24 h-24 object-cover rounded-lg"
//                     />
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 text-left">
//                         {product.product_name}
//                       </h3>
//                       <p className="text-gray-500">${product.selling_price}</p>
//                     </div>
//                   </Link>
//                 ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//

import React, { useState, useEffect } from "react";
import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AllAddedProducts() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3006/api/all-added-products"
        );
        setProducts(response.data); // Update state with fetched products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []); // Fetch products when the component mounts

  // Get correct image URL from backend
  const getImageUrl = (imageUrl) => {
    if (imageUrl) {
      const normalizedPath = imageUrl
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop(); // Normalize path
      return `http://localhost:3006/uploads/${normalizedPath}`; // Adjust according to folder structure
    }
    return "https://via.placeholder.com/150"; // Default placeholder if no image
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              All Products
            </h2>
          </div>
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
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/add-product">
              <button className="ml-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:opacity-90 transition-opacity">
                Add Product
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-10">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {products
                .filter((product) =>
                  [product.product_name]
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((product) => (
                  <Link
                    to={`/single-added-product/${product._id}`}
                    key={product._id}
                    className="flex flex-col items-start relative"
                  >
                    <img
                      src={getImageUrl(product.product_image)}
                      alt={product.product_name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <h3 className="mt-2 text-md font-semibold text-gray-900 text-left">
                      {product.product_name}
                    </h3>
                    <p className="text-gray-500">
                      Lowest Price: ₹{product.lowestPrice.toFixed(2)}
                    </p>
                  </Link>
                ))}
            </div>
          )}
          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((product) =>
                  [product.product_name]
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((product) => (
                  <Link
                    to={`/single-added-product/${product._id}`}
                    key={product._id}
                    className="flex flex-col items-start bg-white rounded-lg shadow relative"
                  >
                    <img
                      src={getImageUrl(product.product_image)}
                      alt={product.product_name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 text-left">
                      {product.product_name}
                    </h3>
                    <p className="text-gray-500">
                      Lowest Price: ₹{product.lowestPrice.toFixed(2)}
                    </p>
                  </Link>
                ))}
            </div>
          )}
          {view === "list" && (
            <div className="space-y-6">
              {products
                .filter((product) =>
                  [product.product_name]
                    .map((field) => field.toLowerCase())
                    .some((field) => field.includes(searchQuery.toLowerCase()))
                )
                .map((product) => (
                  <Link
                    to={`/single-added-product/${product._id}`}
                    key={product._id}
                    className="flex items-center space-x-4 bg-white rounded-lg shadow relative"
                  >
                    <img
                      src={getImageUrl(product.product_image)}
                      alt={product.product_name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 text-left">
                        {product.product_name}
                      </h3>
                      <p className="text-gray-500">
                        Lowest Price: ₹{product.lowestPrice.toFixed(2)}
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
}
