import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;
const API_KEY = "0qz4VD72";

app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const speciesMap = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird"
};

const smallSpecies = [
  "Rabbit",
  "Guinea Pig",
  "Hamster",
  "Ferret",
  "Rat",
  "Mouse",
  "Gerbil"
];

app.get("/api/pets/:type", async (req, res) => {
  const type = req.params.type.toLowerCase();
  const url = "https://api.rescuegroups.org/v5/public/animals/search/available";
  let allPets = [];

  if (type === "small") {
    for (const sp of smallSpecies) {
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
                { fieldName: "species.singular", operation: "equals", criteria: sp }
              ],
              limit: 10,
              include: ["breeds", "pictures"]
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const petsArray = (data.data || []).map(p => ({
            name: p.attributes.name,
            breed: p.attributes.breedPrimary || "Unknown",
            age: p.attributes.ageGroup || "Unknown",
            img: p.attributes.pictureThumbnailUrl || "/images/default.jpg"
          }));
          allPets = allPets.concat(petsArray);
        }
      } catch (err) {
        console.error(`Error fetching ${sp}:`, err);
      }
    }
    return res.json(allPets);
  }

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
          limit: 20,
          include: ["breeds", "pictures"]
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API error:", errText);
      return res.json([]);
    }

    const data = await response.json();
    const petsArray = (data.data || []).map(p => ({
      name: p.attributes.name,
      breed: p.attributes.breedPrimary || "Unknown",
      age: p.attributes.ageGroup || "Unknown",
      img: p.attributes.pictureThumbnailUrl || "/images/default.jpg"
    }));

    res.json(petsArray);
  } catch (err) {
    console.error("Server error:", err);
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
