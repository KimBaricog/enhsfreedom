function Addbtn() {
  const style = {
    backgroundColor: "transparent",
    border: "none",
    width: "50px",
  };

  return (
    <>
      <button id="add-btn" style={style}>
        <img
          src="https://res.cloudinary.com/dgwmeeszw/image/upload/add_axejtp.png"
          alt="create post"
          style={style}
        />
      </button>
    </>
  );
}
export default Addbtn;
