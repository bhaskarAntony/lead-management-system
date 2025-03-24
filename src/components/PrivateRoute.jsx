import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;