import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import img1 from "../../assets/book_img3.png";
import img2 from "../../assets/eye.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Both fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!");

        navigate("/booksList", {
          state: { user: { id: data.user.id, username: data.user.username, email: data.user.email } },
        });
      } else {
        toast.error(data?.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="left">
        <p className="desc">Find Your Dream World...</p>
        <img src={img1} alt="SignIn Page" className="sign_img" />
      </div>
      <div className="right">
        <h1 className="heading1">WELCOME BACK</h1>
        <div className="wrapper">
          <h1 className="heading">SIGNIN</h1>
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={img2}
                alt="Eye icon"
                className={`eye ${showPassword ? "hidden" : ""}`} 
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <button type="submit" className="btn">
              Login
            </button>

            <p className="bottom-text">
              Don't have an account? <a href="/">Sign up</a>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signin;
