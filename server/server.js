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

// DATABASE
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
//  TEST
app.get("/", (req, res) => {
  res.send("Server is running");
});

// USERS
app.get("/users", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users");
  res.json(rows);
});

//LOGIN
app.post("/login", async (req, res) => {
  try {
    const { codename, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE codename = ?", [
      codename,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Empty inputs!" });
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

app.post("/posts/:id/react", async (req, res) => {
  const userId = req.session.userId; // ✅ FIXED
  const postId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const [existing] = await db.query(
    "SELECT * FROM reactions WHERE user_id = ? AND post_id = ?",
    [userId, postId],
  );

  if (existing.length > 0) {
    await db.query("DELETE FROM reactions WHERE user_id = ? AND post_id = ?", [
      userId,
      postId,
    ]);
  } else {
    await db.query("INSERT INTO reactions (user_id, post_id) VALUES (?, ?)", [
      userId,
      postId,
    ]);
  }

  const [[countResult]] = await db.query(
    "SELECT COUNT(*) AS reacts FROM reactions WHERE post_id = ?",
    [postId],
  );

  const [check] = await db.query(
    "SELECT * FROM reactions WHERE user_id = ? AND post_id = ?",
    [userId, postId],
  );

  res.json({
    reacts: countResult.reacts,
    isReacted: check.length > 0,
  });
});

// -------------------- GET POSTS (FIXED - PROFILE INCLUDED) --------------------
app.get("/posts", async (req, res) => {
  try {
    const userId = req.session.userId;

    const [rows] = await db.query(
      `
SELECT 
  posts.id AS id,
  posts.content,
  posts.image,
  posts.created_at,
  users.codename,
  users.profile_pic,
  COUNT(reactions.id) AS reacts,
  MAX(CASE WHEN reactions.user_id = ? THEN 1 ELSE 0 END) AS isReacted
FROM posts
JOIN users ON posts.user_id = users.user_id
LEFT JOIN reactions ON reactions.post_id = posts.id
GROUP BY posts.id
ORDER BY posts.created_at DESC;
      `,
      [userId],
    );

    return res.json(rows);
  } catch (err) {
    console.log(err);
    return res.json([]);
  }
});

// -------------------- REGISTER --------------------
app.post("/register", upload.single("profile_pic"), async (req, res) => {
  try {
    let { username, password } = req.body;

    // 🔥 CLEAN INPUT
    username = username?.trim();
    password = password?.trim();

    // ❌ VALIDATION
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    if (username.length === 0) {
      return res.status(400).json({
        message: "Username cannot be empty",
      });
    }

    // 🔍 CHECK DUPLICATE USERNAME
    const [existing] = await db.query(
      "SELECT user_id FROM users WHERE codename = ?",
      [username],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // ✅ INSERT USER
    await db.query(
      "INSERT INTO users (codename, password, profile_pic) VALUES (?, ?, ?)",
      [username, password, req.file?.filename || null],
    );

    return res.json({
      message: "Account created!",
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
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

// -------------------- TOP POST --------------------
app.get("/top-post", async (req, res) => {
  try {
    const sql = `
  SELECT p.*, u.codename, COUNT(r.id) AS reaction_count
  FROM posts p
  LEFT JOIN users u ON p.user_id = u.user_id
  LEFT JOIN reactions r ON p.id = r.post_id
  GROUP BY p.id, u.codename
  ORDER BY reaction_count DESC
  LIMIT 1
`;

    const [rows] = await db.query(sql);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.get("/post/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const sql = `
  SELECT p.*, u.codename, u.profile_pic, COUNT(r.id) AS reaction_count
  FROM posts p
  LEFT JOIN users u ON p.user_id = u.user_id
  LEFT JOIN reactions r ON p.id = r.post_id
  WHERE p.id = ?
  GROUP BY p.id, u.codename, u.profile_pic
`;

    const [rows] = await db.query(sql, [postId]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
