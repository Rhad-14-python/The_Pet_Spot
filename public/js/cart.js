//A massage for confirmation it the cart script is loading
console.log("CART.JS LOADED");

//Checks if the user is logged in
fetch("/users/me")
  .then(res => res.json())
  .then(user => {
    if (user && user.name) {
      currentUser = user;
    }
  });

  //Stores all cart items and the total prices
let cart = [];
let cartTotal = 0;

//Adds a product to the cart
window.addToCart = function (product) {
  console.log("CART RECEIVED:", product);
  cart.push(product);
  updateCartCount();
  renderCartItems();
};
console.log("addToCart defined:", typeof window.addToCart);

//Updates the cart icon count 
function updateCartCount() {
  document.querySelector(".cart-count").textContent = cart.length;
}

//Opens the cart icon when clicked
function openCart() {
  document.getElementById("cartPanelbox").classList.add("open");
  document.getElementById("cartOverlay").style.display = "block";
  renderCartItems();
}

//Closes the cart panel
function closeCart() {
  document.getElementById("cartPanelbox").classList.remove("open");
  document.getElementById("cartOverlay").style.display = "none";
}

//Runs the page when its fully loaded
document.addEventListener("DOMContentLoaded", () => {

  //Cart open and closes listeners
  document.querySelector(".cart-popup").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  //Checkout and payment elements
  const checkoutBtn = document.querySelector(".checkout-btn");
  const paymentForm = document.getElementById("paymentForm");
  const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");

  //Shows the payment form when clicking checkout
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    paymentForm.style.display = "block";
  });

  //Handles the payment confirmations
  confirmPaymentBtn.addEventListener("click", () => {
    const name = document.getElementById("cardName").value.trim();
    const number = document.getElementById("cardNumber").value.trim();
    const expiry = document.getElementById("cardExpiry").value.trim();
    const cvv = document.getElementById("cardCVV").value.trim();

    //Checks if the payment fields are being filled
    if (!name || !number || !expiry || !cvv) {
      alert("Please fill in all payment details.");
      return;
    }

    alert("Payment successful! Thank you for your order.");

    //Saves the order to the server
    fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        total: cartTotal,
        userId: currentUser?._id,
        userName: currentUser?.name,
        userEmail: currentUser?.email
      })
    }).catch(err => {
      console.error("Failed to save order:", err);
    });

    //Clears the cart after paying
    cart = [];
    updateCartCount();
    renderCartItems();
    paymentForm.style.display = "none";
    closeCart();
  });
});

//Renders all the items inside the cart panel
function renderCartItems() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  let total = 0;

  //Creates a row for each cart items 
  cart.forEach((item, index) => {
    total += item.price * 3.67;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <span>${item.name}</span>
      <span>AED ${(item.price * 3.67).toFixed(2)}</span>
      <button class="remove-item" data-index="${index}">Remove</button>
    `;

    container.appendChild(div);
  });

  //Updates the total price
  cartTotal = total;
  document.getElementById("cartTotal").textContent = total.toFixed(2);

  //Deleting the items when clicking the "Remove" button
  document.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cart.splice(index, 1);
      updateCartCount();
      renderCartItems();
    });
  });
}