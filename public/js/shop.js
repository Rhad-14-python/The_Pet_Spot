const products = [
    //Dog foods
    {
        id: 1,
        name: "Premium Dog Kibble",
        price: 18.99,
        category: "foods",
        pet: "dog",
        image: "/img/dog_food1.png",
        description: "High-protein kibble for active dogs."
    },
    {
        id: 2,
        name: "Grain-Free Dog Food",
        price: 22.49,
        category: "foods",
        pet: "dog",
        image: "/img/dog_food2.jpg",
        description: "Gentle on sensitive stomachs."
    },
    {
        id: 3,
        name: "Wet Dog Food Pack",
        price: 14.99,
        category: "foods",
        pet: "dog",
        image: "/img/dog_food3.png",
        description: "6-pack of nutritious wet meals."
    },
    {
        id: 4,
        name: "Dog Chew Rope",
        price: 7.99,
        category: "toys",
        pet: "dog",
        image: "/img/dog_toy4.jpg",
        description: "Durable rope for tug and chew."
    },
    {
        id: 5,
        name: "Squeaky Bone Toy",
        price: 5.49,
        category: "toys",
        pet: "dog",
        image: "/img/dog_toy5.jpg",
        description: "Soft squeaky toy for playful dogs."
    },
    {
        id: 6,
        name: "Tennis Ball Pack",
        price: 8.99,
        category: "toys",
        pet: "dog",
        image: "/img/dog_toy6.png",
        description: "3-pack of bouncy tennis balls."
    },
    {
        id: 7,
        name: "Soft Dog Bed",
        price: 29.99,
        category: "beds",
        pet: "dog",
        image: "/img/dog_bed7.jpg",
        description: "Cozy bed for medium dogs."
    },
    {
        id: 8,
        name: "Large Orthopedic Bed",
        price: 49.99,
        category: "beds",
        pet: "dog",
        image: "/img/dog_bed8.jpg",
        description: "Memory foam bed for older dogs."
    },
    {
        id: 9,
        name: "Small Crate Mat",
        price: 19.99,
        category: "beds",
        pet: "dog",
        image: "/img/dog_bed9.jpg",
        description: "Soft mat for crates and carriers."
    },
    {
        id: 10,
        name: "Adjustable Dog Leash",
        price: 12.99,
        category: "collars",
        pet: "dog",
        image: "/img/dog_leash10.jpg",
        description: "Strong nylon leash for daily walks."
    },
    {
        id: 11,
        name: "Reflective Dog Collar",
        price: 9.99,
        category: "collars",
        pet: "dog",
        image: "/img/dog_collar11.jpg",
        description: "Reflective collar for night safety."
    },
    {
        id: 12,
        name: "Harness with Chest Support",
        price: 17.99,
        category: "collars",
        pet: "dog",
        image: "/img/dog_harness12.jpg",
        description: "Comfortable harness for long walks."
    },
    //Cats
    {
        id: 13,
        name: "Salmon Cat Food",
        price: 12.99,
        category: "foods",
        pet: "cat",
        image: "/img/cat-food1.jpg",
        description: "Rich salmon flavor cats love."
    },
    {
        id: 14,
        name: "Indoor Cat Formula",
        price: 15.49,
        category: "foods",
        pet: "cat",
        image: "/img/cat-food2.jpg",
        description: "Balanced nutrition for indoor cats."
    },
    {
        id: 15,
        name: "Wet Cat Food Variety Pack",
        price: 13.99,
        category: "foods",
        pet: "cat",
        image: "/img/cat-food3.jpg",
        description: "Mixed flavors for picky eaters."
    },
    {
        id: 16,
        name: "Feather Wand Toy",
        price: 6.49,
        category: "toys",
        pet: "cat",
        image: "/img/cat-toy1.jpg",
        description: "Interactive wand for playtime."
    },
    {
        id: 17,
        name: "Catnip Mouse Toy",
        price: 4.99,
        category: "toys",
        pet: "cat",
        image: "/img/cat-toy2.jpg",
        description: "Soft mouse filled with catnip."
    },
    {
        id: 18,
        name: "Rolling Ball Track",
        price: 9.99,
        category: "toys",
        pet: "cat",
        image: "/img/cat-toy3.jpg",
        description: "Keeps cats entertained for hours."
    },
    {
        id: 19,
        name: "Round Cat Bed",
        price: 22.99,
        category: "beds",
        pet: "cat",
        image: "/img/cat-bed1.jpg",
        description: "Soft round bed for cozy naps."
    },
    {
        id: 20,
        name: "Cat Cave Bed",
        price: 27.99,
        category: "beds",
        pet: "cat",
        image: "/img/cat-bed2.jpg",
        description: "Enclosed cave for shy cats."
    },
    {
        id: 21,
        name: "Window Hammock",
        price: 19.99,
        category: "beds",
        pet: "cat",
        image: "/img/cat-bed3.jpg",
        description: "Suction‑cup hammock for window lounging."
    },
    {
        id: 22,
        name: "Cat Collar with Bell",
        price: 7.99,
        category: "collars",
        pet: "cat",
        image: "/img/cat-collar1.jpg",
        description: "Adjustable collar with safety bell."
    },
    {
        id: 23,
        name: "Breakaway Collar",
        price: 8.49,
        category: "collars",
        pet: "cat",
        image: "/img/cat-collar2.jpg",
        description: "Breakaway design for safety."
    },
    {
        id: 24,
        name: "Reflective Cat Collar",
        price: 9.49,
        category: "collars",
        pet: "cat",
        image: "/img/cat-collar3.jpg",
        description: "Reflective strip for night visibility."
    },
    //Birds
    {
        id: 25,
        name: "Bird Seed Mix",
        price: 6.99,
        category: "foods",
        pet: "bird",
        image: "/img/bird-food1.jpg",
        description: "Healthy seed mix for small birds."
    },
    {
        id: 26,
        name: "Parrot Pellets",
        price: 11.99,
        category: "foods",
        pet: "bird",
        image: "/img/bird-food2.jpg",
        description: "Balanced pellets for parrots."
    },
    {
        id: 27,
        name: "Vitamin‑Enriched Bird Food",
        price: 9.49,
        category: "foods",
        pet: "bird",
        image: "/img/bird-food3.jpg",
        description: "Boosts immunity and feather health."
    },
    {
        id: 28,
        name: "Bird Swing",
        price: 5.99,
        category: "toys",
        pet: "bird",
        image: "/img/bird-toy1.jpg",
        description: "Fun swing for cage enrichment."
    },
    {
        id: 29,
        name: "Hanging Mirror Toy",
        price: 4.49,
        category: "toys",
        pet: "bird",
        image: "/img/bird-toy2.jpg",
        description: "Mirror toy to keep birds entertained."
    },
    {
        id: 30,
        name: "Colorful Ladder Toy",
        price: 6.49,
        category: "toys",
        pet: "bird",
        image: "/img/bird-toy3.jpg",
        description: "Climbing ladder for active birds."
    },
    {
        id: 31,
        name: "Bird Nesting Box",
        price: 12.99,
        category: "beds",
        pet: "bird",
        image: "/img/bird-bed1.jpg",
        description: "Safe nesting box for small birds."
    },
    {
        id: 32,
        name: "Hanging Bird Hut",
        price: 14.99,
        category: "beds",
        pet: "bird",
        image: "/img/bird-bed2.jpg",
        description: "Soft hut for cozy resting."
    },
    {
        id: 33,
        name: "Cage Perch Bed",
        price: 9.99,
        category: "beds",
        pet: "bird",
        image: "/img/bird-bed3.jpg",
        description: "Comfortable perch with padding."
    },
    {
        id: 34,
        name: "Bird Flight Harness",
        price: 15.99,
        category: "collars",
        pet: "bird",
        image: "/img/bird-harness1.jpg",
        description: "Safe harness for outdoor training."
    },
    {
        id: 35,
        name: "Small Bird Harness",
        price: 13.49,
        category: "collars",
        pet: "bird",
        image: "/img/bird-harness2.jpg",
        description: "Lightweight harness for tiny birds."
    },
    {
        id: 36,
        name: "Parrot Harness",
        price: 18.99,
        category: "collars",
        pet: "bird",
        image: "/img/bird-harness3.jpg",
        description: "Strong harness for parrots."
    },
    //small pets
    {
        id: 37,
        name: "Hamster Food Mix",
        price: 5.99,
        category: "foods",
        pet: "small",
        image: "/img/small-food1.jpg",
        description: "Balanced mix for hamsters."
    },
    {
        id: 38,
        name: "Guinea Pig Pellets",
        price: 7.49,
        category: "foods",
        pet: "small",
        image: "/img/small-food2.jpg",
        description: "Vitamin‑rich pellets for guinea pigs."
    },
    {
        id: 39,
        name: "Rabbit Food Blend",
        price: 8.99,
        category: "foods",
        pet: "small",
        image: "/img/small-food3.jpg",
        description: "Healthy blend for rabbits."
    },
    {
        id: 40,
        name: "Chew Toy Pack",
        price: 6.49,
        category: "toys",
        pet: "small",
        image: "/img/small-toy1.jpg",
        description: "Safe chew toys for small pets."
    },
    {
        id: 41,
        name: "Exercise Wheel",
        price: 12.99,
        category: "toys",
        pet: "small",
        image: "/img/small-toy2.jpg",
        description: "Quiet wheel for hamsters."
    },
    {
        id: 42,
        name: "Tunnel Tube",
        price: 9.49,
        category: "toys",
        pet: "small",
        image: "/img/small-toy3.jpg",
        description: "Fun tunnel for hiding and playing."
    },
    {
        id: 43,
        name: "Small Pet Hideout",
        price: 14.99,
        category: "beds",
        pet: "small",
        image: "/img/small-bed1.jpg",
        description: "Cozy hideout for small pets."
    },
    {
        id: 44,
        name: "Rabbit Bedding Mat",
        price: 11.99,
        category: "beds",
        pet: "small",
        image: "/img/small-bed2.jpg",
        description: "Soft mat for cages."
    },
    {
        id: 45,
        name: "Hamster Nest Bed",
        price: 8.49,
        category: "beds",
        pet: "small",
        image: "/img/small-bed3.jpg",
        description: "Warm nest for hamsters."
    },
    {
        id: 46,
        name: "Small Pet Harness",
        price: 9.99,
        category: "collars",
        pet: "small",
        image: "/img/small-harness1.jpg",
        description: "Harness for rabbits and guinea pigs."
    },
    {
        id: 47,
        name: "Lightweight Leash",
        price: 7.49,
        category: "collars",
        pet: "small",
        image: "/img/small-harness2.jpg",
        description: "Small leash for tiny pets."
    },
    {
        id: 48,
        name: "Adjustable Small Collar",
        price: 6.99,
        category: "collars",
        pet: "small",
        image: "/img/small-harness3.jpg",
        description: "Adjustable collar for small animals."
    },
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