import fetch from "node-fetch";

const API_KEY = "0qz4VD72";
const url = "https://api.rescuegroups.org/v5/public/animals?species=dog&limit=5";

const testFetch = async () => {
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `apikey ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Raw API response:", text || "(empty)");

  } catch (err) {
    console.error("Fetch error:", err);
  }
};

testFetch();
