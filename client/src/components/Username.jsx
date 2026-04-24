import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import "./stylecom/username.css";

function Username() {
  const { user, authReady } = useAuth();

  if (!authReady) return <h2>Loading...</h2>;

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <div className="user-name">
        <img
          src={`https://enhsfreedom-1.onrender.com/uploads/${user.profile_pic}`}
          alt="profile"
        />

        <p>{user.codename}</p>
      </div>
    </>
  );
}
export default Username;
