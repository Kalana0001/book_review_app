import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BooksList from "./components/Home/BooksList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BooksList/>} />
      </Routes>
    </Router>
  );
}

export default App;
