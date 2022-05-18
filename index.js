const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require('cors');
// Import routes
const authRoute = require("./routes/auth");
const recipesRoute = require("./routes/recipes");
const commentsRoute = require("./routes/comments");
const ratingsRoute = require("./routes/ratings");
const refreshTokenRoute = require("./routes/refresh");

dotenv.config();

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  () => console.log("connected to db!"),
  { useNewUrlParser: true }
);

// Middleware
app.use(express.json());

// Function to serve static files
app.use('/images', express.static('public/data/images'));

// cors
app.use(cors({origin: 'http://localhost:3000', credentials: true}));

// Middleware for cookies
app.use(cookieParser());

// Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/recipes", recipesRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/ratings", ratingsRoute);
app.use("/api/refresh", refreshTokenRoute);

app.listen(8000, () => console.log("Server up and running"));
