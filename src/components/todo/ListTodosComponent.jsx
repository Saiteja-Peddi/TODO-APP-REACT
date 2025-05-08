import { useEffect, useState } from "react";
import { getTodos, deleteTodo } from "./api/todoApi"; // Import the getTodos method
import { useLogin } from "./security/LoginContext";
import { useLoading } from "./security/LoadingContext"; // Import the loading context
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import Redux hooks

export default function ListTodosComponent({ useRedux = true }) {
  const [todos, setTodos] = useState([]); // State to store the list of todos
  const [error, setError] = useState(null); // State to handle errors
  const loginContext = useLogin();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const username = useRedux ? user : loginContext.username;

  useEffect(() => {
    // Fetch todos when the component mounts
    setLoading(true); // Set loading state to true
    const fetchTodos = async () => {
      try {
        const todosData = await getTodos(username); // Fetch todos from the backend
        setTodos(todosData); // Update the state with the fetched todos
      } catch (err) {
        console.error("Error fetching todos:", err);
        setError("Failed to fetch todos. Please try again later.");
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchTodos();
  }, [username]); // Dependency array ensures this runs when the username changes

  // Handle delete functionality
  const handleDelete = async (id) => {
    setLoading(true); // Show spinner
    try {
      await deleteTodo(username, id); // Call delete API
      setTodos(todos.filter((todo) => todo.id !== id)); // Remove the deleted todo from the state
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete the todo. Please try again later.");
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  const handleUpdate = (todo) => {
    navigate("/todos/form", { state: { todo } }); // Pass todo details via state
  };

  const handleCreateNewTodo = () => {
    navigate("/todos/form"); // Navigate to the create new todo page
  };

  return (
    <div className="list-todos">
      <h1>List of Todos</h1>
      {error && <p className="error">{error}</p>} {/* Display error if any */}
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Done</th>
            <th>Target Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.description}</td>
              <td>{todo.done ? "Yes" : "No"}</td>
              <td>{todo.targetDate}</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => handleUpdate(todo)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="create-todo-button-container">
        <button className="btn btn-primary" onClick={handleCreateNewTodo}>
          Create New Todo
        </button>
      </div>
    </div>
  );
}
