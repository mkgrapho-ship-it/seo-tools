const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https"); // ✅ IMPORTANT

const questions = require("./engines/question-engine");
const titles = require("./engines/title-engine");

const app = express();

// ✅ SSL FIX (CRITIQUE)
const agent = new https.Agent({
  rejectUnauthorized: false
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
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
SEO ANALYZER (FINAL)
======================= */

async function analyzePage(url) {

  if (!url || !url.startsWith("http")) {
    return { error: "URL invalide" };
  }

  try {

    const response = await axios.get(url, {
      timeout: 8000,
      maxRedirects: 5,
      httpsAgent: agent, // ✅ FIX SSL
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      },
      validateStatus: () => true
    });

    if (!response.data || typeof response.data !== "string") {
      return { error: "Contenu invalide" };
    }

    const $ = cheerio.load(response.data);

    const title = $("title").text().trim();
    const description = $('meta[name="description"]').attr("content");
    const h1Count = $("h1").length;
    const images = $("img").length;
    const imagesAlt = $('img[alt]').length;

    return {
      title: title || null,
      description: description || null,
      h1: h1Count,
      images,
      imagesAlt
    };

  } catch (e) {
    console.log("Analyze error:", e.message);

    return {
      error: "Site bloqué ou inaccessible",
      details: e.message
    };
  }

}

// ✅ UNE SEULE ROUTE
app.get("/api/analyze", async (req, res) => {
  const result = await analyzePage(req.query.url);
  res.json(result);
});

/* =======================
STATUS
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