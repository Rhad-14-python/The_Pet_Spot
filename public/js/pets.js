const API_Key = "0qz4VD72"

const pagePet = document.body.dataset.pet || "dog";
const petsGrid = document.getElementById("petsGrid");

async function getPets(type="dog") {
    const url = "https://api.rescuegroups.org/v5/public/animals?species=${type}&limit=20";

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": 'Bearer ${API_KEY}',
                "Content-Type": "application/json"
            }
        });
        if(!response.ok)throw new Error("Failed to fetch Pets")

        const data = await response.json();

        const pets = data.data.map((p)=>({
            id: p.id,
            name: p.attributes.name || "Unknown",
            breed: p.attributes.breed || "Unknown",
            age: p.attributes.age || "Unknown",
            gender: p.attributes.sex || "Unknown",
            size: p.attributes.size || "Unknown",
            location: p.attributes.location || "Unknown",
            img: p.attributes.images?.[0]?.url || "https://placehold.co/600x400?text=No+Image",
            description: p.attributes.description || "No description"
        }));
        return pets;
    } catch (err) {
        console.error(err);
        return[];
    }
}

async function renderCardsFor(page) {
    if (!petsGrid) return;

    petsGrid.classList.remove("fade-in");
    petsGrid.classList.add("fade-out");

    await new Promise((resolve => setTimeout(resolve, 413)));

    petsGrid.innerHTML = "<p>Please wait. . .</p>";

    const data= await getPets(page);

    petsGrid.innerHTML="";

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

const detailModal = document.getElementById("detailModal");
const detailClose = document.getElementById("detailClose");
const detailImg = document.getElementById("detailImg");
const detailName = document.getElementById("detailName");
const detailBreedAge = document.getElementById("detailBreedAge");
const detailDescription = document.getElementById("detailDescription");
const detailGender = document.getElementById("detailGender");
const detailSize = document.getElementById("detailSize");
const detailLocation = document.getElementById("detailLocation");
const openAdoptBtn = document.getElementById("openAdoptFromDetail");

function openDetail(pet) {
  if (!detailModal) return;
  detailImg.src = pet.img;
  detailName.textContent = pet.name;
  detailBreedAge.textContent = `${pet.breed} • ${pet.age}`;
  detailDescription.textContent = pet.description || "";
  detailGender.textContent = pet.gender || "Unknown";
  detailSize.textContent = pet.size || "Unknown";
  detailLocation.textContent = pet.location || "";
  detailModal.style.display = "flex";

  setTimeout(() => {
    const adb = document.getElementById("openAdoptFromDetail");
    if (adb) {
      adb.onclick = () => {
        detailModal.style.display = "none";
        openAdopt(pet);
      };
    }
  }, 0);
}