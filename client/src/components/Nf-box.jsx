import Heart from "./Heart";
import Dislike from "./Dislike";
import { useNavigate } from "react-router-dom";
import "./stylecom/nfbox.css";

function Newsfeedbox({ post, setPosts }) {
  const navigate = useNavigate();

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
    <div className="nf-box">
      {/* CLICKABLE POST HEADER */}
      <div className="post-head">
        <img
          src={
            post.profile_pic
              ? `http://localhost:5000/uploads/${post.profile_pic}`
              : "/default-avatar.png"
          }
          alt="profile"
        />

        <b
          onClick={() => navigate(`/post/${post.id}`)}
          style={{ cursor: "pointer" }}
        >
          {post.codename}
        </b>

        <span>{timeAgo(post.created_at)}</span>
      </div>

      {/* CLICKABLE CONTENT */}
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* IMAGE CLICK */}
      <div className="img-post">
        {post.image && (
          <img id="imgp" src={`http://localhost:5000/uploads/${post.image}`} />
        )}
      </div>

      {/* REACTIONS */}
      <div className="react">
        <Heart post={post} setPosts={setPosts} />
        <Dislike />

        {post.reacts > 0 && <p style={{ color: "red" }}>+{post.reacts}</p>}
      </div>
    </div>
  );
}

export default Newsfeedbox;
