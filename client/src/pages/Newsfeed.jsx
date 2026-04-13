import "../style/newsfeed.css";
import Newsfeedbox from "../components/Nf-box.jsx";
import Postbox from "../components/Postbox.jsx";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";

function Newsfeed() {
  const { user, authReady } = useAuth();
  const [showPost, setShowPost] = useState(false);
  const [posts, setPosts] = useState([]);

  if (!authReady) return <h2>Loading...</h2>;

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  // LOAD POSTS
  const loadPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/posts", {
        credentials: "include",
      });

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.log("Failed to load posts", err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="Newsfeed">
      <button onClick={() => setShowPost(true)}>
        <img
          src={
            user.profile_pic
              ? `http://localhost:5000/uploads/${user.profile_pic}`
              : "/default-avatar.png"
          }
          alt="profile"
        />
        What's on your mind {user.codename}?
      </button>

      {/* POSTS */}
      {posts.map((post) => (
        <Newsfeedbox key={post.id} post={post} />
      ))}

      <Postbox Vissible={showPost} setVissible={setShowPost} />
    </div>
  );
}

export default Newsfeed;
