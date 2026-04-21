import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Back from "../components/Back";

import "../style/postpage.css";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/post/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [id]);

  if (!post) return <p>Loading...</p>;

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);

    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return `${diff}s ago`;

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="postpage-container">
      <div className="back">
        <a href="/dashboard">
          <Back />
        </a>
      </div>
      <div className="nf-box-post">
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
            <img
              id="imgp"
              src={`http://localhost:5000/uploads/${post.image}`}
              alt=""
            />
          )}
        </div>

        <div className="react">
          {/* add your components here if needed */}
          {post.reacts > 0 && <p style={{ color: "red" }}>+{post.reacts}</p>}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
