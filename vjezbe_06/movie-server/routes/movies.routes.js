import express from "express";
import movies from "../data/movies.js";
import { param, body, query, validationResult } from "express-validator";
import movieExists from "../middleware/movieExists.js";

const router = express.Router();

router.get(
  "/",
  query("min_year")
    .optional()
    .isInt()
    .withMessage("min_year mora biti integer"),
  query("max_year")
    .optional()
    .isInt()
    .withMessage("max_year mora biti integer"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    let result = [...movies];

    const min = req.query.min_year ? parseInt(req.query.min_year) : null;
    const max = req.query.max_year ? parseInt(req.query.max_year) : null;

    if (min !== null && max !== null && min >= max) {
      return res
        .status(400)
        .json({ error: "min_year mora biti manji od max_year" });
    }

    if (min !== null) result = result.filter((m) => m.year >= min);
    if (max !== null) result = result.filter((m) => m.year <= max);

    res.json(result);
  }
);

router.get(
  "/:id",
  param("id").isInt().withMessage("ID mora biti integer"),
  movieExists,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    res.json(req.movie);
  }
);

router.post(
  "/",
  body("title").trim().notEmpty().escape().withMessage("Title je obavezan"),
  body("year").isInt().withMessage("Year mora biti integer"),
  body("genre").trim().notEmpty().escape().withMessage("Genre je obavezan"),
  body("director")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Director je obavezan"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const newMovie = {
      id: Date.now(),
      title: req.body.title,
      year: req.body.year,
      genre: req.body.genre,
      director: req.body.director,
    };

    movies.push(newMovie);
    res.status(201).json(newMovie);
  }
);

router.patch(
  "/:id",
  param("id").isInt().withMessage("ID mora biti integer"),
  movieExists,
  body().custom((body) => {
    if (!body.title && !body.year && !body.genre && !body.director) {
      throw new Error(
        "Morate poslati barem jedno polje za ažuriranje: title, year, genre ili director"
      );
    }
    return true;
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const { title, year, genre, director } = req.body;
    if (title) req.movie.title = title;
    if (year) req.movie.year = year;
    if (genre) req.movie.genre = genre;
    if (director) req.movie.director = director;

    res.json(req.movie);
  }
);

export default router;
