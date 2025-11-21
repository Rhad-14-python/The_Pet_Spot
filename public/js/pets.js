const pagePet = document.body.dataset.pet || "dog";
const petsGrid = document.getElementById("petsGrid");

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
  if (!petsGrid) return;

  petsGrid.classList.remove("fade-in");
  petsGrid.classList.add("fade-out");

  await new Promise(resolve => setTimeout(resolve, 413));

  petsGrid.innerHTML = "<p>Loading pets...</p>";

  const data = await getPets(page);

  petsGrid.innerHTML = "";

  if (!data.length) {
    petsGrid.innerHTML = "<p>No pets found.</p>";
    petsGrid.classList.remove("fade-out");
    petsGrid.classList.add("fade-in");
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

  petsGrid.classList.remove("fade-out");
  petsGrid.classList.add("fade-in");
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
