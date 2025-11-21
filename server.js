import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;
const API_KEY = "0qz4VD72";

app.use(express.static("public"));

app.get("/api/pets/:type", async (req, res) => {
  const type = req.params.type || "dog";
  const url = `https://api.rescuegroups.org/v5/public/animals?species=${type}&limit=20`;

  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `apikey ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const raw = await response.json();
    const items = raw.data || {};

    const formatted = Object.values(items).map(a => {
      return {
        id: a.animalID || a.id,
        attributes: {
          name: a.animalName || "Unknown",
          breed: a.animalBreed || "Unknown",
          age: a.animalAgeString || "Unknown",
          sex: a.animalSex || "Unknown",
          size: a.animalSizeCurrent || "Unknown",
          location: a.animalLocation || "Unknown",
          description: a.animalDescriptionPlain || "",
          images: [
            {
              url:
                a.animalThumbnailUrl ||
                "https://placehold.co/600x400?text=No+Image"
            }
          ]
        }
      };
    });

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
