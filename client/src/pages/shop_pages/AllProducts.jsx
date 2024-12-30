// import React, { useState, useEffect } from "react";
// import { Range } from "react-range";
// import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { IoIosArrowForward } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AllProducts = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [categoriesExpanded, setCategoriesExpanded] = useState(true);
//   const [priceExpanded, setPriceExpanded] = useState(true);
//   const [priceRange, setPriceRange] = useState([40, 500]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const itemsPerPage = 6; // Products per page

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3006/api/all-categories"
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3006/api/all-added-products"
//         );
//         console.log("Fetched products:", response.data); // Check the structure here
//         setProducts(response.data);
//         setFilteredProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchCategories();
//     fetchProducts();
//   }, []);

//   const getImageUrl = (imagePath) => {
//     if (imagePath) {
//       return `http://localhost:3006/${imagePath}`;
//     }
//     return "https://via.placeholder.com/150";
//   };

//   const handleCategoryClick = async (categoryId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3006/api/products-by-category/${categoryId}`
//       );
//       setFilteredProducts(response.data);
//       setCurrentPage(1); // Reset to the first page after category filter
//     } catch (error) {
//       if (error.response?.status === 404) {
//         setFilteredProducts([]); // No products in the category
//       } else {
//         console.error("Error fetching products by category:", error);
//       }
//     }
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);

//     const filtered = products.filter((product) => {
//       const nameMatch = product.product_name.toLowerCase().includes(query);
//       const categoryMatch =
//         product.category_name &&
//         product.category_name.toLowerCase().includes(query);
//       const priceMatch =
//         product.lowestPrice && product.lowestPrice.toString().includes(query);

//       return nameMatch || categoryMatch || priceMatch;
//     });

//     setFilteredProducts(filtered);
//     setCurrentPage(1); // Reset to the first page after search
//   };

//   const handlePriceFilter = () => {
//     const filtered = products.filter(
//       (product) =>
//         product.lowestPrice >= priceRange[0] &&
//         product.lowestPrice <= priceRange[1]
//     );
//     setFilteredProducts(filtered);
//     setCurrentPage(1); // Reset to the first page after price filter
//   };

//   const handlePageChange = (page) => {
//     if (
//       page >= 1 &&
//       page <= Math.ceil(filteredProducts.length / itemsPerPage)
//     ) {
//       setCurrentPage(page);
//     }
//   };

//   const navigateToProduct = (id) => {
//     navigate(`/single-product/${id}`);
//   };

//   const handleAddToCart = async (productId, priceAtPurchase) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.success("Please log in to add products to the cart.");
//       return;
//     }

//     console.log("Token sent in request:", token); // Debugging log

//     try {
//       await axios.post(
//         "http://localhost:3006/api/cart",
//         { productId, priceAtPurchase },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );

//       toast.success("Product added to cart successfully!");
//       setTimeout(() => {
//         window.location.reload();
//       }, 3000);
//     } catch (error) {
//       console.error("Error adding to cart:", error.response || error.message);
//       toast.error("Failed to add product to cart.");
//     }
//   };

//   const handleSort = (e) => {
//     const sortValue = e.target.value;

//     const sorted = [...filteredProducts].sort((a, b) => {
//       if (sortValue === "priceLowToHigh") {
//         return a.lowestPrice - b.lowestPrice;
//       } else if (sortValue === "priceHighToLow") {
//         return b.lowestPrice - a.lowestPrice;
//       } else if (sortValue === "latest") {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       } else {
//         return 0; // Default sorting
//       }
//     });

