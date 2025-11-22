document.addEventListener("DOMContentLoaded", () => {
  const pagePet = document.body.dataset.pet || "dog";
  const petsGrid = document.getElementById("petsGrid");
  const loadingDiv = document.getElementById("loading");

  const detailModal = document.getElementById("detailModal");
  const detailClose = document.getElementById("detailClose");
  const detailName = document.getElementById("detailName");
  const detailBreedAge = document.getElementById("detailBreedAge");
  const detailImg = document.getElementById("detailImg");
  const openAdoptBtn = document.getElementById("openAdoptFromDetail");

  const adoptOverlay = document.getElementById("adoptOverlay");
  const adoptClose = document.getElementById("adoptClose");
  const adoptName = document.getElementById("adoptName");
  const adoptBreed = document.getElementById("adoptBreed");
  const adoptAge = document.getElementById("adoptAge");
  const adoptImg = document.getElementById("adoptImg");
  const adoptForm = document.getElementById("adoptForm");
  const cancelAdopt = document.getElementById("cancelAdopt");

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

    loadingDiv.style.display = "block";
    petsGrid.style.display = "none";

    const data = await getPets(page);

    loadingDiv.style.display = "none";
    petsGrid.style.display = "grid";
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
        <h3>${p.name}</h3>
        <p class="pet-breed">${p.breed}</p>
        <p class="pet-age">${p.age}</p>
      `;
      petsGrid.appendChild(card);

      card.addEventListener("click", () => {
        detailName.textContent = p.name;
        detailBreedAge.textContent = `${p.breed}, ${p.age}`;
        detailImg.src = p.img;
        detailModal.classList.add("show");
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          detailName.textContent = p.name;
          detailBreedAge.textContent = `${p.breed}, ${p.age}`;
          detailImg.src = p.img;
          detailModal.classList.add("show");
        }
      });
    });
  }

  detailClose.addEventListener("click", () => {
    detailModal.classList.remove("show");
  });

  openAdoptBtn.addEventListener("click", () => {
    adoptName.textContent = detailName.textContent;
    adoptBreed.textContent = detailBreedAge.textContent;
    adoptImg.src = detailImg.src;
    adoptOverlay.classList.add("show");
  });

  adoptClose.addEventListener("click", () => {
    adoptOverlay.classList.remove("show");
  });
  cancelAdopt.addEventListener("click", () => {
    adoptOverlay.classList.remove("show");
  });

  adoptForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      pet: adoptName.textContent,
      name: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      ownRent: document.getElementById("ownRent").value,
      otherPets: document.getElementById("otherPets").value,
      ownedBefore: document.getElementById("ownedBefore").value,
      petLocation: document.getElementById("petLocation").value,
      why: document.getElementById("why").value,
      agree: document.getElementById("agree").checked,
    };

    console.log("Adoption request submitted:", formData);
    alert("Your adoption request has been sent!");

    adoptForm.reset();
    adoptOverlay.classList.remove("show");
  });

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