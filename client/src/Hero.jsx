import Leftbar from "./pages/Left-sidebar";
import Righttbar from "./pages/Left-sidebar";
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
      </div>
    </>
  );
}
export default Hero;
