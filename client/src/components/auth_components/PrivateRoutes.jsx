// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../AuthContext";

// const PrivateRoute = ({ children, allowedRoles = [] }) => {
//   const { isLoggedIn, user, loading } = useContext(AuthContext);

//   // Wait for loading to complete before rendering
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isLoggedIn) {
//     return (
//       <Navigate
//         to="/login"
//         replace
//         state={{ message: "You need to log in to access this page." }}
//       />
//     );
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
//     return (
//       <Navigate
//         to="/dashboard"
//         replace
//         state={{ message: "You do not have permission to access this page." }}
//       />
//     );
//   }

//   return children;
// };

// export default PrivateRoute;

//

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const PrivateRoute = ({
  children,
  allowedRoles = [],
  allowedPrivileges = [],
}) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext);

  // Wait for loading to complete before rendering
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if user is not logged in
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "You need to log in to access this page." }}
      />
    );
  }

  // Redirect if user role is not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ message: "You do not have permission to access this page." }}
      />
    );
  }

  // Redirect if user privileges do not allow access
  if (
    allowedPrivileges.length > 0 &&
    !allowedPrivileges.some((priv) => user?.privileges?.includes(priv))
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ message: "You do not have permission to access this page." }}
      />
    );
  }

  return children;
};

export default PrivateRoute;
