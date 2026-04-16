require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------
// MIDDLEWARE
// ----------------------
app.use(cors());             
app.use(express.json());      



// ----------------------
// ROUTES
// ----------------------
const dashboardRoutes = require("./routes/dashboard");
const authRouter = require("./routes/auth")

// IMPORTANT: mount route
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/auth", authRouter)

// ----------------------
// TEST ROUTE 
// ----------------------
app.get("/", (req, res) => {
  res.send("Server is running");
});



// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});