import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const q = {};

  if (req.query.naziv) {
    q.naziv = { $regex: req.query.naziv, $options: "i" };
  }

  if (req.query.cijena_min || req.query.cijena_max) {
    q["cijene.srednja"] = {};
    if (req.query.cijena_min)
      q["cijene.srednja"].$gte = Number(req.query.cijena_min);
    if (req.query.cijena_max)
      q["cijene.srednja"].$lte = Number(req.query.cijena_max);
  }

  const sort = req.query.sort
    ? { "cijene.srednja": req.query.sort === "asc" ? 1 : -1 }
    : {};

  const pizze = await db.collection("pizze").find(q).sort(sort).toArray();
  res.json(pizze);
});

router.post("/", async (req, res) => {
  const { naziv, sastojci, cijene, slika_url } = req.body;
  if (!naziv || !sastojci || !cijene) {
    return res.status(400).json({ message: "Neispravni podaci" });
  }

  const db = req.app.locals.db;
  await db.collection("pizze").insertOne(req.body);
  res.json({ msg: "Pizza dodana" });
});

export default router;