//     setFilteredProducts(sorted);
//   };

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedProducts = filteredProducts.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   return (
//     <>
//       <ToastContainer />
//       <div className="w-full md:w-5/6 mx-auto py-5 flex flex-col lg:flex-row gap-6">
//         {/* Left Sidebar */}
//         <div className="w-full lg:w-1/4 space-y-8">
//           {/* Search Field */}
//           <div className="relative flex items-center shadow-lg shadow-red-400 rounded-full px-3 py-3 bg-gradient-to-r from-gray-100 to-gray-200">
//             <input
//               type="text"
//               placeholder="Search Here"
//               value={searchQuery}
//               onChange={handleSearch}
//               className="ml-3 mr-3 w-full bg-transparent focus:outline-none placeholder:text-gray-500"
//             />
//             <button className="bg-red-500 text-white rounded-full p-2 shadow-lg">
//               <FaSearch />
//             </button>
//           </div>

//           {/* Product Categories */}
//           <div>
//             <div
//               className="flex justify-between items-center cursor-pointer"
//               onClick={() => setCategoriesExpanded(!categoriesExpanded)}
//             >
//               <p className="font-bold text-lg md:text-2xl">
//                 Product Categories
//               </p>
//               <IoIosArrowForward
//                 className={`text-lg transition-transform duration-500 ${
//                   categoriesExpanded ? "rotate-90" : "rotate-0"
//                 }`}
//               />
//             </div>
//             <div
//               className={`transition-all duration-700 ease-in-out overflow-hidden ${
//                 categoriesExpanded ? "max-h-[400px]" : "max-h-0"
//               }`}
//             >
//               <ul className="mt-4 space-y-2 text-gray-600 ml-4">
//                 {categories.map((category) => (
//                   <li
//                     key={category._id}
//                     className="cursor-pointer hover:underline"
//                     onClick={() => handleCategoryClick(category._id)}
//                   >
//                     {category.category_name}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Price Range */}
//           <div>
//             <div
//               className="flex justify-between items-center cursor-pointer"
//               onClick={() => setPriceExpanded(!priceExpanded)}
//             >
//               <p className="font-bold text-lg md:text-2xl">Choose Price</p>
//               <IoIosArrowForward
//                 className={`text-lg transition-transform duration-500 ${
//                   priceExpanded ? "rotate-90" : "rotate-0"
//                 }`}
//               />
//             </div>
//             <div
//               className={`transition-all duration-700 ease-in-out overflow-hidden ${
//                 priceExpanded ? "max-h-[200px]" : "max-h-0"
//               }`}
//             >
//               <div className="mt-4 px-4">
//                 <Range
//                   step={10}
//                   min={0}
//                   max={500}
//                   values={priceRange}
//                   onChange={(values) => setPriceRange(values)}
//                   renderTrack={({ props, children }) => {
//                     return (
//                       <div
//                         {...props}
//                         style={{
//                           ...props.style,
//                           height: "4px",
//                           width: "100%",
//                           background: "#ccc",
//                         }}
//                       >
//                         {children}
//                       </div>
//                     );
//                   }}
//                   renderThumb={({ props }) => {
//                     return (
//                       <div
//                         {...props}
//                         style={{
//                           ...props.style,
//                           height: "16px",
//                           width: "16px",
//                           backgroundColor: "red",
//                           borderRadius: "50%",
//                         }}
//                       />
//                     );
//                   }}
//                 />

//                 <div className="flex justify-between text-sm text-gray-500 mt-2">
//                   <span>₹{priceRange[0]}</span>
//                   <span>₹{priceRange[1]}</span>
//                 </div>
//                 <button
//                   onClick={handlePriceFilter}
//                   className="bg-black text-white px-4 py-2 rounded-full mt-4 w-full"
//                 >
//                   Filter
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="w-full lg:w-3/4">
//           {/* Header Section */}
//           <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
//             <div>
//               <p className="text-xl md:text-4xl font-bold">Shop</p>
//               <p className="text-sm md:text-lg text-gray-800 mt-2 md:mt-3">
//                 Showing {paginatedProducts.length} products out of{" "}
//                 {filteredProducts.length} total products
//               </p>
//             </div>

//             {/* Sorting Dropdown */}
//             <div>
//               <select
//                 onChange={handleSort}
//                 className="bg-black text-white px-4 py-2 md:px-6 md:py-3 rounded-full focus:outline-none"
//               >
//                 <option value="default">Default sorting</option>
//                 <option value="priceLowToHigh">Price: Low to High</option>
//                 <option value="priceHighToLow">Price: High to Low</option>
//                 <option value="latest">Latest</option>
//               </select>
//             </div>
//           </div>

//           {/* Products Section */}
//           {paginatedProducts.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {paginatedProducts.map((product) => (
//                 <div
//                   key={product._id}
//                   className="rounded-lg text-center group relative overflow-hidden shadow p-3"
//                 >
//                   {/* Product Image */}
//                   <img
//                     src={getImageUrl(product.product_image)}
//                     alt={product.product_name}
//                     className="w-full h-64 md:h-80 object-cover rounded-md mb-4 cursor-pointer"
//                     onClick={() => navigateToProduct(product._id)}
//                   />

//                   {/* Product Name */}
//                   <p className="text-sm md:text-lg font-semibold mb-2 transition-all duration-300 group-hover:text-red-500 group-hover:tracking-wide">
//                     {product.product_name}
//                   </p>

//                   {/* Stock Count */}
//                   <p className="text-xs md:text-sm text-gray-700 mb-4">
//                     {product.stock === 0 ? (
//                       <span className="text-red-500 font-semibold">
//                         Out of Stock
//                       </span>
//                     ) : product.stock <= 5 ? (
//                       <span>Stock: {product.stock} items available</span>
//                     ) : null}
//                   </p>

//                   {/* Sliding Add to Cart Button and Price */}
//                   <div className="relative mt-5">
//                     <div className="absolute left-[-40%] bottom-0 flex justify-between items-center transition-all duration-700 group-hover:left-0 w-full">
//                       {/* Add to Cart Button */}
//                       <button
//                         className={`bg-red-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full transition-all duration-300 ${
//                           product.stock === 0
//                             ? "opacity-50 cursor-not-allowed"
//                             : ""
//                         }`}
//                         onClick={() => {
//                           if (product.stock > 0) {
//                             handleAddToCart(product._id, product.lowestPrice);
//                           } else {
//                             toast.error(
//                               "Product is out of stock and cannot be added to the cart."
//                             );
//                           }
//                         }}
//                         disabled={product.stock === 0}
//                       >
//                         Add to Cart
//                       </button>

//                       {/* Price */}
//                       <p className="text-gray-900 text-sm md:text-lg font-bold">
//                         ₹
//                         {product.lowestPrice !== null &&
//                         product.lowestPrice !== undefined
//                           ? product.lowestPrice.toFixed(2)
//                           : "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-center text-gray-500">No products found</p>
//           )}

//           {/* Pagination */}
//           {filteredProducts.length > itemsPerPage && (
//             <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-2 rounded-full ${
//                   currentPage === 1
//                     ? "text-gray-300 cursor-not-allowed"
//                     : "text-black hover:text-red-500"
//                 }`}
//               >
//                 <FaArrowLeft />
//               </button>
//               <div className="flex gap-2">
//                 {Array.from({
//                   length: Math.ceil(filteredProducts.length / itemsPerPage),
//                 }).map((_, index) => (
//                   <button
//                     key={index} // Ensure the key is unique
//                     onClick={() => handlePageChange(index + 1)}
//                     className={`px-4 py-2 rounded-full text-sm md:text-lg ${
//                       currentPage === index + 1
//                         ? "bg-red-500 text-white"
//                         : "text-black hover:bg-gray-200"
//                     }`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={
//                   currentPage ===
//                   Math.ceil(filteredProducts.length / itemsPerPage)
//                 }
//                 className={`px-3 py-2 rounded-full ${
//                   currentPage ===
//                   Math.ceil(filteredProducts.length / itemsPerPage)
//                     ? "text-gray-300 cursor-not-allowed"
//                     : "text-black hover:text-red-500"
//                 }`}
//               >
//                 <FaArrowRight />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default AllProducts;

//

import React, { useState, useEffect, useMemo } from "react";
import { Range } from "react-range";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllProducts = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [priceRange, setPriceRange] = useState([40, 500]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get("http://localhost:3006/api/all-categories"),
          axios.get("http://localhost:3006/api/all-added-products"),
        ]);
        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = (imagePath) => {
    if (imagePath) {
      return `http://localhost:3006/${imagePath}`;
    }
    return "https://via.placeholder.com/150";
  };

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:3006/api/products-by-category/${categoryId}`
      );
      setFilteredProducts(response.data);
      setCurrentPage(1);
    } catch (error) {
      if (error.response?.status === 404) {
        setFilteredProducts([]);
      } else {
        console.error("Error fetching products by category:", error);
      }
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter((product) => {
      const nameMatch = product.product_name.toLowerCase().includes(query);
      const categoryMatch =
        product.category_name &&
        product.category_name.toLowerCase().includes(query);
      const priceMatch =
        product.lowestPrice && product.lowestPrice.toString().includes(query);

      return nameMatch || categoryMatch || priceMatch;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handlePriceFilter = () => {
    const filtered = products.filter(
      (product) =>
        product.lowestPrice >= priceRange[0] &&
        product.lowestPrice <= priceRange[1]
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (
      page >= 1 &&
      page <= Math.ceil(filteredProducts.length / itemsPerPage)
    ) {
      setCurrentPage(page);
    }
  };

  const handleAddToCart = async (productId, priceAtPurchase) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.success("Please log in to add products to the cart.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3006/api/cart",
        { productId, priceAtPurchase },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  const handleSort = (e) => {
    const sortValue = e.target.value;

    const sorted = [...filteredProducts].sort((a, b) => {
      if (sortValue === "priceLowToHigh") {
        return a.lowestPrice - b.lowestPrice;
      } else if (sortValue === "priceHighToLow") {
        return b.lowestPrice - a.lowestPrice;
      } else if (sortValue === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return 0;
      }
    });

    setFilteredProducts(sorted);
  };

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const navigateToProduct = (id) => {
    navigate(`/single-product/${id}`);
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full md:w-5/6 mx-auto py-5 flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/4 space-y-8">
          {/* Search Field */}
          <div className="relative flex items-center shadow-lg shadow-red-400 rounded-full px-3 py-3 bg-gradient-to-r from-gray-100 to-gray-200">
            <input
              type="text"
              placeholder="Search Here"
              value={searchQuery}
              onChange={handleSearch}
              className="ml-3 mr-3 w-full bg-transparent focus:outline-none placeholder:text-gray-500"
            />
            <button className="bg-red-500 text-white rounded-full p-2 shadow-lg">
              <FaSearch />
            </button>
          </div>

          {/* Product Categories */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            >
              <p className="font-bold text-lg md:text-2xl">
                Product Categories
              </p>
              <IoIosArrowForward
                className={`text-lg transition-transform duration-500 ${
                  categoriesExpanded ? "rotate-90" : "rotate-0"
                }`}
              />
            </div>
            <div
              className={`transition-all duration-700 ease-in-out overflow-hidden ${
                categoriesExpanded ? "max-h-[400px]" : "max-h-0"
              }`}
            >
              <ul className="mt-4 space-y-2 text-gray-600 ml-4">
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className="cursor-pointer hover:underline"
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    {category.category_name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setPriceExpanded(!priceExpanded)}
            >
              <p className="font-bold text-lg md:text-2xl">Choose Price</p>
              <IoIosArrowForward
                className={`text-lg transition-transform duration-500 ${
                  priceExpanded ? "rotate-90" : "rotate-0"
                }`}
              />
            </div>
            <div
              className={`transition-all duration-700 ease-in-out overflow-hidden ${
                priceExpanded ? "max-h-[200px]" : "max-h-0"
              }`}
            >
              <div className="mt-4 px-4">
                <Range
                  step={10}
                  min={0}
                  max={500}
                  values={priceRange}
                  onChange={(values) => setPriceRange(values)}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "4px",
                        width: "100%",
                        background: "#ccc",
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "16px",
                        width: "16px",
                        backgroundColor: "red",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <button
                  onClick={handlePriceFilter}
                  className="bg-black text-white px-4 py-2 rounded-full mt-4 w-full"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-3/4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <p className="text-xl md:text-4xl font-bold">Shop</p>
              <p className="text-sm md:text-lg text-gray-800 mt-2 md:mt-3">
                Showing {paginatedProducts.length} products out of{" "}
                {filteredProducts.length} total products
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div>
              <select
                onChange={handleSort}
                className="bg-black text-white px-4 py-2 md:px-6 md:py-3 rounded-full focus:outline-none"
              >
                <option value="default">Default sorting</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="latest">Latest</option>
              </select>
            </div>
          </div>

          {/* Products Section */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <div
                  key={product._id}
                  className="rounded-lg text-center group relative overflow-hidden shadow p-3"
                >
                  {/* Product Image */}
                  <img
                    src={getImageUrl(product.product_image)}
                    alt={product.product_name}
                    className="w-full h-64 md:h-80 object-cover rounded-md mb-4 cursor-pointer"
                    onClick={() => navigateToProduct(product._id)}
                  />

                  {/* Product Name */}
                  <p className="text-sm md:text-lg font-semibold mb-2 transition-all duration-300 group-hover:text-red-500 group-hover:tracking-wide">
                    {product.product_name}
                  </p>

                  {/* Stock Count */}
                  <p className="text-xs md:text-sm text-gray-700 mb-4">
                    {product.stock === 0 ? (
                      <span className="text-red-500 font-semibold">
                        Out of Stock
                      </span>
                    ) : product.stock <= 5 ? (
                      <span>Stock: {product.stock} items available</span>
                    ) : null}
                  </p>

                  {/* Sliding Add to Cart Button and Price */}
                  <div className="relative mt-5">
                    <div className="absolute left-[-40%] bottom-0 flex justify-between items-center transition-all duration-700 group-hover:left-0 w-full">
                      {/* Add to Cart Button */}
                      <button
                        className={`bg-red-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full transition-all duration-300 ${
                          product.stock === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          if (product.stock > 0) {
                            handleAddToCart(product._id, product.lowestPrice);
                          } else {
                            toast.error(
                              "Product is out of stock and cannot be added to the cart."
                            );
                          }
                        }}
                        disabled={product.stock === 0}
                      >
                        Add to Cart
                      </button>

                      {/* Price */}
                      <p className="text-gray-900 text-sm md:text-lg font-bold">
                        ₹
                        {product.lowestPrice !== null &&
                        product.lowestPrice !== undefined
                          ? product.lowestPrice.toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No products found</p>
          )}

          {/* Pagination */}
          {filteredProducts.length > itemsPerPage && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-full ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-black hover:text-red-500"
                }`}
              >
                <FaArrowLeft />
              </button>
              <div className="flex gap-2">
                {Array.from({
                  length: Math.ceil(filteredProducts.length / itemsPerPage),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-full text-sm md:text-lg ${
                      currentPage === index + 1
                        ? "bg-red-500 text-white"
                        : "text-black hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredProducts.length / itemsPerPage)
                }
                className={`px-3 py-2 rounded-full ${
                  currentPage ===
                  Math.ceil(filteredProducts.length / itemsPerPage)
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-black hover:text-red-500"
                }`}
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllProducts;
