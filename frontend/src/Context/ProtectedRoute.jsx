import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, auth, loading }) => {
  if (loading) return <div>Loading...</div>;
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
