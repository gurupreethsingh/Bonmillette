// // // import React, { useContext, useEffect, useState } from "react";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import axios from "axios";
// // // import { jwtDecode } from "jwt-decode";
// // // import { AuthContext } from "../../components/AuthContext";

// // // const SuperadminDashboard = () => {
// // //   const { isLoggedIn, logout } = useContext(AuthContext);
// // //   const navigate = useNavigate();
// // //   const [id, setId] = useState(null);
// // //   const [role, setRole] = useState(null);
// // //   const [userData, setUserData] = useState(null);
// // //   const [counts, setCounts] = useState({
// // //     totalUsers: 0,
// // //     customers: 0,
// // //     employees: 0,
// // //     superAdmins: 0,
// // //     admins: 0,
// // //     categories: 0,
// // //     products: 0,
// // //     orders: 0,
// // //     outlets: 0,
// // //     vendors: 0,
// // //     rawMaterials: null,
// // //     unresolvedIssues: 0,
// // //     resolvedIssues: 0,
// // //     highValueOrders: 0,
// // //     lowValueOrders: 0,
// // //     shippedOrders: 0,
// // //     pendingOrders: 0,
// // //     returnedOrders: 0,
// // //     canceledOrders: 0,
// // //   });

// // //   const [messageCounts, setMessageCounts] = useState({
// // //     totalMessages: 0,
// // //     unreadMessages: 0,
// // //     readMessages: 0,
// // //   });

// // //   const [newMessageIndicator, setNewMessageIndicator] = useState(false);

// // //   const fetchData = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const [allIssues, unresolvedIssues] = await Promise.all([
// // //         axios.get(`http://localhost:3006/api/get-all-issues`, {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         }),
// // //         axios.get(`http://localhost:3006/api/issues/unresolved`, {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         }),
// // //       ]);

// // //       const unresolvedOrderIssues = allIssues.data.issues.filter(
// // //         (issue) =>
// // //           ["open", "pending", "in_progress"].includes(issue.status) &&
// // //           issue.order_id
// // //       );

// // //       setCounts((prevCounts) => ({
// // //         ...prevCounts,
// // //         unresolvedIssues: unresolvedIssues.data.unresolvedIssues,
// // //         unresolvedOrderIssues,
// // //       }));
// // //     } catch (error) {
// // //       console.error("Error fetching issue data:", error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const token = localStorage.getItem("token");
// // //     if (token) {
// // //       try {
// // //         const decodedToken = jwtDecode(token);
// // //         setId(decodedToken.id);
// // //         setRole(decodedToken.role); // Get the user's role
// // //       } catch (error) {
// // //         console.error("Error decoding token:", error);
// // //         logout();
// // //         navigate("/my-account");
// // //       }
// // //     } else {
// // //       logout();
// // //       navigate("/my-account");
// // //     }
// // //   }, [logout, navigate]);

// // //   useEffect(() => {
// // //     if (!isLoggedIn) {
// // //       navigate("/my-account");
// // //     }
// // //   }, [isLoggedIn, navigate]);

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         const token = localStorage.getItem("token");

// // //         const [
// // //           totalUsers,
// // //           customers,
// // //           employees,
// // //           superAdmins,
// // //           admins,
// // //           categories,
// // //           products,
// // //           orders,
// // //           outlets,
// // //           vendors,
// // //           rawMaterials,
// // //           unresolvedIssues,
// // //           resolvedIssues,
// // //           highValueOrders,
// // //           lowValueOrders,
// // //           shippedOrders,
// // //           pendingOrders,
// // //           returnedOrders,
// // //           canceledOrders,
// // //         ] = await Promise.all([
// // //           axios
// // //             .get(`http://localhost:3006/api/get-totaluser-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.totalUserCount)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-customer-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.userCount)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-employee-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.length)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-superadmin-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.superAdminCount)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-admin-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.adminCount)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/category-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.categoryCount)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/count-products`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.count)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-total-order-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.totalOrders)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/vendors/count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.totalVendors)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/raw-materials/count-all`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.total || 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-unresolved-issues-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.unresolvedIssues)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-resolved-issues-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.resolvedIssues)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-high-value-orders-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.highValueOrders)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-low-value-orders-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.lowValueOrders)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-shipped-orders-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.shippedOrders)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-pending-orders-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.pendingOrders)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-returned-orders-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.returnedOrders)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/get-canceled-orders-count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.canceledOrders)
// // //             .catch(() => 0),
// // //         ]);

