const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* =========================
   KEYWORDS
========================= */
app.post("/api/keywords", (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: "Missing keyword" });
  }

  const results = [
    { keyword: keyword + " ideas", volume: 1000 },
    { keyword: keyword + " tips", volume: 800 },
    { keyword: keyword + " tools", volume: 600 },
    { keyword: keyword + " guide", volume: 500 }
  ];

  res.json(results);
});

/* =========================
   QUESTIONS
========================= */
app.post("/api/questions", (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: "Missing keyword" });
  }

  const results = [
    `What is ${keyword}?`,
    `How to use ${keyword}?`,
    `Why is ${keyword} important?`,
    `Best ${keyword} tips?`
  ];

  res.json(results);
});

/* =========================
   TITLES
========================= */
app.post("/api/titles", (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: "Missing keyword" });
  }

  const results = [
    `${keyword}: Complete Guide`,
    `10 Tips for ${keyword}`,
    `How to Master ${keyword}`,
    `Best ${keyword} Strategies`
  ];

  res.json(results);
});

/* =========================
   DIFFICULTY
========================= */
app.post("/api/difficulty", (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: "Missing keyword" });
  }

  const score = Math.floor(Math.random() * 100);

  res.json({ score });
});

/* =========================
   ANALYZER (déjà OK)
========================= */
app.get("/api/analyze", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  res.json({
    title: "Example Title",
    description: "Example description",
    h1: 1,
    images: 10,
    imagesAlt: 8
  });
});

/* ========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});