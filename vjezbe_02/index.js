import express from "express";
import pizzeRouter from "./routes/pizze.js";
import narudzbeRouter from "./routes/narudzbe.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/pizze", pizzeRouter);
app.use("/narudzbe", narudzbeRouter);

app.listen(port, () => {
  console.log(`Server pokrenut na http://localhost:${port}`);
});
