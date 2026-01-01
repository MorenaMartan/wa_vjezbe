import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { naziv, minCijena, maxCijena, sort } = req.query;

    const filter = {};

    if (naziv) {
      filter.naziv = { $regex: naziv, $options: "i" };
    }

    if (minCijena || maxCijena) {
      filter["cijene.srednja"] = {};
      if (minCijena) filter["cijene.srednja"].$gte = Number(minCijena);
      if (maxCijena) filter["cijene.srednja"].$lte = Number(maxCijena);
    }

    let cursor = db.collection("pizze").find(filter);

    if (sort === "asc") cursor = cursor.sort({ "cijene.srednja": 1 });
    if (sort === "desc") cursor = cursor.sort({ "cijene.srednja": -1 });

    const pizze = await cursor.toArray();

    res.json(pizze);
  } catch (err) {
    res.status(500).json({ message: "Greška pri dohvaćanju pizza" });
  }
});

router.get("/:naziv", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const naziv = req.params.naziv;

    const pizza = await db.collection("pizze").findOne({
      naziv: { $regex: `^${naziv}$`, $options: "i" },
    });

    if (!pizza) {
      return res.status(404).json({
        message: `Pizza s nazivom ${naziv} nije pronađena.`,
      });
    }

    return res.status(200).json(pizza);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Greška pri dohvaćanju pizze" });
  }
});

router.post("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { naziv, sastojci, cijene, slika_url } = req.body;

    if (
      typeof naziv !== "string" ||
      !Array.isArray(sastojci) ||
      typeof cijene !== "object"
    ) {
      return res.status(400).json({ message: "Neispravni podaci" });
    }

    for (const s of sastojci) {
      if (typeof s !== "string") {
        return res
          .status(400)
          .json({ message: "Sastojci moraju biti stringovi" });
      }
    }

    if (
      typeof cijene.mala !== "number" ||
      typeof cijene.srednja !== "number" ||
      typeof cijene.jumbo !== "number"
    ) {
      return res.status(400).json({ message: "Cijene moraju biti brojevi" });
    }

    const novaPizza = {
      naziv,
      sastojci,
      cijene,
      slika_url: slika_url ?? null,
    };

    await db.collection("pizze").insertOne(novaPizza);

    res.status(201).json(novaPizza);
  } catch (err) {
    res.status(500).json({ message: "Greška pri dodavanju pizze" });
  }
});

export default router;
