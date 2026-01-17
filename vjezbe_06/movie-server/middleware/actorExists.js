import actors from "../data/actors.js";

export default (req, res, next) => {
  const id = parseInt(req.params.id);
  const actor = actors.find((a) => a.id === id);

  if (!actor) {
    return res.status(404).json({ error: "Glumac s tim ID-em ne postoji" });
  }

  req.actor = actor;
  next();
};
