import express from "express";
import { pizze } from "./pizze.js";

const router = express.Router();

let narudzbe = [];

router.post("/", (req, res) => {
  const { narudzba, klijent } = req.body;

  if (!narudzba || !klijent) {
    return res
      .status(400)
      .json({ message: "Tijelo zahtjeva mora sadržavati narudzba i klijent!" });
  }

  const { prezime, adresa, broj_telefona } = klijent;
  if (!prezime || !adresa || !broj_telefona) {
    return res.status(400).json({
      message:
        "Nedostaju podaci o klijentu (prezime, adresa ili broj_telefona)!",
    });
  }

  if (!Array.isArray(narudzba)) {
    return res
      .status(400)
      .json({ message: "Narudzba mora biti lista (array) pizza!" });
  }

  let ukupna_cijena = 0;

  for (const n of narudzba) {
    if (!n.pizza || !n.velicina || !n.kolicina) {
      return res.status(400).json({
        message: "Svaka narudzba mora sadržavati pizza, velicina i kolicina!",
      });
    }

    const postojiPizza = pizze.find(
      (p) => p.naziv.toLowerCase() === n.pizza.toLowerCase()
    );

    if (!postojiPizza) {
      return res
        .status(404)
        .json({ message: `Pizza '${n.pizza}' ne postoji u jelovniku!` });
    }

    ukupna_cijena += postojiPizza.cijena * n.kolicina;
  }

  narudzbe.push({ klijent, narudzba, ukupna_cijena });

  const opisNarudzbe = narudzba
    .map((n) => `${n.pizza} (${n.velicina})`)
    .join(" i ");

  res.json({
    message: `Vaša narudžba za ${opisNarudzbe} je uspješno zaprimljena!`,
    prezime,
    adresa,
    ukupna_cijena: ukupna_cijena.toFixed(2),
  });
});

router.get("/", (req, res) => {
  res.json(narudzbe);
});

export default router;
