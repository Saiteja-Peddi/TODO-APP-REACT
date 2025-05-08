import axios from "axios";
import axiosRetry from "axios-retry";

// In Real World, this URL would be an environment variable
// or a configuration file
// For example, in a .env file:
// REACT_APP_API_URL=http://localhost:8080
const API_URL = "http://localhost:8080";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include credentials in requests
  timeout: 5000, // Set a timeout for requests
});

let basicAuthToken = null; // Store the Basic Auth token in memory

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (basicAuthToken) {
      config.headers.Authorization = basicAuthToken; // Use the stored Basic Auth token
    }
    console.log(
      `Request: ${config.method.toUpperCase()} ${config.url}`,
      config
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response || error.message);
    if (error.response && error.response.status === 401) {
      window.location.href = "/login"; // Redirect to login page on 401 Unauthorized
    }
    return Promise.reject(error);
  }
);

// Configure retry mechanism
axiosRetry(apiClient, {
  retries: 3, // Number of retry attempts
  retryDelay: (retryCount) => {
    console.log(`Retrying request... Attempt #${retryCount}`);
    return retryCount * 1000; // Delay between retries (in milliseconds)
  },
  retryCondition: (error) => {
    // Retry only for network errors or 5xx server errors
    return (
      axiosRetry.isNetworkError(error) ||
      (error.response && error.response.status >= 500)
    );
  },
});

/**
 * Login API call.
 * @param {string} token - The Basic Auth token.
 * @returns {Promise<any>} - A promise that resolves to the login response.
 */
export const login = async (token) => {
  try {
    const response = await apiClient.get("/authenticate", {
      headers: {
        Authorization: token,
      },
      // Prevent browser from showing auth popup
      validateStatus: (status) => {
        return status < 500; // Resolve for status codes less than 500
      },
    });

    if (response.status === 401) {
      throw new Error("Invalid credentials");
    }

    basicAuthToken = token;
    return response.data;
  } catch (error) {
    console.error("Authentication failed:", error.message);
    throw error;
  }
};

/**
 * Clear the Basic Auth token.
 */
export const clearAuthToken = () => {
  basicAuthToken = null; // Clear the Basic Auth token from memory
};

/**
 * A reusable function to make API requests.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {string} endpoint - The API endpoint (relative to `API_URL`).
 * @param {Object} [data] - The request body (for POST and PUT requests).
 * @returns {Promise<any>} - A promise that resolves to the response data.
 * @throws Will throw an error if the request fails.
 */
const apiRequest = async (method, endpoint, data = null) => {
  try {
    const response = await apiClient({
      method,
      url: endpoint,
      data,
    });

    return response.data;
  } catch (error) {
    console.error(`Error during API request: ${method} ${endpoint}`, error);
    throw error;
  }
};

// Export API methods
export const getTodos = (username) =>
  apiRequest("GET", `/users/${username}/todos`);
export const createTodo = (username, todo) =>
  apiRequest("POST", `/users/${username}/todos`, todo);
export const getTodoById = (username, id) =>
  apiRequest("GET", `/users/${username}/todos/${id}`);
export const updateTodo = (username, id, todo) =>
  apiRequest("PUT", `/users/${username}/todos/${id}`, todo);
export const deleteTodo = (username, id) =>
  apiRequest("DELETE", `/users/${username}/todos/${id}`);
