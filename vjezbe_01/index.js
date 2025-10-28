const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

const users = [
  { id: 1, ime: "Ana", prezime: "Radić" },
  { id: 2, ime: "Petra", prezime: "Basic" },
  { id: 3, ime: "Megi", prezime: "Marić" },
  { id: 4, ime: "Vicenca", prezime: "Abaza" },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
  }
});
