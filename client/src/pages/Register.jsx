import { useState, useRef } from "react";
import "../style/register.css";
import Back from "../components/Back.jsx";

function Register() {
  const openinput = useRef(null);
  const [preview, setpreview] = useState(null);

  const openFile = () => {
    openinput.current.click();
  };
  const MAX = 10;

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const [file, setFile] = useState(null);
  const [alertmes, setAlertMes] = useState("Create Account");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFile(file);

    if (file) {
      setpreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (form.username.length > MAX) {
      return setAlertMes("Username too long");
    }

    if (form.password.length > MAX) {
      return setAlertMes("Password too long");
    }

    if (form.password !== form.confirm) {
      return setAlertMes("Passwords do not match");
    }

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("password", form.password);

      if (file) {
        formData.append("profile_pic", file);
      }

      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setAlertMes(data.message);

      setTimeout(() => {
        setAlertMes("Create Account");
      }, 2000);
    } catch (err) {
      console.log(err);
      setAlertMes("Server error");
    }
  };

  return (
    <div className="register-main">
      <div className="Register-box">
        <a href="/login">
          <Back />
        </a>
        <div className="left">
          <h2>{alertmes}</h2>
          <p>Don’t use real name to stay anonymous</p>

          {/* USERNAME */}
          <div className="user">
            <input
              name="username"
              placeholder="codename"
              maxLength={MAX}
              value={form.username}
              onChange={handleChange}
            />
            <p>
              {form.username.length}/{MAX}
            </p>
          </div>

          {/* PASSWORD */}
          <div className="user">
            <input
              name="password"
              type="password"
              placeholder="Password"
              maxLength={MAX}
              value={form.password}
              onChange={handleChange}
            />
            <p>
              {form.password.length}/{MAX}
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="user">
            <input
              name="confirm"
              type="password"
              placeholder="Confirm Password"
              maxLength={MAX}
              value={form.confirm}
              onChange={handleChange}
            />
            <p>
              {form.confirm.length}/{MAX}
            </p>
          </div>

          <div className="user">
            <button onClick={handleSubmit}>Create Account</button>
            <span></span>
          </div>
        </div>

        <div className="right">
          <h3>
            Add profile
            <span style={{ fontSize: "12px", color: "gray" }}>(required)</span>
          </h3>

          <div className="preview" onClick={openFile}>
            <img src={preview}></img>
            <p>{form.username}</p>
          </div>
          <input
            ref={openinput}
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
