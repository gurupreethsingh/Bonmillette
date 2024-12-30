import React, { createContext, useState, useEffect } from "react";
import { account } from "./appwrite"; // Import Appwrite account

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(atob(base64));
        setUser(decodedPayload);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUser(null);
        setIsLoggedIn(false);
      }
    }

    const storedAuthToken = localStorage.getItem("authToken");
    const storedUserRole = localStorage.getItem("userRole");
    if (storedAuthToken && storedUserRole) {
      setAuthToken(storedAuthToken);
      setUserRole(storedUserRole);
    }

    setLoading(false);
  }, []);

  const login = (token, role = null) => {
    localStorage.setItem("token", token);
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64));
    setUser(decodedPayload);
    setIsLoggedIn(true);

    if (role) {
      setAuthToken(token);
      setUserRole(role);
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current"); // Clear Appwrite session
      console.log("Appwrite session cleared successfully");
    } catch (error) {
      console.error("Failed to clear Appwrite session:", error.message);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setAuthToken(null);
    setUserRole(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        loading,
        authToken,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
