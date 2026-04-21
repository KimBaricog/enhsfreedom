import "../style/header.css";
import "../style/leftbar.css";
import Addpost from "../components/Addpost";
import Message from "../components/Message";
import Home from "../components/Home";
import Leavepage from "../components/Leave.jsx";
import Username from "../components/Username";
import Logout from "../components/Logout.jsx";
import { useState } from "react";
function Leftside() {
  const [logout, setlogout] = useState(false);

  return (
    <>
      <div className="leftbar">
        <div className="username">
          <Username />
        </div>

        <div className="actions">
          <Addpost />
          <a href="/dashboard">
            <Home />
          </a>
          <Message />
          <button
            style={{ backgroundColor: "transparent", border: "none" }}
            onClick={() => setlogout(true)}
          >
            <Leavepage />
          </button>
        </div>
      </div>
      <Logout islogout={logout} setislogout={setlogout} />
    </>
  );
}
export default Leftside;
