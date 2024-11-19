import dotenv from "dotenv";
import express from "express";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import "./config/passport.js"; // Import Passport configuration
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session"
// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors({ 
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: true 
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())


// Routes
// Home route
app.get("/", (req, res) =>
  res.send('<h1>Welcome to "The Music Times" Backend </h1>')
);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoutes); // Added category routes
app.use("/api/product", productRoutes); // Added product routes


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.bgYellow.white)
);
