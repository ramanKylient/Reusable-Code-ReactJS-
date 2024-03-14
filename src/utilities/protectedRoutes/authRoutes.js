import React, { useMemo } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Function to validate token
const validateToken = (token) => {
  if (!token) {
    return { isValid: false };
  }

  const decodedToken = jwtDecode(token);
  const expirationTime = decodedToken.exp * 1000;
  const currentTime = Date.now();
  const isValid = currentTime < expirationTime;

  return {
    isValid,
  };
};

// Custom hook to handle token validation and decoding
export const useTokenInfo = () => {
  const token = localStorage.getItem("token");

  // Memoize token validation result to avoid unnecessary recalculations
  const userInfo = useMemo(() => validateToken(token), [token]);

  return userInfo;
};

// Component for rendering private routes
export const PrivateRoutes = () => {
  const { isValid } = useTokenInfo();

  if (!isValid) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

// Component for rendering public routes
export const PublicRoutes = () => {
  const { isValid } = useTokenInfo();

  if (!isValid) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};
