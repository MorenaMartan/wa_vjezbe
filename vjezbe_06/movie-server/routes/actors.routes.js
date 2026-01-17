import express from "express";
import actors from "../data/actors.js";
import { param, body, query, validationResult } from "express-validator";
import actorExists from "../middleware/actorExists.js";

const router = express.Router();

router.get(
  "/",
  query("name")
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage("name mora biti string"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    let result = [...actors];
    if (req.query.name) {
      const nameLower = req.query.name.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(nameLower));
    }

    res.json(result);
  }
);

router.get(
  "/:id",
  param("id").isInt().withMessage("ID mora biti integer"),
  actorExists,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    res.json(req.actor);
  }
);

router.post(
  "/",
  body("name").trim().notEmpty().escape().withMessage("Name je obavezan"),
  body("birthYear").isInt().withMessage("BirthYear mora biti integer"),
  body("movies").optional().isArray().withMessage("Movies mora biti array"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const newActor = {
      id: Date.now(),
      name: req.body.name,
      birthYear: req.body.birthYear,
      movies: req.body.movies || [],
    };

    actors.push(newActor);
    res.status(201).json(newActor);
  }
);

router.patch(
  "/:id",
  param("id").isInt().withMessage("ID mora biti integer"),
  actorExists,
  body().custom((body) => {
    if (!body.name && !body.birthYear && !body.movies) {
      throw new Error(
        "Morate poslati barem jedno polje za ažuriranje: name, birthYear ili movies"
      );
    }
    return true;
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const { name, birthYear, movies } = req.body;
    if (name) req.actor.name = name;
    if (birthYear) req.actor.birthYear = birthYear;
    if (movies) req.actor.movies = movies;

    res.json(req.actor);
  }
);

export default router;
