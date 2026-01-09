import express from "express";
import cors from "cors";
import "dotenv/config";

import pizzeRouter from "./routes/pizze.js";
import narudzbeRouter from "./routes/narudzbe.js";
import { connectToDatabase } from "./db.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

try {
  const db = await connectToDatabase();
  app.locals.db = db;
  console.log("Spojeno na MongoDB Atlas");
} catch (err) {
  console.error("Greška pri spajanju na MongoDB:", err);
  process.exit(1);
}

app.use("/pizze", pizzeRouter);
app.use("/narudzba", narudzbeRouter);

app.get("/", (req, res) => {
  res.send("Pizza Express API radi ");
});

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint ne postoji" });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Greška na serveru" });
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