// // //         setCounts({
// // //           totalUsers,
// // //           customers,
// // //           employees,
// // //           superAdmins,
// // //           admins,
// // //           categories,
// // //           products,
// // //           orders,
// // //           outlets,
// // //           vendors,
// // //           rawMaterials,
// // //           unresolvedIssues,
// // //           resolvedIssues,
// // //           highValueOrders,
// // //           lowValueOrders,
// // //           shippedOrders,
// // //           pendingOrders,
// // //           returnedOrders,
// // //           canceledOrders,
// // //         });
// // //       } catch (error) {
// // //         console.error("Error fetching data:", error);
// // //         setCounts({
// // //           totalUsers: 0,
// // //           customers: 0,
// // //           employees: 0,
// // //           superAdmins: 0,
// // //           admins: 0,
// // //           categories: 0,
// // //           products: 0,
// // //           orders: 0,
// // //           outlets: 0,
// // //           vendors: 0,
// // //           rawMaterials: 0,
// // //           unresolvedIssues: 0,
// // //           resolvedIssues: 0,
// // //           highValueOrders: 0,
// // //           lowValueOrders: 0,
// // //           shippedOrders: 0,
// // //           pendingOrders: 0,
// // //           returnedOrders: 0,
// // //           canceledOrders: 0,
// // //         });
// // //       }
// // //     };

// // //     if (id) {
// // //       fetchData();
// // //     }
// // //   }, [id]);

// // //   const showRedDot = counts.unresolvedIssues > 0;
// // //   const showRedDotOrders = counts.unresolvedOrderIssues?.length > 0;
// // //   const showRedDotUnresolved = counts.unresolvedIssues > 0;

// // //   useEffect(() => {
// // //     const fetchCounts = async () => {
// // //       try {
// // //         const token = localStorage.getItem("token");
// // //         const [totalIssues, assignedIssues] = await Promise.all([
// // //           axios
// // //             .get(`http://localhost:3006/api/issues/count`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.totalIssues)
// // //             .catch(() => 0),
// // //           axios
// // //             .get(`http://localhost:3006/api/issues/assigned/${id}`, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             })
// // //             .then((res) => res.data.issues.length)
// // //             .catch(() => 0),
// // //         ]);

// // //         setCounts((prevCounts) => ({
// // //           ...prevCounts,
// // //           totalIssues,
// // //           assignedIssues,
// // //         }));
// // //       } catch (error) {
// // //         console.error("Error fetching issue data:", error);
// // //       }
// // //     };

// // //     if (id) {
// // //       fetchCounts();
// // //     }
// // //   }, [id]);

// // //   useEffect(() => {
// // //     const fetchCounts = async () => {
// // //       try {
// // //         const token = localStorage.getItem("token");
// // //         const { data } = await axios.get(
// // //           "http://localhost:3006/api/messages/get-messages-count",
// // //           {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           }
// // //         );
// // //         setMessageCounts({
// // //           totalMessages: data.totalMessages || 0,
// // //           unreadMessages: data.unreadMessages || 0,
// // //           readMessages: data.readMessages || 0,
// // //         });
// // //       } catch (error) {
// // //         console.error("Error fetching message counts:", error);
// // //       }
// // //     };

// // //     fetchCounts();
// // //   }, []);

// // //   const handleLogout = () => {
// // //     logout();
// // //     navigate("/my-account");
// // //   };

// // //   const handleCardClick = () => {
// // //     localStorage.setItem("viewedMessagesCount", messageCounts.totalMessages);
// // //     setNewMessageIndicator(false);
// // //   };

