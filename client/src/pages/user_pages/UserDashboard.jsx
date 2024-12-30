// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { AuthContext } from "../../components/AuthContext";
// import {
//   FaBoxOpen,
//   FaAddressCard,
//   FaKey,
//   FaExclamationTriangle,
// } from "react-icons/fa";
// import {
//   FiHome,
//   FiBox,
//   FiMapPin,
//   FiUser,
//   FiLogOut,
//   FiSearch,
// } from "react-icons/fi";

// const UserDashboard = () => {
//   const { isLoggedIn, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [id, setId] = useState(null);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [userIssuesCount, setUserIssuesCount] = useState(0);
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setId(decodedToken.id);
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
//     const fetchUserDetails = async () => {
//       try {
//         if (!id) return;

//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const [userResponse, ordersResponse] = await Promise.allSettled([
//           axios.get(`http://localhost:3006/api/user/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`http://localhost:3006/api/get-my-orders`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (userResponse.status === "fulfilled") {
//           setUserData(userResponse.value.data || null);
//         }

//         if (ordersResponse.status === "fulfilled") {
//           setTotalOrders(ordersResponse.value.data.orders?.length || 0);
//         }
//       } catch (error) {
//         console.error("Unexpected error:", error.message);
//       }
//     };

//     if (isLoggedIn && id) {
//       fetchUserDetails();
//     }
//   }, [id, isLoggedIn]);

//   useEffect(() => {
//     const fetchUserIssuesCount = async () => {
//       try {
//         if (!id) return;

//         const response = await axios.get(
//           `http://localhost:3006/api/issues/customer/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         setUserIssuesCount(response.data.issues?.length || 0);
//       } catch (error) {
//         console.error("Error fetching user issues count:", error);
//       }
//     };

//     fetchUserIssuesCount();
//   }, [id]);

//   const handleLogout = () => {
//     logout();
//     navigate("/my-account");
//   };

//   return (
//     <div className="flex flex-col bg-white mt-5 mb-5">
//       <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
//         <div className="w-full md:w-1/5 p-4 bg-gray-50 shadow-md rounded-lg">
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
//                     : role === "outlet"
//                     ? `outlet-dashboard/${id}`
//                     : role === "vendor"
//                     ? `vendor-dashboard/${id}`
//                     : `user-dashboard/${id}`
//                 }`}
//                 className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
//               >
//                 <FiHome size={20} />
//                 <span>Dashboard</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/my-orders/${id}`}
//                 className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
//               >
//                 <FiBox size={20} />
//                 <span>Orders</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/addresses/${id}`}
//                 className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
//               >
//                 <FiMapPin size={20} />
//                 <span>Addresses</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/profile/${id}`}
//                 className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
//               >
//                 <FiUser size={20} />
//                 <span>Account Details</span>
//               </Link>
//             </li>
//             <li>
//               <button
//                 onClick={() => {
//                   logout();
//                   navigate("/my-account");
//                 }}
//                 className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
//               >
//                 <FiLogOut size={20} />
//                 <span>Logout</span>
//               </button>
//             </li>
//           </ul>
//         </div>

//         <div className="w-full md:w-4/5">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Hello,{" "}
//               {userData?.name ? (
//                 <span className="font-bold">{userData.name}</span>
//               ) : (
//                 "User"
//               )}
//             </h2>
//           </div>

//           <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
//             {/* Recent Orders */}
//             <button className="flex items-center bg-blue-100 border border-blue-300 shadow rounded-lg px-4 py-3 hover:bg-blue-200 transition w-full md:w-auto flex-1">
//               <FaBoxOpen className="text-blue-500 text-xl mr-4" />
//               <Link
//                 to={`/my-orders/${id}`}
//                 className="text-blue-800 font-semibold hover:underline flex-1 text-left"
//               >
//                 Recent Orders
//               </Link>
//             </button>

//             {/* Shipping and Billing Addresses */}
//             <button className="flex items-center bg-green-100 border border-green-300 shadow rounded-lg px-4 py-3 hover:bg-green-200 transition w-full md:w-auto flex-1">
//               <FaAddressCard className="text-green-500 text-xl mr-4" />
//               <Link
//                 to={`/addresses/${id}`}
//                 className="text-green-800 font-semibold hover:underline flex-1 text-left"
//               >
//                 Edit Shipping/Billing Address
//               </Link>
//             </button>

//             {/* Edit Your Password */}
//             <button className="flex items-center bg-yellow-100 border border-yellow-300 shadow rounded-lg px-4 py-3 hover:bg-yellow-200 transition w-full md:w-auto flex-1">
//               <FaKey className="text-yellow-500 text-xl mr-4" />
//               <Link
//                 to={`/forgot-password`}
//                 className="text-yellow-800 font-semibold hover:underline flex-1 text-left"
//               >
//                 Edit Your Password
//               </Link>
//             </button>

