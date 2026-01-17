//Stores the currently Logged in user
let currentUser = null;

//This one checks if the user is logged in or not
fetch("/users/me")
  .then(res => res.json())
  .then(user => {
    if (user && user.name) {
      currentUser = user;
    }
  });

  //Runs when the page is not fully loaded
document.addEventListener("DOMContentLoaded", () => {
  //Gets the pet type from the dogs.html, cats.html, birds.html, and smallpets.html
  const pagePet = document.body.dataset.pet || "dog";
  //The main elements used for displaying the pets
  const petsGrid = document.getElementById("petsGrid");
  const loadingDiv = document.getElementById("loading");

  //The Elements for the pet detail modal
  const detailModal = document.getElementById("detailModal");
  const detailClose = document.getElementById("detailClose");
  const detailName = document.getElementById("detailName");
  const detailBreedAge = document.getElementById("detailBreedAge");
  const detailImg = document.getElementById("detailImg");
  const detailDescription = document.getElementById("detailDescription");
  const detailGender = document.getElementById("detailGender");
  const detailSize = document.getElementById("detailSize");
  const detailLocation = document.getElementById("detailLocation");
  const toggleBtn = document.getElementById("toggleDescription");
  const openAdoptBtn = document.getElementById("openAdoptFromDetail");

  //Elements for the adoption form panel
  const adoptOverlay = document.getElementById("adoptOverlay");
  const adoptClose = document.getElementById("adoptClose");
  const adoptName = document.getElementById("adoptName");
  const adoptBreed = document.getElementById("adoptBreed");
  const adoptAge = document.getElementById("adoptAge");
  const adoptImg = document.getElementById("adoptImg");
  const adoptForm = document.getElementById("adoptForm");
  const cancelAdopt = document.getElementById("cancelAdopt");

  //This formats all long description by adding line breaks
  function formatDescription(text) {
    return text.replace(/([.?!])\s+/g, "$1<br><br>");
  }

  //This fetches the pets from the server based on their type
  async function getPets(type = "dog") {
    try {
      const response = await fetch(`/api/pets/${type}`);
      const data = await response.json();
      return data || [];
    } catch (err) {
      return [];
    }
  }
// Render all the pet cards on the page
  async function renderCardsFor(page) {
    if (!petsGrid || !loadingDiv) return;

    //Shows all the loading animation
    loadingDiv.style.display = "block";
    petsGrid.style.display = "none";

    const data = await getPets(page);

    //Hides all the loading animation
    loadingDiv.style.display = "none";
    petsGrid.style.display = "grid";
    petsGrid.innerHTML = "";

    //If no pets shows this one activates
    if (!data.length) {
      petsGrid.innerHTML = "<p>No pets found.</p>";
      return;
    }

    //Makes a card for each cute pets
    data.forEach((p) => {
      const card = document.createElement("div");
      card.className = "pet-card";
      card.tabIndex = 0;
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div class="pet-info">
          <h3>${p.name}</h3>
          <p class="pet-breed">${p.breed}</p>
          <p class="pet-age">${p.age}</p>
        </div>
      `;

      petsGrid.appendChild(card);

      //Opens the detail modal for the chosen pet
      function openDetails() {
        detailName.textContent = p.name;
        detailBreedAge.textContent = `${p.breed}, ${p.age}`;
        detailImg.src = p.img;
        detailDescription.innerHTML = formatDescription(p.description || "No description available.");
        detailDescription.classList.remove("expanded");
        toggleBtn.textContent = "Read more";
        detailGender.textContent = p.gender;
        detailSize.textContent = p.size;
        detailLocation.textContent = p.location;
        detailModal.classList.add("show");
        document.body.classList.add("modal-open");
      }

      //Opens all the details when clicked or by pressing Enter
      card.addEventListener("click", openDetails);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter") openDetails();
      });
    });
  }

  //Closes the detail modal
  detailClose.addEventListener("click", () => {
    detailModal.classList.remove("show");
    document.body.classList.remove("modal-open");
  });

  //Closes the modal when clicked outside the card
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove("show");
      document.body.classList.remove("modal-open");
    }
  });

  //Expands or collapses the description text
  toggleBtn.addEventListener("click", () => {
    detailDescription.classList.toggle("expanded");
    toggleBtn.textContent = detailDescription.classList.contains("expanded")
      ? "Read less"
      : "Read more";
  });

  //Opens the adoption form if user is logged in
  openAdoptBtn.addEventListener("click", () => {
    if (!currentUser) {
      handleAccountClick();
      return;
    }
    adoptName.textContent = detailName.textContent;

    const [breed, age] = detailBreedAge.textContent.split(",");
    adoptBreed.textContent = breed.trim();
    adoptAge.textContent = age ? age.trim() : "";

    adoptImg.src = detailImg.src;
    adoptOverlay.classList.add("show");
    document.body.classList.add("modal-open");
  });
  
  //Close the adoption form
  adoptClose.addEventListener("click", () => {
    adoptOverlay.classList.remove("show");
    document.body.classList.remove("modal-open");
  });

  //Cancel the adoption form
  cancelAdopt.addEventListener("click", () => {
    adoptOverlay.classList.remove("show");
    document.body.classList.remove("modal-open");
  });

  //Handles the adoption form submissions
  adoptForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    //Checks if the form is valid
    if (!adoptForm.checkValidity()) {
      adoptForm.reportValidity();
      return;
    }

    //Collects the form data
    const formData = {
      pet: adoptName.textContent,
      name: document.getElementById("fullName").value,
      email: document.getElementById("adoptEmail").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      ownRent: document.getElementById("ownRent").value,
      otherPets: document.getElementById("otherPets").value,
      ownedBefore: document.getElementById("ownedBefore").value,
      petLocation: document.getElementById("petLocation").value,
      why: document.getElementById("why").value,
      agree: document.getElementById("agree").checked
    };

    //Sends an adoption form to the server
    try {
      const res = await fetch("/api/adoption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      alert(data.message || "Adoption submitted!");

      adoptForm.reset();
      adoptOverlay.classList.remove("show");
      document.body.classList.remove("modal-open");

    } catch (err) {
      console.error("Adoption error:", err);
      alert("Failed to submit adoption form.");
    }
  });

  //Loads all the pets for the current page
  renderCardsFor(pagePet);

  //Dropdown switches when the pet types are available (if available)
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