// // //   return (
// // //     <div className="flex flex-col bg-white mt-5 mb-5">
// // //       <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
// // //         {/* Left Section */}
// // //         <div className="w-full md:w-1/5 mb-6 md:mb-0">
// // //           <h3 className="text-xl font-semibold text-gray-700 mb-4">
// // //             Navigation
// // //           </h3>
// // //           <ul className="space-y-4">
// // //             <li>
// // //               <Link
// // //                 to={`/${
// // //                   role === "superadmin"
// // //                     ? `superadmin-dashboard/${id}`
// // //                     : role === "admin"
// // //                     ? `admin-dashboard/${id}`
// // //                     : role === "employee"
// // //                     ? `employee-dashboard/${id}`
// // //                     : `user-dashboard/${id}`
// // //                 }`}
// // //                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
// // //               >
// // //                 🏠 Dashboard
// // //               </Link>
// // //             </li>
// // //             <li>
// // //               <Link
// // //                 to={`/my-orders/${id}`}
// // //                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
// // //               >
// // //                 📦 Orders
// // //               </Link>
// // //             </li>
// // //             <li>
// // //               <Link
// // //                 to={`/addresses/${id}`}
// // //                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
// // //               >
// // //                 📍 Addresses
// // //               </Link>
// // //             </li>
// // //             <li>
// // //               <Link
// // //                 to={`/profile/${id}`}
// // //                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
// // //               >
// // //                 ⚙️ Account Details
// // //               </Link>
// // //             </li>
// // //             <li>
// // //               <button
// // //                 onClick={handleLogout}
// // //                 className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
// // //               >
// // //                 🚪 Logout
// // //               </button>
// // //             </li>
// // //           </ul>
// // //         </div>

// // //         {/* Right Section */}
// // //         <div className="w-full md:w-4/5">
// // //           <div className="flex flex-wrap justify-between items-center mb-4">
// // //             <h2 className="text-2xl font-bold text-gray-800">
// // //               Hello,{" "}
// // //               {userData?.name ? (
// // //                 <span className="font-bold">{userData.name}</span>
// // //               ) : (
// // //                 "Superadmin"
// // //               )}
// // //             </h2>
// // //           </div>
// // //           <p className="text-gray-600 leading-6">
// // //             From your account dashboard, you can manage{" "}
// // //             <Link
// // //               to={`/all-users`}
// // //               className="text-blue-500 hover:underline font-semibold"
// // //             >
// // //               all users
// // //             </Link>
// // //             , view{" "}
// // //             <Link
// // //               to={`/all-customers`}
// // //               className="text-blue-500 hover:underline font-semibold"
// // //             >
// // //               customers
// // //             </Link>
// // //             , manage{" "}
// // //             <Link
// // //               to={`/all-employees`}
// // //               className="text-blue-500 hover:underline font-semibold"
// // //             >
// // //               employees
// // //             </Link>
// // //             , and more.
// // //           </p>

// // //           {/* Card Section */}

