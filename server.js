// Message when the server is starting
console.log("SERVER STARTING...");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const User = require("./server/User");
const Adoption = require("./server/Adoption");
const Order = require("./server/Order");

require("./passport-config");

const API_KEY = "0qz4VD72";
const PORT = process.env.PORT || 3000;

const app = express();

// Allow cross-origin requests and JSON handling
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Tell Express it is behind a proxy (needed for Render HTTPS)
app.set("trust proxy", 1);

// Session setup for login persistence
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,    // required for HTTPS
      sameSite: "lax"  // required for Google OAuth redirects
    }
  })
);

// Initialize Passport for Google login
app.use(passport.initialize());
app.use(passport.session());

// Logs every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

console.log("USER MODEL LOADED");

// ------------------ Routes ------------------

// Orders
app.post("/api/order", async (req, res) => {
  const { items, total, userId, userName, userEmail } = req.body;
  try {
    const order = new Order({ items, total, userId, userName, userEmail });
    await order.save();
    res.json({ message: "Order saved successfully" });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// User registration
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();
  res.json({ message: "User registered successfully" });
});

// User login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ message: "Login successful", token, name: user.name, email: user.email });
});

// Adoption form
app.post("/api/adoption", async (req, res) => {
  try {
    const adoption = new Adoption({ ...req.body });
    await adoption.save();
    res.json({ message: "Adoption form submitted successfully" });
  } catch (error) {
    console.error("Adoption error:", error);
    res.status(500).json({ error: "Failed to submit adoption form" });
  }
});

// Fetch pets
const speciesMap = { dog: "Dog", cat: "Cat", bird: "Bird" };

function formatPets(data) {
  const pictures = {};
  if (Array.isArray(data.included)) {
    data.included.forEach(item => {
      if (item.type === "pictures" && item.id) pictures[item.id] = item.attributes;
    });
  }

  return (data.data || []).map(p => {
    let img = "/img/default.jpg";
    if (p.relationships?.pictures?.data?.length > 0) {
      const pic = pictures[p.relationships.pictures.data[0].id];
      if (pic) img = pic.large?.url || pic.original?.url || pic.small?.url || "/img/default.jpg";
    } else if (p.attributes?.pictureThumbnailUrl) {
      img = p.attributes.pictureThumbnailUrl;
    }

    return {
      name: p.attributes.name,
      breed: p.attributes.breedPrimary || "Unknown",
      age: p.attributes.ageGroup || "Unknown",
      img,
      description: p.attributes.descriptionText || "",
      gender: p.attributes.sex || "Unknown",
      size: p.attributes.sizeGroup || "Unknown",
      location: p.attributes.locationCityState || "Unknown"
    };
  });
}

app.get("/api/pets/:type", async (req, res) => {
  const type = req.params.type.toLowerCase();
  const url = "https://api.rescuegroups.org/v5/public/animals/search/available";

  const smallSpecies = [
    "Rabbit","Guinea Pig","Ferret","Hamster","Gerbil","Chinchilla",
    "Hedgehog","Sugar Glider","Rat","Mouse"
  ];

  try {
    if (type === "small") {
      let allPets = [];
      for (const species of smallSpecies) {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Authorization": API_KEY, "Content-Type": "application/vnd.api+json" },
          body: JSON.stringify({ data: { filters: [{ fieldName: "species.singular", operation: "equals", criteria: species }], limit: 20 }, include: ["pictures", "breeds"] })
        });
        if (response.ok) {
          const data = await response.json();
          allPets = allPets.concat(formatPets(data));
        }
      }
      return res.json(allPets);
    }

    const species = speciesMap[type] || "Dog";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Authorization": API_KEY, "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({ data: { filters: [{ fieldName: "species.singular", operation: "equals", criteria: species }], limit: 20 }, include: ["pictures", "breeds"] })
    });
    if (!response.ok) return res.json([]);
    const data = await response.json();
    res.json(formatPets(data));

  } catch (err) {
    console.error("Server error:", err);
    res.json([]);
  }
});

// ------------------ Google OAuth ------------------

// Start Google login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login.html" }), (req, res) => {
  res.redirect("/");
});

// Logout
app.get("/logout", (req, res) => {
  req.logout(() => { res.redirect("/"); });
});

// Get current user
app.get("/users/me", (req, res) => {
  if (req.user) return res.json(req.user);
  res.json(null);
});

// ------------------ Start server ------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
