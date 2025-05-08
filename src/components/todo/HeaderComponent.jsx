import { useLogin } from "./security/LoginContext"; // Import context
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { logout } from "../../redux/authSlice"; // Redux actions
import { Link } from "react-router-dom";

export default function HeaderComponent({ useRedux = true }) {
  const loginContext = useLogin(); // Access the context
  const dispatch = useDispatch();

  // Redux state
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  function handleLogout() {
    if (useRedux) {
      // Redux logic
      dispatch(logout());
    } else {
      // Context logic
      loginContext.logout();
    }
  }

  return (
    <header className="header">
      <h1>Todo App</h1>
      <nav>
        {(useRedux ? isLoggedIn : loginContext.isLoggedIn) ? (
          <>
            <span>Welcome, {useRedux ? user : loginContext.username}!</span>
            <Link to="/welcome">Home</Link>
            <Link to="/todos">Todos</Link>
            <Link to="/logout" onClick={handleLogout}>
              Logout
            </Link>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </nav>
    </header>
  );
}
