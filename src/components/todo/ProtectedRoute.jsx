import { Navigate } from "react-router-dom";
import { useLogin } from "./security/LoginContext";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, useRedux = true }) {
  const loginContext = useLogin();
  const { isLoggedIn: reduxIsLoggedIn } = useSelector((state) => state.auth);

  // Check authentication based on the selected state management approach
  const isAuthenticated = useRedux ? reduxIsLoggedIn : loginContext.isLoggedIn;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
