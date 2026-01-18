//Message when the server is starting
console.log("SERVER STARTING...");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./server/User");
const Adoption = require("./server/Adoption");
const Order = require("./server/Order");

const app = express();
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const passport = require("passport");
require("./passport-config");
const API_KEY = "0qz4VD72";

//Allows a cross-origin requests and JSON handling
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.set("trust proxy", 1);

//Session setup for login persistance
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "lax"
    }
  })
);

//The one that initiate the passport for the Google Login
app.use(passport.initialize());
app.use(passport.session());

//Logs every requests made to the server
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

//This connects all of this to the MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

console.log("USER MODEL LOADED");

//Saves the shop orders
app.post("/api/order", async (req, res) => {
  const { items, total, userId, userName, userEmail } = req.body;

  try {
    const order = new Order({
      items,
      total,
      userId,
      userName,
      userEmail
    });

    await order.save();
    res.json({ message: "Order saved successfully" });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});

//Registration for users
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
//This one checks if an email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already exists" });
  }
//Hashed the password before it even save
  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashed
  });

  await user.save();
  res.json({ message: "User registered successfully" });
});

//User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
//Checks if the user already exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
//Checks if the password matches 
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
//Creates a login token
  const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "1d" });

  res.json({
    message: "Login successful",
    token,
    name: user.name,
    email: user.email
  });
});
//The Adoption form submission part
app.post("/api/adoption", async (req, res) => {
  try {
    const adoption = new Adoption({
      name: req.body.name,
      pet: req.body.pet,
      reason: req.body.reason,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      ownRent: req.body.ownRent,
      otherPets: req.body.otherPets,
      ownedBefore: req.body.ownedBefore,
      petLocation: req.body.petLocation,
      why: req.body.why,
      agree: req.body.agree,
      userId: req.body.userId,
      userName: req.body.userName,
      userEmail: req.body.userEmail
    });

    await adoption.save();
    res.json({ message: "Adoption form submitted successfully" });
  } catch (error) {
    console.error("Adoption error:", error);
    res.status(500).json({ error: "Failed to submit adoption form" });
  }
});

//The Pet API Handling for Dog, Cat, and Bird
const speciesMap = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird"
};
//Formats the API data into a clean objects for frontend
function formatPets(data) {
  const pictures = {};
  if (Array.isArray(data.included)) {
    data.included.forEach(item => {
      if (item.type === "pictures" && item.id) {
        pictures[item.id] = item.attributes;
      }
    });
  }

  return (data.data || []).map(p => {
    let img = "/img/default.jpg";
//Checks if the pet has img
    if (
      p.relationships &&
      p.relationships.pictures &&
      Array.isArray(p.relationships.pictures.data) &&
      p.relationships.pictures.data.length > 0
    ) {
      const picRef = p.relationships.pictures.data[0];
      const pic = pictures[picRef.id];

      if (pic) {
        img =
          (pic.large && pic.large.url) ||
          (pic.original && pic.original.url) ||
          (pic.small && pic.small.url) ||
          "/img/default.jpg";
      }
    } else if (p.attributes && p.attributes.pictureThumbnailUrl) {
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

//Fetch all the Pets from the RescueGroup API
app.get("/api/pets/:type", async (req, res) => {
  const type = req.params.type.toLowerCase();
  const url = "https://api.rescuegroups.org/v5/public/animals/search/available";
//Due to having no name for small animal I made it like this
  if (type === "small") {
    const smallSpecies = [
      "Rabbit",
      "Guinea Pig",
      "Ferret",
      "Hamster",
      "Gerbil",
      "Chinchilla",
      "Hedgehog",
      "Sugar Glider",
      "Rat",
      "Mouse"
    ];

    let allPets = [];

    for (const species of smallSpecies) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": API_KEY,
            "Content-Type": "application/vnd.api+json"
          },
          body: JSON.stringify({
            data: {
              filters: [
                { fieldName: "species.singular", operation: "equals", criteria: species }
              ],
              limit: 20
            },
            include: ["pictures", "breeds"]
          })
        });

        if (response.ok) {
          const data = await response.json();
          allPets = allPets.concat(formatPets(data));
        }
      } catch (err) {
        console.error(`Error fetching ${species}:`, err);
      }
    }

    return res.json(allPets);
  }

  //Normal pets like dogs, cats, and birds
  const species = speciesMap[type] || "Dog";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": API_KEY,
        "Content-Type": "application/vnd.api+json"
      },
      body: JSON.stringify({
        data: {
          filters: [
            { fieldName: "species.singular", operation: "equals", criteria: species }
          ],
          limit: 20
        },
        include: ["pictures", "breeds"]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API error:", errText);
      return res.json([]);
    }

    const data = await response.json();
    const petsArray = formatPets(data);

    res.json(petsArray);
  } catch (err) {
    console.error("Server error:", err);
    res.json([]);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login.html" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Logout Route
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

//Checks if the user is logged in
app.get("/users/me", (req, res) => {
  if (req.user) {
    return res.json(req.user);
  }
  res.json(null);
});

//Starting the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});