// // //           <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4 mt-3">
// // //             {/* Total Users */}
// // //             <div className="col">
// // //               <Link to="/all-users">
// // //                 <div className="card h-100 bg-blue-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-blue-700">Total Users</h5>
// // //                     <p className="card-text text-blue-500 text-2xl">
// // //                       {counts.totalUsers}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Customers */}
// // //             <div className="col">
// // //               <Link to="/all-customers">
// // //                 <div className="card h-100 bg-green-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-green-700">Customers</h5>
// // //                     <p className="card-text text-green-500 text-2xl">
// // //                       {counts.customers}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Employees */}
// // //             <div className="col">
// // //               <Link to="/all-employees">
// // //                 <div className="card h-100 bg-yellow-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-yellow-700">Employees</h5>
// // //                     <p className="card-text text-yellow-500 text-2xl">
// // //                       {counts.employees}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Superadmins */}
// // //             <div className="col">
// // //               <Link to="/all-superadmins">
// // //                 <div className="card h-100 bg-red-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-red-700">Superadmins</h5>
// // //                     <p className="card-text text-red-500 text-2xl">
// // //                       {counts.superAdmins}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Admins */}
// // //             <div className="col">
// // //               <Link to="/all-admins">
// // //                 <div className="card h-100 bg-indigo-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-indigo-700">Admins</h5>
// // //                     <p className="card-text text-indigo-500 text-2xl">
// // //                       {counts.admins}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Categories */}
// // //             <div className="col">
// // //               <Link to="/all-categories">
// // //                 <div className="card h-100 bg-teal-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-teal-700">Categories</h5>
// // //                     <p className="card-text text-teal-500 text-2xl">
// // //                       {counts.categories}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Total Products */}
// // //             <div className="col">
// // //               <Link to="/all-added-products">
// // //                 <div className="card h-100 bg-pink-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-pink-700">Total Products</h5>
// // //                     <p className="card-text text-pink-500 text-2xl">
// // //                       {counts.products}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Total Orders */}
// // //             {/* Total Orders Card */}
// // //             <div className="col">
// // //               <Link to="/all-orders">
// // //                 <div className="relative card h-100 bg-gray-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   {showRedDotOrders && (
// // //                     <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
// // //                   )}
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-gray-700">Total Orders</h5>
// // //                     <p className="card-text text-gray-500 text-2xl">
// // //                       {counts.orders}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Pending Orders */}
// // //             <div className="col">
// // //               <Link to="/all-orders">
// // //                 <div className="card h-100 bg-orange-100 border-0 z-10 shadow animate-pulse">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-orange-700">
// // //                       Pending Orders
// // //                     </h5>
// // //                     <p className="card-text text-orange-500 text-2xl">
// // //                       {counts.pendingOrders}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Shipped Orders */}
// // //             <div className="col">
// // //               <Link to="/all-orders">
// // //                 <div className="card h-100 bg-teal-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-teal-700">Shipped Orders</h5>
// // //                     <p className="card-text text-teal-500 text-2xl">
// // //                       {counts.shippedOrders}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Returned Orders */}
// // //             <div className="col">
// // //               <Link to="/all-orders">
// // //                 <div className="card h-100 bg-purple-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-purple-700">
// // //                       Returned Orders
// // //                     </h5>
// // //                     <p className="card-text text-purple-500 text-2xl">
// // //                       {counts.returnedOrders}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Canceled Orders */}
// // //             <div className="col">
// // //               <Link to="/all-orders">
// // //                 <div className="card h-100 bg-gray-200 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-gray-700">
// // //                       Canceled Orders
// // //                     </h5>
// // //                     <p className="card-text text-gray-500 text-2xl">
// // //                       {counts.canceledOrders}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Unresolved Issues */}
// // //             {/* Unresolved Issues Card */}
// // //             <div className="col">
// // //               <Link to="/all-issues">
// // //                 <div className="relative card h-100 bg-red-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   {showRedDotUnresolved && (
// // //                     <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
// // //                   )}
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-red-700">
// // //                       Unresolved Issues
// // //                     </h5>
// // //                     <p className="card-text text-red-500 text-2xl">
// // //                       {counts.unresolvedIssues}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             ;{/* Resolved Issues */}
// // //             <div className="col">
// // //               <Link to="/all-orders">
// // //                 <div className="card h-100 bg-green-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-green-700">
// // //                       Resolved Issues
// // //                     </h5>
// // //                     <p className="card-text text-green-500 text-2xl">
// // //                       {counts.resolvedIssues}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* High Value Orders */}
// // //             <div className="col">
// // //               <Link to="/all-orders">
// // //                 <div className="card h-100 bg-yellow-100 border-0 z-10 shadow animate-bounce">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-yellow-700">
// // //                       High Value Orders
// // //                     </h5>
// // //                     <p className="card-text text-yellow-500 text-2xl">
// // //                       {counts.highValueOrders}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Low Value Orders */}
// // //             <div className="col">
// // //               <Link to="/all-orders">
// // //                 <div className="card h-100 bg-blue-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-blue-700">
// // //                       Low Value Orders
// // //                     </h5>
// // //                     <p className="card-text text-blue-500 text-2xl">
// // //                       {counts.lowValueOrders}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Outlets */}
// // //             <div className="col">
// // //               <Link to="/all-outlets">
// // //                 <div className="card h-100 bg-gray-200 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-gray-700">Outlets</h5>
// // //                     <p className="card-text text-gray-500 text-2xl">
// // //                       {counts.outlets}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Vendors */}
// // //             <div className="col">
// // //               <Link to="/all-vendors">
// // //                 <div className="card h-100 bg-indigo-100 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-indigo-700">Vendors</h5>
// // //                     <p className="card-text text-indigo-500 text-2xl">
// // //                       {counts.vendors}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Customer Queries */}
// // //             <div className="col">
// // //               <Link to="/all-messages">
// // //                 <div className="card h-100 bg-blue-200 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-blue-700">
// // //                       Customer Queries
// // //                     </h5>
// // //                     <p className="card-text text-blue-500 text-2xl">
// // //                       {messageCounts.totalMessages}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Total Issues */}
// // //             <div className="col">
// // //               <Link to="/all-issues">
// // //                 <div className="card h-100 bg-orange-200 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-orange-700">Total Issues</h5>
// // //                     <p className="card-text text-orange-500 text-2xl">
// // //                       {counts.totalIssues}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //             {/* Assigned Tasks */}
// // //             <div className="col">
// // //               <Link to={`/assigned-issue/${id}`}>
// // //                 <div className="card h-100 bg-red-200 border-0 z-10 shadow hover:scale-105 transition-transform">
// // //                   <div className="card-body text-center">
// // //                     <h5 className="card-title text-red-700">Assigned Tasks</h5>
// // //                     <p className="card-text text-red-500 text-2xl">
// // //                       {counts.assignedIssues}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //               </Link>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default SuperadminDashboard;

