import { createContext, useState, useContext } from "react";
import { login, clearAuthToken } from "../api/todoApi"; // Import the login API method and clearAuthToken

const LoginContext = createContext();

export const useLogin = () => useContext(LoginContext);

export function LoginProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  async function loginUser(username, password) {
    const token = `Basic ${btoa(`${username}:${password}`)}`; // Generate Basic Auth token
    try {
      await login(token); // Call the login API
      setUsername(username);
      setIsLoggedIn(true); // Update login state
      return true; // Return true on successful login
    } catch (err) {
      console.error("Login failed:", err.message);
      logout(); // Call logout on error
      return false; // Return false on failed login
    }
  }

  function logout() {
    setUsername(""); // Clear username
    setIsLoggedIn(false); // Update login state
    clearAuthToken(); // Clear the Basic Auth token
  }

  return (
    <LoginContext.Provider value={{ isLoggedIn, username, loginUser, logout }}>
      {children}
    </LoginContext.Provider>
  );
}
