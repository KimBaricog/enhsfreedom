import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Back from "../components/Back";
import Heart from "../components/Heart";
import Dislike from "../components/Dislike";

import "../style/postpage.css";

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postt, setPostt] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/post/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPostt(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!postt) return <p>Loading...</p>;

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
      {/* BACK BUTTON */}
      <div className="back" onClick={() => navigate("/dashboard")}>
        <Back />
      </div>

      <div className="nf-box-post">
        {/* HEADER */}
        <div className="post-head">
          <img
            src={
              postt.profile_pic
                ? `http://localhost:5000/uploads/${postt.profile_pic}`
                : "/default-avatar.png"
            }
            alt="profile"
          />

          <div>
            <b>{postt.codename}</b>
            <br />
            <span>{timeAgo(postt.created_at)}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="post-content">
          <p>{postt.content}</p>
        </div>

        {/* IMAGE */}
        <div className="img-post">
          {postt.image && (
            <img
              id="imgp"
              src={`http://localhost:5000/uploads/${postt.image}`}
              alt="post"
            />
          )}
        </div>

        {/* REACTIONS */}
        <div className="react">
          <Heart post={postt} setPost={setPostt} />
          <Dislike />

          {postt.reacts > 0 && (
            <p style={{ color: "red", marginLeft: "10px" }}>+{postt.reacts}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
