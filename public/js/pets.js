const API_KEY = "0qz4VD72";

async function getPets(type = "dog") {
    const url = `https://api.rescuegroups.org/v5/public/animals?species=${type}&limit=20`;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch pets:", response.status, response.statusText);
            return [];
        }

        let data;
        try {
            data = await response.json();
        } catch(err) {
            console.error("Failed to parse JSON", err);
            return [];
        }

        if (!data.data) return [];

        const pets = data.data.map(p => ({
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
        console.error("Error fetching pets:", err);
        return [];
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

if (detailClose) detailClose.onclick = () => detailModal.style.display = "none";
window.addEventListener("click", (ev) => {
  if (ev.target === detailModal) detailModal.style.display = "none";
});

const adoptOverlay = document.getElementById("adoptOverlay");
const adoptPanel = adoptOverlay?.querySelector(".adopt-panel");
const adoptClose = document.getElementById("adoptClose");
const cancelAdopt = document.getElementById("cancelAdopt");
const adoptImg = document.getElementById("adoptImg");
const adoptName = document.getElementById("adoptName");
const adoptBreed = document.getElementById("adoptBreed");
const adoptAge = document.getElementById("adoptAge");
const adoptForm = document.getElementById("adoptForm");

function openAdopt(pet) {
  if (!adoptOverlay) return;
  adoptImg.src = pet.img;
  adoptName.textContent = pet.name;
  adoptBreed.textContent = pet.breed;
  adoptAge.textContent = pet.age;

  try { adoptForm.reset(); } catch (e) {}

  adoptOverlay.classList.remove("hidden");
  requestAnimationFrame(() => adoptOverlay.classList.add("show"));
  document.body.style.overflow = "hidden";
}

function closeAdopt() {
  if (!adoptOverlay) return;
  adoptOverlay.classList.remove("show");
  adoptOverlay.addEventListener("transitionend", function handler() {
    adoptOverlay.classList.add("hidden");
    document.body.style.overflow = "";
    adoptOverlay.removeEventListener("transitionend", handler);
  });
}

if (adoptClose) adoptClose.onclick = closeAdopt;
if (cancelAdopt) cancelAdopt.onclick = closeAdopt;

window.addEventListener("click", (ev) => {
  if (ev.target === adoptOverlay) closeAdopt();
});

if (adoptForm) {
  adoptForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const agree = document.getElementById("agree").checked;
    if (!name || !email || !agree) {
      alert("Please fill the form and check the box if you agree to the terms.");
      return;
    }

    const payload = {
      pet: adoptName.textContent,
      fullName: name,
      email: email,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      ownRent: document.getElementById("ownRent").value,
      otherPets: document.getElementById("otherPets").value,
      ownedBefore: document.getElementById("ownedBefore").value,
      location: document.getElementById("petLocation").value,
      why: document.getElementById("why").value
    };
    console.log("Adoption application", payload);

    alert("Application submitted. Thanks for submitting we'll contact you soon!");
    closeAdopt();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (pagePet !== "home") renderCardsFor(pagePet);

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