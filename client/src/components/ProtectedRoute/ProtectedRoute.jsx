import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

function ProtectedRoute({ children, path }) {
  const user = useSelector((state) => state.user.user);

  if ((path === '/' || path === '/signup') && user) {
    return <Navigate to="/dashboard" />;
  }

  if (!user && path === '/dashboard') {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
