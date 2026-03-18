const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* =========================
   SEO ANALYZER
========================= */
app.get("/api/analyze", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "URL missing" });
  }

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(response.data);

    const title = $("title").text().trim();
    const description = $('meta[name="description"]').attr("content") || "";
    const h1 = $("h1").length;
    const images = $("img").length;
    const imagesAlt = $("img[alt]").length;

    res.json({
      title,
      description,
      h1,
      images,
      imagesAlt
    });

  } catch (err) {
    console.log(err.message);
    res.json({ error: "Site inaccessible" });
  }
});

/* =========================
   KEYWORDS
========================= */
app.get("/api/keywords", (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.json({ error: "Keyword missing" });
  }

  const suggestions = [
    keyword,
    keyword + " tutorial",
    keyword + " ideas",
    keyword + " for beginners",
    keyword + " tips",
    "best " + keyword,
    keyword + " examples"
  ];

  res.json({ keywords: suggestions });
});

/* =========================
   QUESTIONS
========================= */
app.get("/api/questions", (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.json({ error: "Keyword missing" });
  }

  const questions = [
    "What is " + keyword + "?",
    "How to use " + keyword + "?",
    "Why is " + keyword + " important?",
    "Best tools for " + keyword + "?",
    "How to learn " + keyword + " fast?"
  ];

  res.json({ questions });
});

/* =========================
   TITLES
========================= */
app.get("/api/titles", (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.json({ error: "Keyword missing" });
  }

  const titles = [
    "10 Best " + keyword + " Tips",
    "Ultimate Guide to " + keyword,
    "How to Master " + keyword,
    keyword + " for Beginners",
    "Top Strategies for " + keyword
  ];

  res.json({ titles });
});

/* =========================
   DIFFICULTY
========================= */
app.get("/api/difficulty", (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.json({ error: "Keyword missing" });
  }

  const difficulty = Math.floor(Math.random() * 100);

  res.json({ difficulty });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});