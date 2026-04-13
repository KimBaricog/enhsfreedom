import Username from "./Username";
import "./stylecom/nfbox.css";
import { useEffect, useState } from "react";

function Newsfeedbox({ post }) {
  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);

    const diff = Math.floor((now - past) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
  return (
    <div className="nf-box">
      <div className="post-head">
        <img
          src={
            post.profile_pic
              ? `http://localhost:5000/uploads/${post.profile_pic}`
              : "/default-avatar.png"
          }
          alt="profile"
        />
        <b>{post.codename}</b>
        <span>{timeAgo(post.created_at)}</span>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <div className="img-post">
        {post.image && (
          <img id="imgp" src={`http://localhost:5000/uploads/${post.image}`} />
        )}
      </div>

      <div className="react">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="30"
          height="30"
          fill="none"
          stroke="gray"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3
               c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3
               19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </div>
    </div>
  );
}

export default Newsfeedbox;
