import express from "express";

const router = express.Router();

const pizze = [
  { id: 1, naziv: "Margerita", cijena: 7.0 },
  { id: 2, naziv: "Capricciosa", cijena: 9.0 },
  { id: 3, naziv: "Šunka sir", cijena: 8.0 },
  { id: 4, naziv: "Vegetariana", cijena: 12.0 },
  { id: 5, naziv: "Quattro formaggi", cijena: 15.0 },
];

router.get("/", (req, res) => {
  res.json(pizze);
});

router.get("/:id", (req, res) => {
  const id_pizza = req.params.id;

  if (isNaN(id_pizza)) {
    return res.status(400).json({
      message: "Proslijedili ste parametar id koji nije broj!",
    });
  }

  const pizza = pizze.find((p) => p.id == id_pizza);

  if (pizza) {
    res.status(200).json(pizza);
  } else {
    res.status(404).json({ message: "Pizza s traženim ID-em ne postoji." });
  }
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID pizze mora biti broj." });
  }

  const { id: bodyId, naziv, cijena } = req.body;
  if (bodyId === undefined || !naziv || cijena === undefined) {
    return res
      .status(400)
      .json({ message: "PUT zahtjev mora sadržavati id, naziv i cijena." });
  }

  if (Number(bodyId) !== id) {
    return res
      .status(400)
      .json({ message: "ID u URL-u i ID u tijelu moraju se poklapati." });
  }

  const index = pizze.findIndex((p) => p.id === id);
  if (index === -1) {
    const nova = { id, naziv, cijena: Number(cijena) };
    pizze.push(nova);
    return res.status(201).json(nova);
  }
  pizze[index] = { id, naziv, cijena: Number(cijena) };
  return res.status(200).json(pizze[index]);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID pizze mora biti broj." });
  }

  const index = pizze.findIndex((p) => p.id === id);
  if (index === -1) {
    return res
      .status(404)
      .json({ message: "Pizza s traženim ID-em ne postoji." });
  }

  const nova = { ...pizze[index], ...req.body };

  nova.id = id;
  if (nova.cijena !== undefined) nova.cijena = Number(nova.cijena);

  pizze[index] = nova;
  return res.status(200).json(pizze[index]);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID pizze mora biti broj." });
  }

  const index = pizze.findIndex((p) => p.id === id);
  if (index === -1) {
    return res
      .status(404)
      .json({ message: "Pizza s traženim ID-em ne postoji." });
  }

  const obrisana = pizze.splice(index, 1)[0];
  return res
    .status(200)
    .json({ message: "Pizza uspješno obrisana.", obrisana });
});

export default router;
export { pizze };
