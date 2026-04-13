const express = require("express");
const session = require("express-session");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const app = express();

// -------------------- CORS FIX --------------------
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// -------------------- BODY PARSER --------------------
app.use(express.json());

// -------------------- STATIC FILES (PROFILE IMAGES) --------------------
app.use("/uploads", express.static("uploads"));

// -------------------- SESSION --------------------
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }),
);

// -------------------- MYSQL --------------------
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// -------------------- TEST --------------------
app.get("/", (req, res) => {
  res.send("Server is running");
});

// -------------------- USERS --------------------
app.get("/users", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users");
  res.json(rows);
});

// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
  try {
    const { codename, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE codename = ?", [
      codename,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Wrong user name or password!" });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    req.session.userId = user.user_id;

    res.json({
      message: "Login successful",
      user: {
        id: user.user_id,
        codename: user.codename,
        profile_pic: user.profile_pic,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- DASHBOARD --------------------
app.get("/dashboard", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const [rows] = await db.query(
      "SELECT user_id, codename, profile_pic FROM users WHERE user_id = ?",
      [req.session.userId],
    );

    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- POST CREATE --------------------
app.post("/posts", upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const image = req.file ? req.file.filename : null;

    await db.query(
      "INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)",
      [userId, content, image],
    );

    res.json({ message: "Post created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- GET POSTS (FIXED - PROFILE INCLUDED) --------------------
app.get("/posts", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        posts.id,
        posts.content,
        posts.image,
        posts.created_at,
        users.codename,
        users.profile_pic
      FROM posts
      JOIN users ON posts.user_id = users.user_id
      ORDER BY posts.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- REGISTER --------------------
app.post("/register", upload.single("profile_pic"), (req, res) => {
  const { username, password } = req.body;
  const profilePic = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO users (codename, password, profile_pic)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [username, password, profilePic], (err) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "Account created!" });
  });
});

// -------------------- UPDATE PROFILE --------------------
app.post("/update-profile", (req, res) => {
  const { userId, profile_pic, bio } = req.body;

  const sql = "UPDATE users SET profile_pic = ?, bio = ? WHERE user_id = ?";

  db.query(sql, [profile_pic, bio, userId], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Update failed" });
    }

    res.json({ message: "Profile updated" });
  });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
