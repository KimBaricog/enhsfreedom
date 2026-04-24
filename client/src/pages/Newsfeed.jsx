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

  useEffect(() => {
    if (authReady && !user) {
      window.location.href = "/login";
    }
  }, [authReady, user]);

  // LOAD POSTS
  const loadPosts = async () => {
    try {
      const res = await fetch("https://enhsfreedom-1.onrender.com/posts", {
        credentials: "include",
      });

      const data = await res.json();

      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Failed to load posts", err);
      setPosts([]); // prevent crash
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
              ? `https://enhsfreedom-1.onrender.com/uploads/${user.profile_pic}`
              : "/default-avatar.png"
          }
          alt="profile"
        />
        Any confessions {user.codename}?
      </button>

      {/* POSTS */}
      {posts.map((post) => (
        <Newsfeedbox key={post.id} post={post} setPosts={setPosts} />
      ))}

      <Postbox Vissible={showPost} setVissible={setShowPost} />
    </div>
  );
}

export default Newsfeed;
