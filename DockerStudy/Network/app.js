const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const Favorite = require("./models/favorite");

const app = express();

// Express 5 has built-in body parsing middleware
app.use(express.json());

app.get("/favorites", async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.status(200).json({ favorites });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve favorites." });
  }
});

app.post("/favorites", async (req, res) => {
  const { name, type, url } = req.body;

  if (!["movie", "character"].includes(type)) {
    return res
      .status(400)
      .json({ message: '"type" should be "movie" or "character"!' });
  }

  try {
    const existingFav = await Favorite.findOne({ name });
    if (existingFav) {
      return res.status(409).json({ message: "Favorite already exists!" });
    }

    const favorite = new Favorite({ name, type, url });
    await favorite.save();
    res.status(201).json({ message: "Favorite saved!", favorite });
  } catch (error) {
    res.status(500).json({ message: "Failed to save favorite." });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const response = await axios.get("https://swapi.dev/api/films");
    res.status(200).json({ movies: response.data.results });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies." });
  }
});

app.get("/people", async (req, res) => {
  try {
    const response = await axios.get("https://swapi.dev/api/people");
    res.status(200).json({ people: response.data.results });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch people." });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://host.docker.internal:27017/swfavorites", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();
