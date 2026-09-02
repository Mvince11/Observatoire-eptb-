document.addEventListener("DOMContentLoaded", function () {

  // --- 1) Récupérer la navbar Quarto
  const navbar = document.querySelector("nav.navbar");
  if (!navbar) return;

  // --- 2) Créer le bouton style Géoportail
  const menuButton = document.createElement("button");
  menuButton.id = "menuButton";
  menuButton.style = `
    background: #ffffff;
    border: 1px solid #d0d0d0;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin-right: 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
    cursor: pointer;
    transition: background 0.2s;
  `;
  menuButton.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#444">
      <rect x="3" y="6" width="18" height="2"></rect>
      <rect x="3" y="11" width="18" height="2"></rect>
      <rect x="3" y="16" width="18" height="2"></rect>
    </svg>
  `;
  menuButton.onmouseover = () => menuButton.style.background = "#f2f2f2";
  menuButton.onmouseout  = () => menuButton.style.background = "#ffffff";

  // --- 3) Insérer le bouton AVANT les logos
  const brandContainer = navbar.querySelector(".navbar-brand-container");
  if (brandContainer) {
    brandContainer.parentNode.insertBefore(menuButton, brandContainer);
  } else {
    navbar.insertBefore(menuButton, navbar.firstChild);
  }

  // --- 4) Récupérer le menu Quarto (navbar-collapse)
  const collapse =
    document.getElementById("quarto-navbar-collapse") ||
    document.getElementById("navbarCollapse");

  if (collapse) collapse.classList.add("d-none");

  // --- 5) Récupérer les outils Quarto
  const tools = document.querySelector(".quarto-navbar-tools");

  // --- 6) Créer le panneau latéral
  const sideMenu = document.createElement("div");
  sideMenu.id = "sideMenu";
  sideMenu.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 320px;
    height: 100%;
    background: white;
    border-right: 1px solid #ccc;
    box-shadow: 2px 0 6px rgba(0,0,0,0.2);
    padding: 15px;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 2000;
  `;

  sideMenu.innerHTML = `
    <h3 style="margin-top:0;">Menu</h3>
    <div class="accordion" id="menuAccordion"></div>
    <hr>
    <div id="toolsContainer"></div>
  `;

  document.body.appendChild(sideMenu);

  const accordion = document.getElementById("menuAccordion");
  const toolsContainer = document.getElementById("toolsContainer");

  // --- 7) Transformer le menu YAML Quarto en accordéons
  collapse?.querySelectorAll("li.nav-item, li.dropdown").forEach((item, index) => {

    const link = item.querySelector("a.nav-link, a.dropdown-toggle");
    const submenu = item.querySelector("ul.dropdown-menu");
    const title = link ? link.textContent.trim() : "Menu";

    if (submenu) {
      const id = "acc" + index;

      const accItem = document.createElement("div");
      accItem.className = "accordion-item";
      accItem.innerHTML = `
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#${id}">
            ${title}
          </button>
        </h2>
        <div id="${id}" class="accordion-collapse collapse">
          <div class="accordion-body"></div>
        </div>
      `;

      const body = accItem.querySelector(".accordion-body");

      submenu.querySelectorAll("a.dropdown-item").forEach(sub => {
        const linkEl = document.createElement("a");
        linkEl.href = sub.href;
        linkEl.textContent = sub.textContent.trim();
        linkEl.className = "d-block mb-2";
        body.appendChild(linkEl);
      });

      accordion.appendChild(accItem);

    } else {
      const linkEl = document.createElement("a");
      linkEl.href = link.href;
      linkEl.textContent = title;
      linkEl.className = "d-block mb-3";
      accordion.appendChild(linkEl);
    }
  });

  // --- 8) Ajouter les outils Quarto en bas du panneau
  if (tools) {
    const clonedTools = tools.cloneNode(true);
    clonedTools.style.marginTop = "10px";
    toolsContainer.appendChild(clonedTools);
  }

  // --- 9) Action du bouton Menu
  menuButton.onclick = () => {
    const isOpen = sideMenu.style.transform === "translateX(0%)";
    sideMenu.style.transform = isOpen ? "translateX(-100%)" : "translateX(0%)";
  };

});