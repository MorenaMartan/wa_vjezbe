import express from "express";
import fs from "fs/promises";

const PORT = 3000;
const app = express();
const putanja = "data/zaposlenici.json";

app.use(express.json());

app.get("/zaposlenici", async (req, res) => {
  try {
    const text = await fs.readFile(putanja, "utf8");
    let pozicija = req.query.pozicija;
    let zaposlenici = JSON.parse(text);
    let godine_staza_min = req.query.godine_staza_min;
    let godine_staza_max = req.query.godine_staza_max;
    let sortirano = req.query.sortirano;

    if (zaposlenici.length === 0) {
      return res
        .status(404)
        .json({ message: `Nema nijednog zaposlenika u bazi` });
    } else {
      if (pozicija !== undefined) {
        zaposlenici = zaposlenici.filter(
          (zaposlenik) => zaposlenik.pozicija === pozicija
        );
      }
      if (godine_staza_min !== undefined) {
        const min = Number(godine_staza_min);
        if (Number.isNaN(min)) {
          return res.status(400).json({ message: `Nije broj` });
        } else {
          zaposlenici = zaposlenici.filter((zaposlenik) => {
            return Number(zaposlenik.godina_staza) >= min;
          });
        }
      }
      if (godine_staza_max !== undefined) {
        const max = Number(godine_staza_max);
        if (Number.isNaN(max)) {
          return res.status(400).json({ message: `Nije broj` });
        } else {
          zaposlenici = zaposlenici.filter((zaposlenik) => {
            return Number(zaposlenik.godina_staza) <= max;
          });
        }
      }
      if (zaposlenici.length === 0) {
        return res.status(404).json({ message: `Nije pronađen zaposlenik!` });
      } else {
        if (sortirano !== undefined) {
          if (sortirano === "uzlazno") {
            zaposlenici.sort(
              (a, b) => Number(a.godina_staza) - Number(b.godina_staza)
            );
          } else if (sortirano === "silazno") {
            zaposlenici.sort(
              (a, b) => Number(b.godina_staza) - Number(a.godina_staza)
            );
          } else {
            return res
              .status(400)
              .json({ message: `Mora biti uzlazno ili silazno` });
          }
        }
        res.status(200).json(zaposlenici);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `${err.message}` });
  }
});

app.get("/zaposlenici/:id", async (req, res) => {
  let id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: `Id mora biti broj` });
  }
  try {
    const text = await fs.readFile(putanja, "utf8");
    let zaposlenici = JSON.parse(text);
    if (zaposlenici.length === 0) {
      return res
        .status(404)
        .json({ message: `Nema nijednog zaposlenika u bazi` });
    } else {
      const zaposlenik = zaposlenici.find(
        (zaposlenik) => Number(zaposlenik.id) === id
      );
      if (!zaposlenik) {
        res.status(404).json({ message: `Zaposlenik sa tim ID ne postoji!` });
      } else {
        res.status(200).json(zaposlenik);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `${err.message}` });
  }
});

app.post("/zaposlenici", async (req, res) => {
  const ime = req.body.ime;
  const prezime = req.body.prezime;
  const godina_staza = req.body.godina_staza;
  const pozicija = req.body.pozicija;
  if (
    ime === undefined ||
    prezime === undefined ||
    godina_staza === undefined ||
    pozicija === undefined
  ) {
    return res.status(400).json({
      message: "Mora biti ime, prezime, godinu_staza i pozicija.",
    });
  } else if (typeof ime !== "string" || ime.trim() === "") {
    return res.status(400).json({ message: "mora biti string." });
  } else if (typeof prezime !== "string" || prezime.trim() === "") {
    return res.status(400).json({ message: "mora biti string." });
  } else if (Number.isNaN(Number(godina_staza))) {
    return res.status(400).json({ message: "mora biti broj." });
  } else if (typeof pozicija !== "string" || pozicija.trim() === "") {
    return res.status(400).json({ message: "mora biti string." });
  }

  try {
    const tekst = await fs.readFile(putanja, "utf8");
    let zaposlenici = JSON.parse(tekst);

    let maxId = 0;
    for (let i = 0; i < zaposlenici.length; i++) {
      const trenutniId = Number(zaposlenici[i].id);
      if (!Number.isNaN(trenutniId) && trenutniId > maxId) {
        maxId = trenutniId;
      }
    }

    const noviZaposlenik = {
      id: maxId + 1,
      ime: ime.trim(),
      prezime: prezime.trim(),
      godina_staza: Number(godina_staza),
      pozicija: pozicija.trim(),
    };

    zaposlenici.push(noviZaposlenik);
    await fs.writeFile(putanja, JSON.stringify(zaposlenici, null, 2), "utf8");

    res.status(201).json(noviZaposlenik);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `${err.message}` });
  }
});
app.listen(PORT, () =>
  console.log(`Poslužitelj sluša na http://localhost:${PORT}`)
);
