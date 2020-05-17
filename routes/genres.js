const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validateGenre } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  throw new Error("Could not get the genres.");
  const genres = await Genre.find().sort({ name: 1 });
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("No genre found");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
      },
    },
    { new: true }
  );
  if (!genre) return res.status(404).send("No genre found");

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("No genre found");

  res.send(genre);
});

module.exports = router;
