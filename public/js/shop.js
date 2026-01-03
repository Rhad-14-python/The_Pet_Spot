const products = [
  {
    id: 1,
    name: "Premium Dog Food",
    price: 19.99,
    category: "foods",
    pet: "dog",
    image: "/img/product-placeholder.jpg",
    description: "Nutritious dry food for active dogs."
  },
  {
    id: 2,
    name: "Cat Feather Toy",
    price: 6.49,
    category: "toys",
    pet: "cat",
    image: "/img/product-placeholder.jpg",
    description: "Fun interactive toy for playful cats."
  },
  {
    id: 3,
    name: "Soft Cat Bed",
    price: 24.99,
    category: "beds",
    pet: "cat",
    image: "/img/product-placeholder.jpg",
    description: "Comfortable bed for cozy naps."
  },
  {
    id: 4,
    name: "Bird Vitamin Drops",
    price: 12.49,
    category: "foods",
    pet: "bird",
    image: "/img/product-placeholder.jpg",
    description: "Daily vitamins for small birds."
  }
];
function displayProducts(list) {
  const grid = document.getElementById("shopGrid");
  grid.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("shop-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <p class="description">${product.description}</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;

    grid.appendChild(card);
  });
}
displayProducts(products);
const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const category = tab.dataset.category;

    if (category === "foods" || category === "toys" || category === "beds" || category === "collars") {
      const filtered = products.filter(p => p.category === category);
      displayProducts(filtered);
    } else {
      displayProducts(products);
    }
  });
});
const petSelect = document.getElementById("petType");

petSelect.addEventListener("change", () => {
  const type = petSelect.value;

  if (type === "all") {
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.pet === type);
    displayProducts(filtered);
  }
});
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term)
  );

  displayProducts(filtered);
});
let cart = [];

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const id = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === id);

    cart.push(product);
    updateCartCount();
  }
});

function updateCartCount() {
  document.querySelector(".cart-count").textContent = cart.length;
}
