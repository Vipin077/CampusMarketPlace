import { Navigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

export default function PrivateRoute({ children }) {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}