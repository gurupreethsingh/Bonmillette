// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { AuthContext } from "../../components/AuthContext";

// const EmployeeDashboard = () => {
//   const { isLoggedIn, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [id, setId] = useState(null);
//   const [role, setRole] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [counts, setCounts] = useState({
//     totalUsers: 0,
//     customers: 0,
//     employees: 0,
//     superAdmins: 0,
//     admins: 0,
//     categories: 0,
//     products: 0,
//     orders: 0,
//     outlets: 0,
//   });

//   const [messageCounts, setMessageCounts] = useState({
//     totalMessages: 0,
//     unreadMessages: 0,
//     readMessages: 0,
//   });

//   const [newMessageIndicator, setNewMessageIndicator] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setId(decodedToken.id);
//         setRole(decodedToken.role); // Get the user's role
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
//           totalUsers,
//           customers,
//           employees,
//           superAdmins,
//           admins,
//           categories,
//           products,
//           orders,
//           outlets,
//         ] = await Promise.all([
//           axios
//             .get(`http://localhost:3006/api/get-totaluser-count`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.totalUserCount)
//             .catch(() => 0),
//           axios
//             .get(`http://localhost:3006/api/get-customer-count`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.userCount)
//             .catch(() => 0),
//           axios
//             .get(`http://localhost:3006/api/get-employee-count`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.length)
//             .catch(() => 0),
//           axios
//             .get(`http://localhost:3006/api/get-superadmin-count`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.superAdminCount)
//             .catch(() => 0),
//           axios
//             .get(`http://localhost:3006/api/get-admin-count`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.adminCount)
//             .catch(() => 0),
//           axios
//             .get(`http://localhost:3006/api/category-count`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.categoryCount)
//             .catch(() => 0),
//           axios
//             .get(`http://localhost:3006/api/count-products`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.count)
//             .catch(() => 0),
//           axios
//             .get(`http://localhost:3006/api/get-total-order-count`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.totalOrders)
//             .catch(() => 0),
//           axios
//             .get(`http://localhost:3006/api/all-outlets`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.length) // Assuming `all-outlets` returns an array
//             .catch(() => 0),
//         ]);

//         setCounts({
//           totalUsers,
//           customers,
//           employees,
//           superAdmins,
//           admins,
//           categories,
//           products,
//           orders,
//           outlets,
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setCounts({
//           totalUsers: 0,
//           customers: 0,
//           employees: 0,
//           superAdmins: 0,
//           admins: 0,
//           categories: 0,
//           products: 0,
//           orders: 0,
//           outlets: 0,
//         });
//       }
//     };

//     if (id) {
//       fetchData();
//     }
//   }, [id]);

//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const [totalIssues, assignedIssues] = await Promise.all([
//           axios
//             .get(`http://localhost:3006/api/issues/count`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.totalIssues)
//             .catch(() => 0),
//           axios
//             .get(`http://localhost:3006/api/issues/assigned/${id}`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => res.data.issues.length)
//             .catch(() => 0),
//         ]);

//         setCounts((prevCounts) => ({
//           ...prevCounts,
//           totalIssues,
//           assignedIssues,
//         }));
//       } catch (error) {
//         console.error("Error fetching issue data:", error);
//       }
//     };

//     if (id) {
//       fetchCounts();
//     }
//   }, [id]);

//   const handleLogout = () => {
//     logout();
//     navigate("/my-account");
//   };

//   const handleCardClick = () => {
//     localStorage.setItem("viewedMessagesCount", messageCounts.totalMessages);
//     setNewMessageIndicator(false);
//   };

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
//                 onClick={handleLogout}
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
//               Hello,{" "}
//               {userData?.name ? (
//                 <span className="font-bold">{userData.name}</span>
//               ) : (
//                 "Employee"
//               )}
//             </h2>
//           </div>
//           {/* Card Section */}
//           <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4 mt-3 mt-3">
//             <div className="col">
//               <Link to={`/assigned-issue/${id}`}>
//                 <div className="card h-100 bg-white border-0 z-10 shadow">
//                   <div className="card-body text-center">
//                     <h5 className="card-title">Assigned Tasks</h5>
//                     <p className="card-text text-danger text-2xl">
//                       {counts.assignedIssues}
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

// export default EmployeeDashboard;

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

const EmployeeDashboard = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality
  const [counts, setCounts] = useState({
    totalUsers: 0,
    customers: 0,
    employees: 0,
    assignedIssues: 0,
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
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const [assignedIssues] = await Promise.all([
          axios
            .get(`http://localhost:3006/api/issues/assigned/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => res.data.issues.length)
            .catch(() => 0),
        ]);

        setCounts((prevCounts) => ({
          ...prevCounts,
          assignedIssues,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchCounts();
    }
  }, [id]);

  const filteredCards = (keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return [
      {
        title: "Assigned Tasks",
        value: counts.assignedIssues,
        link: `/assigned-issue/${id}`,
        bgColor: "bg-blue-100",
        textColor: "text-blue-500",
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
                  role === "employee"
                    ? `employee-dashboard/${id}`
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
                Employee Dashboard
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

          {/* Cards Section */}
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

export default EmployeeDashboard;
