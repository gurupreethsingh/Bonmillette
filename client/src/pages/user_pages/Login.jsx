// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../../components/AuthContext";
// import { MdLogin } from "react-icons/md"; // Login icon
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// export default function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevState) => !prevState);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await axios.post(
//         "http://localhost:3006/api/login",
//         formData
//       );

//       const { token, user } = response.data;

//       if (token && user) {
//         login(token);

//         // Navigate based on user role
//         switch (user.role) {
//           case "superadmin":
//             navigate(`/superadmin-dashboard/${user.id}`);
//             break;
//           case "vendor":
//             navigate(`/vendor-dashboard/${user.id}`);
//             break;
//           case "admin":
//             navigate(`/admin-dashboard/${user.id}`);
//             break;
//           case "user":
//             navigate(`/user-dashboard/${user.id}`);
//             break;
//           case "employee":
//             navigate(`/employee-dashboard/${user.id}`);
//             break;
//           default:
//             navigate(`/`);
//             break;
//         }
//       } else {
//         setError("Login failed. Please try again.");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "An error occurred. Please try again."
//       );
//     }
//   };

//   return (
//     <>
//       <div className="flex  flex-1 flex-col justify-center px-6 lg:px-8 mb-5">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//           <MdLogin className="mx-auto h-12 w-12 text-gray-600" />
//           <h2 className=" text-center text-2xl font-bold tracking-tight text-gray-600">
//             Log in to your account
//           </h2>
//         </div>

//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-base font-medium text-gray-900"
//               >
//                 Email address
//               </label>
//               <div className="mt-2">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-maroon-600 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-base font-medium text-gray-900"
//               >
//                 Password
//               </label>
//               <div className="relative mt-2">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-maroon-600 sm:text-sm"
//                 />
//                 <div
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? (
//                     <AiOutlineEyeInvisible size={24} />
//                   ) : (
//                     <AiOutlineEye size={24} />
//                   )}
//                 </div>
//               </div>
//             </div>

//             {error && <div className="text-red-600">{error}</div>}

//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="px-4 py-2 text-gray-800 bg-gray-200 rounded font-semibold transition-all duration-200 hover:bg-black hover:text-white hover:scale-105"
//               >
//                 Sign in
//               </button>
//             </div>
//           </form>

//           <p className="mt-10 text-center text-lg text-gray-800">
//             Don't have an account?{" "}
//             <a
//               href="/register"
//               className="font-semibold text-red-800 hover:text-black"
//             >
//               Sign up
//             </a>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }

//

// pages/Login.jsx

import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/AuthContext";
import { account } from "../../components/appwrite"; // Import Appwrite client
import { MdLogin } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, logout } = useContext(AuthContext); // Include logout from context
  const [showPassword, setShowPassword] = useState(false);

  let googleLoginTimeout; // To handle throttling for Google login

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle email-password login
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     const response = await axios.post("http://localhost:3006/api/login", {
  //       ...formData,
  //       loginType: "email",
  //     });

  //     const { token, user } = response.data;

  //     if (token && user) {
  //       login(token, user.role); // Save role in context
  //       navigate(`/${user.role}-dashboard/${user.id}`);
  //     } else {
  //       setError("Login failed. Please try again.");
  //     }
  //   } catch (err) {
  //     setError(
  //       err.response?.data?.message || "An error occurred. Please try again."
  //     );
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3006/api/login", {
        ...formData,
        loginType: "email",
      });

      const { token, user } = response.data;

      if (token && user) {
        login(token, user.role); // Save role in context

        // Centralized role-path mapping
        const rolePathMap = {
          superadmin: "superadmin-dashboard",
          admin: "admin-dashboard",
          employee: "employee-dashboard",
          outlet: "outlet-dashboard",
          vendor: "vendor-dashboard",
          delivery_agent: "delivery-agent-dashboard",
          user: "user-dashboard",
        };

        const rolePath = rolePathMap[user.role];
        if (rolePath) {
          navigate(`/${rolePath}/${user.id}`);
        } else {
          console.error("Invalid user role. Navigating to default dashboard.");
          navigate(`/user-dashboard/${user.id}`); // Default fallback
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Handle Google OAuth Login via Appwrite
  const handleGoogleLogin = async () => {
    if (googleLoginTimeout) {
      console.log("Throttling Google login attempts");
      return;
    }

    try {
      await account.createOAuth2Session("google", window.location.origin); // Initiate Google OAuth2

      // Fetch the Appwrite session to get user email
      const session = await account.get();
      const { email } = session;

      const response = await axios.post("http://localhost:3006/api/login", {
        email,
        loginType: "google",
      });

      const { token, user } = response.data;

      if (token && user) {
        login(token, user.role);
        navigate(`/${user.role}-dashboard/${user.id}`);
      } else {
        setError("Google login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google Login Failed:", error.message);
      setError("Google login failed. Please try again.");
    } finally {
      // Set a timeout to throttle repeated attempts
      googleLoginTimeout = setTimeout(() => {
        googleLoginTimeout = null;
      }, 3000); // 3-second timeout
    }
  };

  // Logout functionality
  const handleLogout = async () => {
    try {
      await account.deleteSession("current"); // Clear Appwrite session
      logout(); // Clear local session
      navigate("/login"); // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error.message);
      setError("Failed to logout. Please try again.");
    }
  };

  // Check for active Appwrite session on component mount
  const checkAppwriteSession = async () => {
    try {
      const session = await account.get();
      const { email } = session;
      console.log("User already logged in via Appwrite:", email);

      // Attempt to sync with your backend
      const response = await axios.post("http://localhost:3006/api/login", {
        email,
        loginType: "google",
      });

      const { token, user } = response.data;

      if (token && user) {
        login(token, user.role);
        navigate(`/${user.role}-dashboard/${user.id}`);
      }
    } catch (error) {
      console.log("No active Appwrite session found:", error.message);
    }
  };

  React.useEffect(() => {
    checkAppwriteSession();
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-center px-6 lg:px-8 mb-5">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <MdLogin className="mx-auto h-12 w-12 text-gray-600" />
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-600">
          Log in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-maroon-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-base font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-maroon-600 sm:text-sm"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={24} />
                ) : (
                  <AiOutlineEye size={24} />
                )}
              </div>
            </div>
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded font-semibold transition-all duration-200 hover:bg-black hover:text-white hover:scale-105"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleGoogleLogin}
            className="px-4 py-2 text-gray-800 bg-blue-200 rounded font-semibold transition-all duration-200 hover:bg-blue-600 hover:text-white hover:scale-105"
          >
            Sign in with Google
          </button>
        </div>

        <p className="mt-10 text-center text-lg text-gray-800">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-red-800 hover:text-black"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
