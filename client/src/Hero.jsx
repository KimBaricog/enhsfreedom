import Leftbar from "./pages/Left-sidebar";
import Rightbar from "./pages/Right-side.jsx";
import Newsfeed from "./pages/Newsfeed.jsx";
import Header from "./pages/Header";

import "./hero.css";

function Hero() {
  return (
    <>
      <Header />
      <div className="hero">
        <Leftbar />
        <Newsfeed />
        <Rightbar />
      </div>
    </>
  );
}
export default Hero;
