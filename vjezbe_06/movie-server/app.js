import express from "express";
import movieRoutes from "./routes/movies.routes.js";
import actorRoutes from "./routes/actors.routes.js";
import logger from "./middleware/logger.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);
app.use("/movies", movieRoutes);
app.use("/actors", actorRoutes);

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
