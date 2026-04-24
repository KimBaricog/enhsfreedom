import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import "./stylecom/postbox.css";
import Back from "./Back";
import X from "./x";

function Postbox({ Vissible, setVissible }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const { user, authReady } = useAuth();

  if (!authReady) return <h2>Loading...</h2>;

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  const MAX = 500;

  const close = () => {
    setVissible(false);
    setText("");
    setImage(null);
    setPreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const loadPosts = async () => {
    await fetch("https://enhsfreedom-1.onrender.com/posts", {
      credentials: "include",
    });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const createPost = async () => {
    if (!text.trim() && !image) {
      alert("You can't post empty content!");
      return;
    }

    if (text.length > MAX) {
      alert("Post is too long!");
      return;
    }

    const formData = new FormData();
    formData.append("content", text);

    if (image) {
      formData.append("image", image);
    }

    await fetch("https://enhsfreedom-1.onrender.com/posts", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    setText("");
    setImage(null);
    setPreview(null);
    close();

    window.location.reload();
  };

  const openFile = () => {
    fileRef.current.click();
  };

  return (
    <div style={{ display: Vissible ? "flex" : "none" }} className="p-box">
      <div className="info">
        <div className="top">
          <img
            src={`https://enhsfreedom-1.onrender.com/uploads/${user.profile_pic}`}
            alt="profile"
          />

          <p>{user.codename}</p>
          <div className="post-text">
            <p>Post</p>
          </div>
          <div id="exit" onClick={close}>
            <X />
          </div>
        </div>

        <textarea
          value={text}
          placeholder="What's on your mind?"
          onChange={(e) => {
            if (e.target.value.length <= MAX) {
              setText(e.target.value);
            }
          }}
        />

        {/* hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/png, image/jpg"
          onChange={handleImage}
          style={{ display: "none" }}
        />

        {/* image preview */}
        <div className="prev">
          {preview && <img src={preview} alt="preview" />}
        </div>

        <div className="post-footer">
          <div id="createpost" onClick={createPost}>
            Post
          </div>

          <div className="add-img">
            <svg
              onClick={openFile}
              className="img-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ cursor: "pointer" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            <p style={{ color: "gray", fontFamily: "san-serif" }}>
              {text.length}/{MAX}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Postbox;
