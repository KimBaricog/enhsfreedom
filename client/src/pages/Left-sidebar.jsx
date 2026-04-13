import "../style/header.css";
import "../style/leftbar.css";
import Addbtn from "../components/Add-button";
import Username from "../components/Username";
function Leftside() {
  return (
    <>
      <div className="leftbar">
        <Username />
      </div>
    </>
  );
}
export default Leftside;
