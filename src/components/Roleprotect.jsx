import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const Roleprotect = ({ allowedRoles }) => {
  const userData = JSON.parse(localStorage.getItem('userData'));

  // Check if user is logged in
  if (!userData) {
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default Roleprotect;