// // //

// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { AuthContext } from "../../components/AuthContext";

// const SuperadminDashboard = () => {
//   const { isLoggedIn, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [id, setId] = useState(null);
//   const [role, setRole] = useState(null);
//   const [counts, setCounts] = useState({
//     totalUsers: 0,
//     customers: 0,
//     employees: 0,
//     superAdmins: 0,
//     admins: 0,
//     categories: 0,
//     products: 0,
//     orders: 0,
//     unresolvedIssues: 0,
//     unresolvedOrderIssues: [],
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setId(decodedToken.id);
//         setRole(decodedToken.role);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         logout();
//         navigate("/my-account");
//       }
//     } else {
//       logout();
//       navigate("/my-account");
//     }
//   }, [logout, navigate]);

//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate("/my-account");
//     }
//   }, [isLoggedIn, navigate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const [
//           allIssues,
//           unresolvedIssues,
//           totalUsers,
//           customers,
//           employees,
//           orders,
//         ] = await Promise.all([
//           axios.get("http://localhost:3006/api/get-all-issues", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("http://localhost:3006/api/issues/unresolved", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("http://localhost:3006/api/get-totaluser-count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("http://localhost:3006/api/get-customer-count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("http://localhost:3006/api/get-employee-count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("http://localhost:3006/api/get-total-order-count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         // Check if `issues` exists and is an array
//         const unresolvedOrderIssues =
//           allIssues.data.issues?.filter(
//             (issue) =>
//               ["open", "pending", "in_progress"].includes(issue.status) &&
//               issue.order_id
//           ) || [];

