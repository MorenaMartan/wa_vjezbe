import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  let total = 0;

  for (const item of req.body.narucene_pizze) {
    const pizza = await db.collection("pizze").findOne({ naziv: item.naziv });

    if (!pizza) {
      return res.status(400).json({
        error: `Pizza '${item.naziv}' ne postoji u ponudi`,
      });
    }

    total += pizza.cijene[item.velicina] * item.kolicina;
  }

  req.body.ukupna_cijena = total;
  await db.collection("narudzbe").insertOne(req.body);

  res.json({ msg: "Narudžba zaprimljena", ukupno: total });
});

export default router;
