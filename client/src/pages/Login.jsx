import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import "../style/login.css";

function Login() {
  const { setUser } = useAuth(); // 🔥 CONNECT TO GLOBAL STATE
  const [codename, setCodename] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setalert] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("https://enhsfreedom-1.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ codename, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);

      navigate("/dashboard");
    } else {
      setalert(data.message);

      setTimeout(() => {
        setalert("");
      }, 1000);
    }
  };

  return (
    <>
      <div className="login">
        <p id="logo">
          ENHS.<span style={{ color: "#007a3f" }}>FREEDOM</span>
        </p>
        <form onSubmit={handleLogin}>
          <h2>Login Account</h2>
          <p style={{ color: "red" }}>{alert}</p>
          <input
            placeholder="Codename"
            onChange={(e) => setCodename(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
          <Link to="/register">Create Account</Link>
        </form>
      </div>
    </>
  );
}

export default Login;
