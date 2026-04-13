import { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
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
    alert(data.message);
  };

  return (
    <>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} />

      <input type="file" onChange={handleFileChange} />

      <button onClick={handleSubmit}>Create Account</button>
    </>
  );
}

export default Register;
