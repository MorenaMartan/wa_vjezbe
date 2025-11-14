import express from "express";
import { properties } from "./properties.js";

const router = express.Router();

const offers = [];

function isValidId(id) {
  return !isNaN(id);
}

function validateOffer(data) {
  const requiredFields = [
    "propertyId",
    "firstName",
    "lastName",
    "offeredPrice",
    "phone",
  ];

  const missing = requiredFields.filter((field) => !(field in data));
  if (missing.length > 0) {
    return `Nedostaju polja: ${missing.join(", ")}`;
  }

  if (!isValidId(data.propertyId)) {
    return "ID nekretnine mora biti broj.";
  }

  if (typeof data.offeredPrice !== "number" || data.offeredPrice < 0) {
    return "Ponuđena cijena mora biti pozitivan broj.";
  }

  if (typeof data.firstName !== "string" || data.firstName.trim() === "") {
    return "Ime kupca mora biti string i ne smije biti prazno.";
  }

  if (typeof data.lastName !== "string" || data.lastName.trim() === "") {
    return "Prezime kupca mora biti string i ne smije biti prazno.";
  }

  if (typeof data.phone !== "string" || data.phone.trim() === "") {
    return "Broj telefona kupca mora biti string i ne smije biti prazan.";
  }

  return null;
}

router.post("/", (req, res) => {
  const data = req.body;

  const errorMessage = validateOffer(data);
  if (errorMessage) {
    return res.status(400).json({ message: errorMessage });
  }

  const property = properties.find((p) => p.id == data.propertyId);
  if (!property) {
    return res
      .status(404)
      .json({ message: "Nekretnina za zadani propertyId ne postoji." });
  }

  const newId =
    offers.length > 0 ? Math.max(...offers.map((o) => o.id)) + 1 : 1;

  const newOffer = {
    id: newId,
    propertyId: Number(data.propertyId),
    firstName: data.firstName,
    lastName: data.lastName,
    offeredPrice: data.offeredPrice,
    phone: data.phone,
  };

  offers.push(newOffer);

  return res.status(201).json({
    message: "Ponuda je uspješno zaprimljena.",
    offer: newOffer,
  });
});

export default router;
