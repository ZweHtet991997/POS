import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/authUtils';

/**
 * ProtectedRoute
 *
 * Props:
 *   children   – the page/component to render
 *   adminOnly  – if true, only 'admin' role can access; cashiers are sent to /sale
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();

  if (adminOnly && role !== 'admin') {
    // Cashier tried to reach an admin-only page → redirect to the only page they can see
    return <Navigate to="/sale?type=retail" replace />;
  }

  return children;
}
