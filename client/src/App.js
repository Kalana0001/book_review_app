import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BooksList from "./components/BooksList/BooksList";
import Signup from "./components/Signup/Signup";
import Signin from "./components/Signin/Signin";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/booksList" element={<BooksList/>} />
        <Route path="/" element={<Signup/>} />
        <Route path="/signin" element={<Signin/>} />
      </Routes>
    </Router>
  );
}

export default App;
