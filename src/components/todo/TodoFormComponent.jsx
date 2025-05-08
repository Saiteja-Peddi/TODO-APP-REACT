import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // For validation schema
import { createTodo, updateTodo } from "./api/todoApi"; // Import API methods
import { useLogin } from "./security/LoginContext";
import { useLoading } from "./security/LoadingContext";
import { useSelector } from "react-redux"; // Import Redux hooks

export default function TodoFormComponent({ useRedux = true }) {
  const navigate = useNavigate();
  const location = useLocation(); // Access state passed via navigation
  const loginContext = useLogin(); // Access the context
  const { setLoading } = useLoading(); // Access loading context
  const { user } = useSelector((state) => state.auth);
  const username = useRedux ? user : loginContext.username;

  // Check if we are updating an existing todo
  const isUpdate = location.state?.todo;

  // Validation schema using Yup
  const validationSchema = Yup.object({
    description: Yup.string()
      .matches(
        /^[a-zA-Z0-9@!.*$().\s]+$/,
        "Only alphanumeric, spaces, and symbols [@,!,.,(,),*,$] are allowed"
      )
      .min(3, "Description must be at least 3 characters")
      .required("Description is required"),
    targetDate: Yup.date()
      .required("Target date is required")
      .min(
        isUpdate ? new Date(isUpdate.targetDate) : new Date(),
        isUpdate
          ? "Target date cannot be earlier than the existing start date"
          : "Target date cannot be in the past"
      ),
  });

  // Initial values for the form
  const initialValues = {
    description: isUpdate ? isUpdate.description : "",
    targetDate: isUpdate ? isUpdate.targetDate : "",
    done: isUpdate ? isUpdate.done : false,
  };

  // Form submission handler
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true); // Show spinner
    try {
      const todo = {
        id: isUpdate ? isUpdate.id : undefined, // Include id only for updates
        username, // Include username
        description: values.description.trim(),
        targetDate: values.targetDate,
        done: values.done,
      };

      if (isUpdate) {
        // Update existing todo
        await updateTodo(username, isUpdate.id, todo);
      } else {
        // Create new todo
        await createTodo(username, todo);
      }
      navigate("/todos"); // Redirect to the list of todos
    } catch (err) {
      console.error("Error saving todo:", err);
      setErrors({
        general: "Failed to save the todo. Please try again later.",
      });
    } finally {
      setLoading(false); // Hide spinner
      setSubmitting(false); // Stop form submission state
    }
  };

  return (
    <div className="todo-form">
      <h1>{isUpdate ? "Update Todo" : "Create Todo"}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors }) => (
          <Form>
            {errors.general && <p className="error">{errors.general}</p>}
            <div className="form-field">
              <label htmlFor="description">Description</label>
              <Field type="text" name="description" />
              <ErrorMessage
                name="description"
                component="p"
                className="error"
              />
            </div>
            <div className="form-field">
              <label htmlFor="targetDate">Target Date</label>
              <Field type="date" name="targetDate" />
              <ErrorMessage name="targetDate" component="p" className="error" />
            </div>
            <div className="form-field">
              <label>
                <Field type="checkbox" name="done" />
                Done
              </label>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                {isUpdate ? "Update" : "Create"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/todos")}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