//             {/* Raise Complaint */}
//             <button className="flex items-center bg-red-100 border border-red-300 shadow rounded-lg px-4 py-3 hover:bg-red-200 transition w-full md:w-auto flex-1">
//               <FaExclamationTriangle className="text-red-500 text-xl mr-4" />
//               <Link
//                 to={`/add-issue`}
//                 className="text-red-800 font-semibold hover:underline flex-1 text-left"
//               >
//                 Raise Complaint
//               </Link>
//             </button>
//           </div>

//           <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4 mt-3">
//             <div className="col">
//               <Link to={`/my-orders/${id}`}>
//                 <div className="card h-100 bg-white border-0 shadow">
//                   <div className="card-body text-center">
//                     <h5 className="card-title">Total Orders</h5>
//                     <p className="card-text text-primary text-2xl">
//                       {totalOrders}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             </div>

//             <div className="col">
//               <Link to={`/single-issue/${id}`}>
//                 <div className="card h-100 bg-white border-0 shadow">
//                   <div className="card-body text-center">
//                     <h5 className="card-title">Total Raised Issues</h5>
//                     <p className="card-text text-primary text-2xl">
//                       {userIssuesCount}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

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
import {
  FaBoxOpen,
  FaAddressCard,
  FaKey,
  FaExclamationTriangle,
} from "react-icons/fa";

const UserDashboard = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [id, setId] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [userIssuesCount, setUserIssuesCount] = useState(0);
  const [role, setRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    const fetchUserDetails = async () => {
      try {
        if (!id) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const [userResponse, ordersResponse] = await Promise.allSettled([
          axios.get(`http://localhost:3006/api/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3006/api/get-my-orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (userResponse.status === "fulfilled") {
          setUserData(userResponse.value.data || null);
        }

        if (ordersResponse.status === "fulfilled") {
          setTotalOrders(ordersResponse.value.data.orders?.length || 0);
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
      }
    };

    if (isLoggedIn && id) {
      fetchUserDetails();
    }
  }, [id, isLoggedIn]);

  useEffect(() => {
    const fetchUserIssuesCount = async () => {
      try {
        if (!id) return;

        const response = await axios.get(
          `http://localhost:3006/api/issues/customer/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUserIssuesCount(response.data.issues?.length || 0);
      } catch (error) {
        console.error("Error fetching user issues count:", error);
      }
    };

    fetchUserIssuesCount();
  }, [id]);

  const filteredCards = (keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return [
      {
        title: "Total Orders",
        value: totalOrders,
        link: `/my-orders/${id}`,
        bgColor: "bg-blue-100",
        textColor: "text-blue-500",
      },
      {
        title: "Raised Issues",
        value: userIssuesCount,
        link: `/single-issue/${id}`,
        bgColor: "bg-red-100",
        textColor: "text-red-500",
      },
    ].filter((card) => card.title.toLowerCase().includes(lowerKeyword));
  };

  const cardsToRender = filteredCards(searchTerm);

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row w-full md:w-5/6 mx-auto py-6 px-4 gap-6">
        {/* Left Navigation */}
        <div className="w-full md:w-1/5 p-4 bg-gray-50 shadow-md rounded-lg">
          <ul className="space-y-4">
            <li>
              <Link
                to={`/${
                  role === "superadmin"
                    ? `superadmin-dashboard/${id}`
                    : role === "admin"
                    ? `admin-dashboard/${id}`
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
              <h2 className="text-3xl font-semibold text-gray-700">
                User Dashboard
              </h2>
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

          {/* Tabs */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
            <Link
              to={`/my-orders/${id}`}
              className="flex items-center bg-blue-100 border border-blue-300 shadow rounded-lg px-4 py-3 hover:bg-blue-200 transition w-full md:w-auto flex-1"
            >
              <FaBoxOpen className="text-blue-500 text-xl mr-4" />
              <span className="text-blue-800 font-semibold hover:underline">
                Recent Orders
              </span>
            </Link>
            <Link
              to={`/addresses/${id}`}
              className="flex items-center bg-green-100 border border-green-300 shadow rounded-lg px-4 py-3 hover:bg-green-200 transition w-full md:w-auto flex-1"
            >
              <FaAddressCard className="text-green-500 text-xl mr-4" />
              <span className="text-green-800 font-semibold hover:underline">
                Shipping/Billing Address
              </span>
            </Link>
            <Link
              to={`/forgot-password`}
              className="flex items-center bg-yellow-100 border border-yellow-300 shadow rounded-lg px-4 py-3 hover:bg-yellow-200 transition w-full md:w-auto flex-1"
            >
              <FaKey className="text-yellow-500 text-xl mr-4" />
              <span className="text-yellow-800 font-semibold hover:underline">
                Change Password
              </span>
            </Link>
            <Link
              to={`/add-issue`}
              className="flex items-center bg-red-100 border border-red-300 shadow rounded-lg px-4 py-3 hover:bg-red-200 transition w-full md:w-auto flex-1"
            >
              <FaExclamationTriangle className="text-red-500 text-xl mr-4" />
              <span className="text-red-800 font-semibold hover:underline">
                Raise Complaint
              </span>
            </Link>
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
                  <h5 className="card-title text-gray-900">{card.title}</h5>
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

export default UserDashboard;
