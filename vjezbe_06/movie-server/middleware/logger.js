export default (req, res, next) => {
  const appName = "movie-server";
  const now = new Date().toISOString().replace("T", " ").split(".")[0];
  console.log(`[${appName}] [${now}] ${req.method} ${req.originalUrl}`);
  next();
};
