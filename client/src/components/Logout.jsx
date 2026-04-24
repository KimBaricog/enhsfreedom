import "./stylecom/logout.css";

function Logout({ islogout, setislogout }) {
  const close = () => {
    setislogout(false);
  };
  return (
    <>
      <div className="frame" style={{ display: islogout ? "flex" : "none" }}>
        <div className="logout-container">
          <h2>Logout?</h2>
          <div className="logout-button">
            <a href="/">
              <button id="yesbtn">Yes</button>
            </a>

            <button onClick={close} id="cancelbtn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Logout;
