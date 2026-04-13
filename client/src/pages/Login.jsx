import { useState } from "react";
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

    const res = await fetch("http://localhost:5000/login", {
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
        <form onSubmit={handleLogin}>
          <p>{alert}</p>
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
        </form>
        <Link to="/register">Create Account</Link>
      </div>
    </>
  );
}

export default Login;
