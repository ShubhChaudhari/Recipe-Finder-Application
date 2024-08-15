require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connection = require("./db");
const authRoutes = require("./routes/auth");
const recipesRoutes = require("./routes/recipes");
const app = express();

// database connection  
connection();

app.use(express.json());
app.use(cors());


//route
app.use("/auth",authRoutes);
app.use("/api",recipesRoutes);
app.listen(process.env.Port, () => {
    console.log(`Server is running at port ${process.env.Port}`);
  });
 