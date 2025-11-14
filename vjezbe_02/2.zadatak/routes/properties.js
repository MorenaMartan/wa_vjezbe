import express from "express";

const router = express.Router();

export const properties = [
  {
    id: 1,
    name: "Kuća u Zaprešiću",
    description:
      "Na prodaju je top uređena obiteljska kuća u samom centru Zaprešića nadomak zaprešićkog terminala. Ova obiteljska katnica uređena je na način da mogu biti odvojene etaže odnosno odvojeni stanovi.",
    price: 550000,
    location: "Zaprešić",
    numRooms: 16,
    surface: 504,
  },
  {
    id: 2,
    name: "Kuća u Pojatnom, Zaprešić",
    description:
      "Prodaje se kuća s pogledom na Sljeme - mir, prostor i priroda nadomak Zaprešića!",
    price: 110000,
    location: "Zaprešić",
    numRooms: 5,
    surface: 156,
  },
  {
    id: 3,
    name: "Kuća u Zaprešiću, Kanadsko naselje",
    description:
      "Zaprešić, Kanadsko naselje, dvoetažna kuća zatvorene površine 124m2 s prekrasnim zimskim vrtom od 14m2 i dvorištem od 87m2. ",
    price: 550000,
    location: "Zaprešić",
    numRooms: 10,
    surface: 145,
  },
];

function isValidId(id) {
  return !isNaN(id);
}

function validateProperty(data, { partial = false } = {}) {
  const requiredFields = [
    "name",
    "description",
    "price",
    "location",
    "numRooms",
    "surface",
  ];

  if (!partial) {
    const missing = requiredFields.filter((field) => !(field in data));
    if (missing.length > 0) {
      return `Nedostaju polja ${missing.join(" , ")}`;
    }
  }

  if ("name" in data && typeof data.name !== "string") {
    return `Nekretnina mora biti string`;
  }

  if ("description" in data && typeof data.description !== "string") {
    return `Opis mora biti string`;
  }

  if ("location" in data && typeof data.location !== "string") {
    return `Lokacija mora biti string`;
  }

  if ("price" in data && (typeof data.price !== "number" || data.price < 0)) {
    return `Cijena mora biti pozitivan broj`;
  }
  if (
    "numRooms" in data &&
    (typeof data.numRooms !== "number" || data.numRooms < 0)
  ) {
    return `Broj soba mora biti pozitivan broj`;
  }
  if (
    "surface" in data &&
    (typeof data.surface !== "number" || data.surface < 0)
  ) {
    return `Površina mora biti pozitivan broj`;
  }
  return null;
}

// dohvati sve nekretnine

router.get(`/`, (req, res) => {
  return res.status(200).json(properties);
});

// dohvati nekretninu po ID-u

router.get(`/:id`, (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({ message: `Id nije validan` });
  }
  const property = properties.find((p) => p.id == id);

  if (!property) {
    return res
      .status(404)
      .json({ message: `Nekretnina ne postoji u bazi nekretnina` });
  }
  return res.status(200).json(property);
});
// dodaj novu nekretninu

router.post("/", (req, res) => {
  const data = req.body;

  const errorMessage = validateProperty(data, { partial: false });
  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }

  const newId =
    properties.length > 0 ? Math.max(...properties.map((p) => p.id)) + 1 : 1;

  const newProperty = {
    id: newId,
    name: data.name,
    description: data.description,
    price: data.price,
    location: data.location,
    numRooms: data.numRooms,
    surface: data.surface,
  };

  properties.push(newProperty);
  return res.status(201).json(newProperty);
});
// ažuriraj nekretninu potpuno

router.put("/:id", (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "ID nekretnine mora biti broj." });
  }

  const index = properties.findIndex((p) => p.id == id);
  if (index === -1) {
    return res.status(404).json({ message: `Nekretnina nije pronađena!` });
  }

  const data = req.body;
  const errorMessage = validateProperty(data, { partial: false });

  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }
  const updatedProperty = {
    id: properties[index].id,
    name: data.name,
    description: data.description,
    price: data.price,
    location: data.location,
    numRooms: data.numRooms,
    surface: data.surface,
  };

  properties[index] = updatedProperty;

  return res.status(200).json(updatedProperty);
});
// ažuriraj nekretninu djelomično

router.patch("/:id", (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "ID nekretnine mora biti broj." });
  }

  const index = properties.findIndex((p) => p.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Nekretnina nije pronađena." });
  }

  const data = req.body;
  const errorMessage = validateProperty(data, { partial: true });

  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }
  properties[index] = { ...properties[index], ...data };

  return res.status(200).json(properties[index]);
});

// obriši nekretninu
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "ID nekretnine mora biti broj." });
  }

  const index = properties.findIndex((p) => p.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Nekretnina nije pronađena." });
  }

  properties.splice(index, 1);

  return res.status(204).send();
});

export default router;
