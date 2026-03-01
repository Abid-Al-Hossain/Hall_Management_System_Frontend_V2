import React from "react";
import { Navigate } from "react-router-dom";
import { useMockData } from "../../context/MockDataContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "student" | "manager";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole,
}) => {
  const { currentUser } = useMockData();

  if (!currentUser || currentUser.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
