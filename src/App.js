import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Counter from "./components/counter/Counter.jsx";
import TodoApp from "./components/todo/TodoApp.jsx";
function App() {
  return (
    <div className="App">
      {/* <Counter /> */}
      <TodoApp />
    </div>
  );
}

export default App;
