
const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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
        const text = await response.text();
        if (!text) return res.json([]);
        const data = JSON.parse(text);
        res.json(data.data || []);
    } catch (err) {
        console.error(err);
        res.json([]);
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
