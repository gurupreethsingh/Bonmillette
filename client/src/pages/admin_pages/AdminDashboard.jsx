// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// import { AuthContext } from "../../components/AuthContext";

// const AdminDashboard = () => {
//   const { isLoggedIn, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [id, setId] = useState(null);
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
//     if (!isLoggedIn) {
//       navigate("/my-account");
//     }
//   }, [isLoggedIn, navigate]);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:3006/api/user/${id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setUserData(response.data);
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//         navigate("/my-account");
//       }
//     };

//     if (id) {
//       fetchUserDetails();
//     }
//   }, [id, navigate]);

//   const handleLogout = () => {
//     logout();
//     navigate("/my-account");
//   };

//   return (
//     <div className="flex flex-col bg-white mt-5 mb-5">
//       <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
//         <div className="w-full md:w-1/5 mb-6 md:mb-0">
//           <h3 className="text-xl font-semibold text-gray-700 mb-4">
//             Navigation
//           </h3>
//           <ul className="space-y-4">
//             <li>
//               <Link
//                 to={`/${
//                   userData?.role === "superadmin"
//                     ? "superadmin-dashboard"
//                     : userData?.role === "admin"
//                     ? "admin-dashboard"
//                     : userData?.role === "employee"
//                     ? "employee-dashboard"
//                     : "user-dashboard"
//                 }/${userData?._id}`}
//                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
//               >
//                 🏠 Dashboard
//               </Link>
//             </li>

//             <li>
//               <Link
//                 to={`/my-orders/${userData?._id}`}
//                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
//               >
//                 📦 Manage Orders
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/all-users`}
//                 className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
//               >
//                 👥 Manage Users
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/profile/${userData?._id}`}
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

//         <div className="w-full md:w-4/5">
//           <div className="flex flex-wrap justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Hello, {userData?.name || "Admin"}
//             </h2>
//           </div>
//           <p className="text-gray-600 leading-6">
//             From your account dashboard, you can manage{" "}
//             <Link
//               to={`/all-orders`}
//               className="text-blue-500 hover:underline font-semibold"
//             >
//               orders
//             </Link>
//             , view{" "}
//             <Link
//               to={`/all-users`}
//               className="text-blue-500 hover:underline font-semibold"
//             >
//               users
//             </Link>
//             , and{" "}
//             <Link
//               to={`/all-categories`}
//               className="text-blue-500 hover:underline font-semibold"
//             >
//               product categories.
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

//

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { AuthContext } from "../../components/AuthContext";

const AdminDashboard = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [id, setId] = useState(null);
  const [privileges, setPrivileges] = useState([]);

  useEffect(() => {
    // Decode token to get user ID
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
    // Redirect if not logged in
    if (!isLoggedIn) {
      navigate("/my-account");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    // Fetch user details and privileges
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3006/api/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(response.data);
        setPrivileges(response.data.privileges || []);
      } catch (error) {
        console.error("Error fetching user details:", error);
        navigate("/my-account");
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/my-account");
  };

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
        <div className="w-full md:w-1/5 mb-6 md:mb-0">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Navigation
          </h3>
          <ul className="space-y-4">
            {/* Dashboard Link */}
            {privileges.includes("/superadmin-dashboard") && (
              <li>
                <Link
                  to={`/superadmin-dashboard/${userData?._id}`}
                  className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
                >
                  🏠 Super Admin Dashboard
                </Link>
              </li>
            )}

            <li>
              <Link
                to={`/my-orders/${userData?._id}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📦 Manage Orders
              </Link>
            </li>
            <li>
              <Link
                to={`/all-users`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                👥 Manage Users
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${userData?._id}`}
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                ⚙️ Account Details
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Dashboard Greeting */}
        <div className="w-full md:w-4/5">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Hello, {userData?.name || "Admin"}
            </h2>
          </div>
          <p className="text-gray-600 leading-6">
            From your account dashboard, you can manage{" "}
            <Link
              to={`/all-orders`}
              className="text-blue-500 hover:underline font-semibold"
            >
              orders
            </Link>
            , view{" "}
            <Link
              to={`/all-users`}
              className="text-blue-500 hover:underline font-semibold"
            >
              users
            </Link>
            , and{" "}
            <Link
              to={`/all-categories`}
              className="text-blue-500 hover:underline font-semibold"
            >
              product categories.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
