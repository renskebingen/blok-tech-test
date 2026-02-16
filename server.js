require("dotenv").config(); // ✅ 1x bovenaan

const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const uri = process.env.MONGODB_URI;

// Mongo client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware
app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connect (1x bij server start)
async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

connectDB();

// Testdata (tijdelijk)
const data = [];

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/profile/:username", (req, res) => {
  res.send(`Profielpagina van ${req.params.username}`);
});

app.get("/detail", (req, res) => {
  res.render("detail", { data });
});

app.post("/detail", (req, res) => {
  data.push({
    title: req.body.title,
    description: req.body.description,
  });
  res.redirect("/detail");
});

// 404
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
