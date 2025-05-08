import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginProvider } from "./security/LoginContext"; // Import LoginProvider
import { LoadingProvider } from "./security/LoadingContext";
import ProtectedRoute from "./security/ProtectedRoute"; // Import ProtectedRoute
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
import LoginComponent from "./LoginComponent";
import WelcomeComponent from "./WelcomeComponent";
import ListTodosComponent from "./ListTodosComponent";
import LogoutComponent from "./LogoutComponent";
import PageNotFoundComponent from "./PageNotFoundComponent";
import Spinner from "./Spinner"; // Import Spinner component
import TodoFormComponent from "./TodoFormComponent";

import "./TodoApp.css";

export default function TodoApp() {
  const useRedux = true; // Set to true if using Redux
  return (
    <div className="todoapp">
      <LoginProvider>
        <LoadingProvider>
          <Spinner />
          <BrowserRouter>
            <HeaderComponent useRedux={useRedux} />
            <Routes>
              <Route
                path="/"
                element={<LoginComponent useRedux={useRedux} />}
              />
              <Route
                path="/login"
                element={<LoginComponent useRedux={useRedux} />}
              />
              <Route
                path="/welcome"
                element={
                  <ProtectedRoute useRedux={useRedux}>
                    <WelcomeComponent useRedux={useRedux} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/welcome/:username"
                element={
                  <ProtectedRoute useRedux={useRedux}>
                    <WelcomeComponent useRedux={useRedux} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/todos"
                element={
                  <ProtectedRoute useRedux={useRedux}>
                    <ListTodosComponent useRedux={useRedux} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/todos/form"
                element={
                  <ProtectedRoute useRedux={useRedux}>
                    <TodoFormComponent useRedux={useRedux} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logout"
                element={
                  <ProtectedRoute useRedux={useRedux}>
                    <LogoutComponent />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<PageNotFoundComponent />} />
            </Routes>
            <FooterComponent />
          </BrowserRouter>
        </LoadingProvider>
      </LoginProvider>
    </div>
  );
}
