import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UsersList from "./pages/UsersList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UsersList />} />
      </Routes>
    </Router>
  );
}

export default App;
