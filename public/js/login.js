//This opens when the user click the Account button
function handleAccountClick() {
  const overlay = document.getElementById("loginOverlay");
  const panel = document.getElementById("loginPanel");

  overlay.style.display = "block";
  panel.style.display = "block";

  //Adds all the animation class after the panel becomes visible
  requestAnimationFrame(() => {
    panel.classList.add("open");
  });
}

//Closes the login panel
function closeLogin() {
  const overlay = document.getElementById("loginOverlay");
  const panel = document.getElementById("loginPanel");

  overlay.style.display = "none";
  panel.classList.remove("open");

  //Waits for animation to finish before hiding the panel
  setTimeout(() => {
    panel.style.display = "none";
  }, 300);
}
//Opens up the signup panel
function openSignup() {
  const overlay = document.getElementById("signupOverlay");
  const panel = document.getElementById("signupPanel");

  overlay.style.display = "block";
  panel.style.display = "block";

  //Adds the animation class
  requestAnimationFrame(() => {
    panel.classList.add("open");
  });
}

//Closes the signup panel
function closeSignup() {
  const overlay = document.getElementById("signupOverlay");
  const panel = document.getElementById("signupPanel");

  overlay.style.display = "none";
  panel.classList.remove("open");

  //Waits for the animation to be finished
  setTimeout(() => {
    panel.style.display = "none";
  }, 300);
}

//Switches from signup panel to login panel
function openLogin() {
  closeSignup();
  handleAccountClick();
}

//Runs when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  //Temporary login message (before the backend connection)
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("loginMessage").textContent =
        "Login system not connected yet.";
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("signupMessage").textContent =
        "Signup system not connected yet.";
    });
  }
//Checks if the user is logged in
  fetch("/users/me")
  .then(res => res.json())
  .then(user => {
    if (user && user.name) {
      //These are the Elements inside the login panel
      const nameSpan = document.querySelector("#account-name");
      const loginSection = document.querySelector("#login-section");
      const userSection = document.querySelector("#user-section");
      const loginForm = document.querySelector("#loginForm");
      const loginHeading = document.querySelector("#loginPanel h2");
      const signupPrompt = document.querySelector("#signupPrompt");

      //Updates UI to show the logged in state
      if (nameSpan) nameSpan.textContent = user.name;
      if (loginSection) loginSection.style.display = "none";
      if (userSection) userSection.style.display = "block";
      if (loginForm) loginForm.style.display = "none";
      if (loginHeading) loginHeading.style.display = "none";
      if (signupPrompt) signupPrompt.style.display = "none";
    }
  });
});

//Logs the user out and refreshes the page 
function logout() {
  fetch("/logout")
    .then(() => location.reload());
}