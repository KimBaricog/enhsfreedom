import "../style/rightside.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sheart from "../components/static-heart";
import Heart from "../components/Heart";

function Rigthside() {
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://enhsfreedom-1.onrender.com/top-post")
      .then((res) => res.json())
      .then((data) => setSelectedPost(data));
  }, []);

  if (!selectedPost) return <p>Loading...</p>;

  return (
    <div className="R-container">
      <div className="top-react">
        <p>MOST HEARTED POST</p>
        <div className="post">
          <h3 onClick={() => navigate(`/post/${selectedPost.id}`)}>
            #{selectedPost.codename}
          </h3>

          <p>{selectedPost.content}</p>

          <span>
            <Sheart /> {selectedPost.reaction_count || selectedPost.reactions}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Rigthside;
