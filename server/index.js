require("dotenv").config({ path: "../.env" });

console.log("Loaded server/index.js");

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dashboardRoutes = require("./routes/dashboard");
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/homeRouter");
const eventPageRouter = require("./routes/eventPageRouter");
const aisuggestionsRoutes = require("./routes/aisuggestions");

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRouter);
app.use("/api", aisuggestionsRoutes); // so /api/ai/suggest-locations is reachable
app.use("/api/home", homeRouter);
app.use("/api/eventPage", eventPageRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
