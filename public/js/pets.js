const pagePet = document.body.dataset.pet || "dog";
const petsGrid = document.getElementById("petsGrid");
const loadingDiv = document.getElementById("loading");

async function getPets(type = "dog") {
  try {
    const response = await fetch(`/api/pets/${type}`);
    const data = await response.json();
    return data || [];
  } catch (err) {
    console.error("Error fetching pets:", err);
    return [];
  }
}

async function renderCardsFor(page) {
  if (!petsGrid || !loadingDiv) return;

  // Show loading, hide grid
  loadingDiv.style.display = "block";
  petsGrid.style.display = "none";

  const data = await getPets(page);

  // Hide loading, show grid
  loadingDiv.style.display = "none";
  petsGrid.style.display = "grid"; // or "block" depending on your CSS
  petsGrid.innerHTML = "";

  if (!data.length) {
    petsGrid.innerHTML = "<p>No pets found.</p>";
    return;
  }

  data.forEach((p) => {
    const card = document.createElement("div");
    card.className = "pet-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="pet-info">
        <h3>${p.name}</h3>
        <p>${p.breed}</p>
        <p>${p.age}</p>
      </div>
    `;
    card.addEventListener("click", () => openDetail(p));
    card.addEventListener("keydown", (e) => { if (e.key === "Enter") openDetail(p); });
    petsGrid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCardsFor(pagePet);

  const sel = document.getElementById("selectPetType");
  if (sel) {
    sel.addEventListener("change", async (e) => {
      const val = e.target.value.toLowerCase();
      let apiType = "dog";
      if (val.includes("cat")) apiType = "cat";
      else if (val.includes("bird")) apiType = "bird";
      else if (val.includes("small")) apiType = "small";
      await renderCardsFor(apiType);
    });
  }
});