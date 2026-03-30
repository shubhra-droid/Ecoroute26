const express = require("express");
const cors = require("cors");
const routeApi = require("./routes/route");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"]
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("EcoRoute Backend Running");
});

app.use("/api", routeApi);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});