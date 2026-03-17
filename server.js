const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const questions = require("./engines/question-engine");
const titles = require("./engines/title-engine");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* =======================
KEYWORD GENERATOR
======================= */

app.post("/api/keywords", async (req, res) => {

  const keyword = req.body.keyword;

  if (!keyword) return res.json([]);

  const modifiers = [
    "", " a"," b"," c"," d"," e"," f"," g"," h"," i"," j"," k"," l"," m"," n"," o"," p"," q"," r"," s"," t"," u"," v"," w"," x"," y"," z",
    " pour"," avec"," sans"," vs"," ou"," et"," meilleur"," top"," gratuit"
  ];

  let suggestions = [];

  try {

    for (const mod of modifiers) {
      const response = await axios.get(
        "https://suggestqueries.google.com/complete/search?client=firefox&q=" + keyword + mod
      );

      suggestions = suggestions.concat(response.data[1]);
    }

    const unique = [...new Set(suggestions)];

    const data = unique.map(k => ({
      keyword: k,
      volume: Math.floor(Math.random() * 10000),
      cpc: (Math.random() * 2).toFixed(2),
      difficulty: Math.floor(Math.random() * 100)
    }));

    res.json(data);

  } catch (e) {
    console.log(e.message);
    res.json([]);
  }

});


/* =======================
QUESTIONS
======================= */

app.post("/api/questions", (req, res) => {
  res.json(questions(req.body.keyword));
});


/* =======================
TITLES
======================= */

app.post("/api/titles", (req, res) => {
  res.json(titles(req.body.keyword));
});


/* =======================
SEO ANALYZER (GET + POST)
======================= */

// GET (pour navigateur)
app.get("/api/analyze", async (req, res) => {

  const url = req.query.url;

  if (!url || !url.startsWith("http")) {
    return res.json({ error: "URL invalide" });
  }

  try {

    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      validateStatus: () => true
    });

    const $ = cheerio.load(response.data);

    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");
    const h1 = $("h1").length;
    const images = $("img").length;
    const imagesAlt = $('img[alt]').length;

    res.json({
      title: title ? "OK" : "Missing",
      description: description ? "OK" : "Missing",
      h1: h1 > 0 ? "OK" : "Missing",
      images,
      imagesAlt
    });

  } catch (e) {
    console.log(e.message);
    res.json({ error: "Impossible d'analyser ce site" });
  }

});

// POST (pour ton frontend)
app.post("/api/analyze", async (req, res) => {

  req.query.url = req.body.url;
  app._router.handle(req, res, () => {}, "get");

});


/* =======================
STATUS (IMPORTANT)
======================= */

app.get("/api/status", (req, res) => {
  res.json({ status: "ok" });
});


/* =======================
SERVER
======================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SEO Tools running on port " + PORT);
});