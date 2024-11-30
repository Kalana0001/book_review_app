import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Signup.css";
import img1 from "../../assets/book_img3.png";
import img2 from "../../assets/eye.png";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); 


  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (!name || !email || !password) {
      toast.error("All fields are required."); 
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!"); 
        setName("");
        setEmail("");
        setPassword("");

    
        navigate("/signin"); 
      } else {
        toast.error(data.message || "An error occurred. Please try again."); 
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Failed to connect to the server. Please try again."); 
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container">
      <div className="left">
        <p className="desc">Find 3D Objects, Mockups, and Illustrations here.</p>
        <img src={img1} alt="Signup illustration" className="sign_img" />
      </div>
      <div className="right">
        <h1 className="heading1">CREATE YOUR ACCOUNT</h1>
        <div className="wrapper">
          <h1 className="heading">SIGNUP</h1>
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                type={passwordVisible ? "text" : "password"} 
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={img2}
                alt="Eye icon"
                className={`eye ${passwordVisible ? "hidden" : ""}`} 
                onClick={togglePasswordVisibility}
              />
            </div>
            <button type="submit" className="btn">
              Create Account
            </button>

            <p className="bottom-text">
              Already have an account? <a href="/signin">Log in</a>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signup;
