import fetch from "node-fetch";

const API_KEY = "0qz4VD72";

const body = {
  apikey: API_KEY,
  objectType: "animals",
  objectAction: "publicSearch",
  search: {
    resultStart: 0,
    resultLimit: 5,
    filters: [
      {
        fieldName: "animalSpecies",
        operation: "equals",
        criteria: "Dog"
      }
    ],
    fields: [
      "animalID",
      "animalName",
      "animalBreed",
      "animalAgeString",
      "animalThumbnailUrl"
    ]
  }
};

const testFetch = async () => {
  try {
    const response = await fetch("https://api.rescuegroups.org/http/v2.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Raw API response:", text);

  } catch (err) {
    console.error("Fetch error:", err);
  }
};

testFetch();
