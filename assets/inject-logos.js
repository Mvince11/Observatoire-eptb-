window.addEventListener("DOMContentLoaded", () => {
  const navbarTitle = document.querySelector(".navbar-title");
  if (!navbarTitle) return;

  // Crée le conteneur
  const logoContainer = document.createElement("div");
  logoContainer.style.display = "flex";
  logoContainer.style.alignItems = "center";
  logoContainer.style.gap = "10px";
  logoContainer.style.marginLeft = "15px";

  // Ajoute les images
  const logo1 = document.createElement("img");
  logo1.src = "Images/LogoCerema_2021_horizontal.png";
  logo1.style.height = "30px";

  const logo2 = document.createElement("img");
  logo2.src = "Images/Logo-EPTB-Vienne-RVB-300dpi.jpg";
  logo2.style.height = "30px";

  logoContainer.appendChild(logo1);
  logoContainer.appendChild(logo2);

  navbarTitle.parentNode.insertBefore(logoContainer, navbarTitle);
});


