import express from "express";
import propertiesRouter from "./routes/properties.js";
import offersRouter from "./routes/offers.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/properties", propertiesRouter);
app.use("/offers", offersRouter);

app.listen(PORT, (error) => {
  if (error) {
    console.log(`Greška ${error.message}`);
  } else {
    console.log(`Server radi na http://localhost:${PORT}`);
  }
});
