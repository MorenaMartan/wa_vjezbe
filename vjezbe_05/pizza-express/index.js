import express from "express";
import pizzeRouter from "./routes/pizze.js";
import narudzbeRouter from "./routes/narudzbe.js";
import cors from "cors";
import { connectToDatabase } from "./db.js";

const app = express();
const PORT = 3000;

const db = await connectToDatabase();
app.locals.db = db;

app.use(express.json());
app.use(cors());
app.use("/pizze", pizzeRouter);
app.use("/narudzba", narudzbeRouter);

app.get("/", (req, res) => {
  res.send("Dobrodošli u Pizza Express poslužitelj!");
});

app.listen(PORT, () => {
  console.log(`Poslužitelj sluša na portu ${PORT}`);
});
