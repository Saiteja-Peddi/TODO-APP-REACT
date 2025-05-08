import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogin } from "./LoginContext";

// Add this prop to control source of auth
export default function ProtectedRoute({ children, useRedux = true }) {
  const loginContext = useLogin(); // context-based login state
  const { isLoggedIn: reduxLoggedIn } = useSelector((state) => state.auth); // redux-based login state

  const isLoggedIn = useRedux ? reduxLoggedIn : loginContext.isLoggedIn;

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
