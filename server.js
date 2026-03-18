const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   MIDDLEWARE (IMPORTANT)
========================= */
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

/* =========================
   TEST ROUTE
========================= */
app.get("/api/test", (req, res) => {
  res.json({ message: "API OK" });
});

/* =========================
   KEYWORDS
========================= */
app.post("/api/keywords", (req, res) => {

  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: "Missing keyword" });
  }

  const prefixes = [
    "best", "top", "cheap", "free", "online", "buy", "download",
    "how to", "what is", "why", "guide", "tips", "ideas"
  ];

  const suffixes = [
    "2026", "for beginners", "for kids", "for business",
    "tools", "software", "course", "examples"
  ];

  let results = [];

  prefixes.forEach(p => {
    results.push({
      keyword: `${p} ${keyword}`,
      volume: Math.floor(Math.random() * 1000)
    });
  });

  suffixes.forEach(s => {
    results.push({
      keyword: `${keyword} ${s}`,
      volume: Math.floor(Math.random() * 1000)
    });
  });

  // combinaison
  prefixes.forEach(p => {
    suffixes.forEach(s => {
      results.push({
        keyword: `${p} ${keyword} ${s}`,
        volume: Math.floor(Math.random() * 1000)
      });
    });
  });

  res.json(results);
});

/* =========================
   QUESTIONS
========================= */
app.post("/api/questions", (req, res) => {
  console.log("QUESTIONS BODY:", req.body);

  try {
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

  } catch (err) {
    console.error("QUESTIONS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   TITLES
========================= */
app.post("/api/titles", (req, res) => {
  console.log("TITLES BODY:", req.body);

  try {
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

  } catch (err) {
    console.error("TITLES ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   DIFFICULTY
========================= */
app.post("/api/difficulty", (req, res) => {
  console.log("DIFFICULTY BODY:", req.body);

  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "Missing keyword" });
    }

    const score = Math.floor(Math.random() * 100);

    res.json({ score });

  } catch (err) {
    console.error("DIFFICULTY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   ANALYZER
========================= */
app.get("/api/analyze", (req, res) => {
  console.log("ANALYZE URL:", req.query.url);

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing URL" });
    }

    res.json({
      title: "Exemple de titre",
      description: "Exemple de description",
      h1: 1,
      images: 10,
      imagesAlt: 8
    });

  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});