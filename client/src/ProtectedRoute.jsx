import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth();

  if (!authReady) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
