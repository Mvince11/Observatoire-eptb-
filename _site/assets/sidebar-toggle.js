document.addEventListener("DOMContentLoaded", function () {

  function setupNavRedirect(navId, target, relatedPages = []) {
    const elem = document.getElementById(navId);

    if (elem) {
      elem.addEventListener("click", function (event) {
        event.preventDefault(); // Empêche le comportement Bootstrap
        // Réouvre le menu immédiatement
        elem.classList.add("show");
        const menu = elem.nextElementSibling;
        if (menu?.classList.contains("dropdown-menu")) {
          menu.classList.add("show");
        }
        // Lance la navigation sans condition
        setTimeout(() => {
          window.location.href = target;
        }, 100); 
      });
    }

    // Ouvre automatiquement le menu si la page actuelle est liée
    const currentPath = window.location.pathname;
    if (
      relatedPages.some(p => currentPath.endsWith(p)) ||
      currentPath.endsWith(target)
    ) {
      const menu = elem?.nextElementSibling;
      if (elem && menu?.classList.contains("dropdown-menu")) {
        elem.classList.add("show");
        menu.classList.add("show");
      }
    }
  }

  // Configuration des objectifs
  setupNavRedirect("nav-menu-objectif-n°1", "objectif1.html", [
    "batiments_plain_pied.html",
    "etablissements_sensibles.html"
  ]);

  setupNavRedirect("nav-menu-objectif-n°2", "objectif2.html", [
    "dommages_entreprises.html"
  ]);

  setupNavRedirect("nav-menu-objectif-n°3", "objectif3.html", [
    "habitants_zones_inondables.html"
  ]);

});