//         setCounts({
//           totalUsers: totalUsers.data.totalUserCount || 0,
//           customers: customers.data.userCount || 0,
//           employees: employees.data.length || 0,
//           orders: orders.data.totalOrders || 0,
//           unresolvedIssues: unresolvedIssues.data.unresolvedIssues || 0,
//           unresolvedOrderIssues,
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     if (id) {
//       fetchData();
//     }
//   }, [id]);

//   const showRedDotOrders = counts.unresolvedOrderIssues.length > 0;
//   const showRedDotUnresolved = counts.unresolvedIssues > 0;

//   return (
//     <div className="flex flex-col bg-white mt-5 mb-5">
//       <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
//         {/* Left Section */}
//         <div className="w-full md:w-1/5 mb-6 md:mb-0">
//           <h3 className="text-xl font-semibold text-gray-700 mb-4">
//             Navigation
//           </h3>
//           <ul className="space-y-4">
//             <li>
//               <Link
//                 to={`/${
//                   role === "superadmin"
//                     ? `superadmin-dashboard/${id}`
//                     : role === "admin"
//                     ? `admin-dashboard/${id}`
//                     : role === "employee"
//                     ? `employee-dashboard/${id}`
//                     : `user-dashboard/${id}`
//                 }`}
//                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
//               >
//                 🏠 Dashboard
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/my-orders/${id}`}
//                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
//               >
//                 📦 Orders
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/addresses/${id}`}
//                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
//               >
//                 📍 Addresses
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/profile/${id}`}
//                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
//               >
//                 ⚙️ Account Details
//               </Link>
//             </li>
//             <li>
//               <button
//                 onClick={() => {
//                   logout();
//                   navigate("/my-account");
//                 }}
//                 className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
//               >
//                 🚪 Logout
//               </button>
//             </li>
//           </ul>
//         </div>

//         {/* Right Section */}
//         <div className="w-full md:w-4/5">
//           <div className="flex flex-wrap justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Hello, Superadmin
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-3">
//             {/* Total Users */}
//             <Link
//               to="/all-users"
//               className="relative card h-full bg-blue-100 border-0 shadow hover:scale-105 transition-transform"
//             >
//               <div className="card-body text-center">
//                 <h5 className="card-title text-blue-700">Total Users</h5>
//                 <p className="card-text text-blue-500 text-2xl">
//                   {counts.totalUsers}
//                 </p>
//               </div>
//             </Link>

//             {/* Total Orders */}
//             <Link
//               to="/all-orders"
//               className="relative card h-full bg-gray-100 border-0 shadow hover:scale-105 transition-transform"
//             >
//               {showRedDotOrders && (
//                 <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
//               )}
//               <div className="card-body text-center">
//                 <h5 className="card-title text-gray-700">Total Orders</h5>
//                 <p className="card-text text-gray-500 text-2xl">
//                   {counts.orders}
//                 </p>
//               </div>
//             </Link>

//             {/* Unresolved Issues */}
//             <Link
//               to="/all-issues"
//               className="relative card h-full bg-red-100 border-0 shadow hover:scale-105 transition-transform"
//             >
//               {showRedDotUnresolved && (
//                 <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
//               )}
//               <div className="card-body text-center">
//                 <h5 className="card-title text-red-700">Unresolved Issues</h5>
//                 <p className="card-text text-red-500 text-2xl">
//                   {counts.unresolvedIssues}
//                 </p>
//               </div>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuperadminDashboard;

//

//

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

const SuperadminDashboard = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [counts, setCounts] = useState({
    totalUsers: 0,
    customers: 0,
    employees: 0,
    superAdmins: 0,
    admins: 0,
    categories: 0,
    products: 0,
    orders: 0,
    unresolvedIssues: 0,
    unresolvedOrderIssues: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setId(decodedToken.id);
        setRole(decodedToken.role);
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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [
          allIssues,
          unresolvedIssues,
          totalUsers,
          customers,
          employees,
          orders,
        ] = await Promise.all([
          axios.get("http://localhost:3006/api/get-all-issues", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3006/api/issues/unresolved", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3006/api/get-totaluser-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3006/api/get-customer-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3006/api/get-employee-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3006/api/get-total-order-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const unresolvedOrderIssues =
          allIssues.data.issues?.filter(
            (issue) =>
              [
                "open",
                "pending",
                "in_progress",
                "assigned",
                "re-assigned",
                "fixed",
              ].includes(issue.status) && issue.order_id
          ) || [];

        const unresolvedIssuesCount =
          allIssues.data.issues?.filter((issue) =>
            [
              "open",
              "pending",
              "in_progress",
              "assigned",
              "re-assigned",
              "fixed",
            ].includes(issue.status)
          ).length || 0;

        setCounts({
          totalUsers: totalUsers.data.totalUserCount || 0,
          customers: customers.data.userCount || 0,
          employees: employees.data.length || 0,
          orders: orders.data.totalOrders || 0,
          unresolvedIssues: unresolvedIssuesCount,
          unresolvedOrderIssues,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const showRedDotOrders = counts.unresolvedOrderIssues.length > 0;
  const showRedDotUnresolved = counts.unresolvedIssues > 0;

  const filteredCards = (keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return [
      {
        title: "Total Users",
        value: counts.totalUsers,
        link: "/all-users",
        category: "users",
        bgColor: "bg-blue-100",
        textColor: "text-blue-500",
      },
      {
        title: "Customers",
        value: counts.customers,
        link: "/all-customers",
        category: "users",
        bgColor: "bg-green-100",
        textColor: "text-green-500",
      },
      {
        title: "Employees",
        value: counts.employees,
        link: "/all-employees",
        category: "users",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-500",
      },
      {
        title: "Total Orders",
        value: counts.orders,
        link: "/all-orders",
        redDot: showRedDotOrders,
        category: "orders",
        bgColor: "bg-gray-100",
        textColor: "text-gray-500",
      },
      {
        title: "Unresolved Issues",
        value: counts.unresolvedIssues,
        link: "/all-issues",
        redDot: showRedDotUnresolved,
        category: "issues",
        bgColor: "bg-red-100",
        textColor: "text-red-500",
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
                to={`/${
                  role === "superadmin"
                    ? `superadmin-dashboard/${id}`
                    : role === "admin"
                    ? `admin-dashboard/${id}`
                    : role === "employee"
                    ? `employee-dashboard/${id}`
                    : role === "outlet"
                    ? `outlet-dashboard/${id}`
                    : role === "vendor"
                    ? `vendor-dashboard/${id}`
                    : `user-dashboard/${id}`
                }`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiHome size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/my-orders/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiBox size={20} />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/addresses/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiMapPin size={20} />
                <span>Addresses</span>
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
                Super Admin
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
                {card.redDot && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
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

export default SuperadminDashboard;
