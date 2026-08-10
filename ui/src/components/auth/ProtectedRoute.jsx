import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check if the JWT session token exists in the browser
  const token = localStorage.getItem('token');

  // If there is no token, redirect them to the Auth page immediately
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If they have a token, render the requested component (the Dashboard)
  return children;
}