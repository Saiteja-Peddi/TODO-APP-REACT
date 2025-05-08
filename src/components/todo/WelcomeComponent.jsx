import { Link } from "react-router-dom";
import { useLogin } from "./security/LoginContext";
import { useSelector } from "react-redux"; // Import Redux hooks

export default function WelcomeComponent({ useRedux = true }) {
  //   const location = useLocation(); // Access the location object to retrieve state
  //   const { username: usernameFromLocationState } = location.state || {}; // Extract the username from the state
  //   const { username: usernameFromParams } = useParams(); // Extract the username from the URL parameters
  //   const usernameFromStorage = localStorage.getItem("username"); // Get username from localStorage

  //   // Determine the username to display
  //   const username =
  //     usernameFromParams ||
  //     usernameFromStorage ||
  //     usernameFromLocationState ||
  //     ""; // Use params, then storage, or default to empty

  const loginContext = useLogin();
  const { user } = useSelector((state) => state.auth);

  // Get username based on the authentication method
  const username = useRedux ? user : loginContext.username;

  return (
    <div className="welcome">
      <h1>Welcome to the Todo App</h1>
      <p>Hello, {username}!</p>
      <div>
        <Link to="/todos">Manage Todo's</Link>
      </div>
    </div>
  );
}
