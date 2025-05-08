import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./security/LoginContext"; // Import context
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { loginSuccess, loginFailure } from "../../redux/authSlice"; // Redux actions
import { login } from "./api/todoApi"; // API call
import { useLoading } from "./security/LoadingContext"; // Import loading context

export default function LoginComponent({ useRedux = true }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const loginContext = useLogin(); // Access the context
  const { setLoading } = useLoading();

  // Redux hooks
  const dispatch = useDispatch();
  const { isLoggedIn, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(`/welcome/${user}`);
    }
  }, [isLoggedIn, navigate, user]);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage(""); // Clear any previous error messages

    try {
      if (useRedux) {
        const token = `Basic ${btoa(`${username}:${password}`)}`;
        const response = await login(token);

        if (response) {
          dispatch(loginSuccess({ username }));
        }
      } else {
        if (await loginContext.loginUser(username, password)) {
          navigate(`/welcome/${username}`);
        } else {
          setMessage("Login failed. Please check your credentials.");
        }
      }
    } catch (err) {
      if (useRedux) {
        dispatch(loginFailure({ error: "Invalid username or password" }));
      }
      setMessage("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      {message && <p className="error">{message}</p>}
      {useRedux && error && <p className="error">{error}</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={!username || !password}>
          Login
        </button>
      </form>
    </div>
  );
}
