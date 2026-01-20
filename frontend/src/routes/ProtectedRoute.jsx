import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, requireProfile = true }) => {
  const { session, loading, isAdmin, role, profileComplete } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireProfile && !profileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (adminOnly && role === undefined) {
    return <div>Loading...</div>;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
