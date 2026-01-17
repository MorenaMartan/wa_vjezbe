import movies from "../data/movies.js";

export default (req, res, next) => {
  const id = parseInt(req.params.id);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: "Film s tim ID-em ne postoji" });
  }

  req.movie = movie;
  next();
};
