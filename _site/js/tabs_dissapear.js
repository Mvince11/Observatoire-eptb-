function initRightTabs() {
  const rightTabs = window.rightTabs;
  const rightPanel = window.rightPanel;
  const rightTabsToggle = window.rightTabsToggle;

  if (!rightTabs || !rightPanel || !rightTabsToggle) {
    setTimeout(initRightTabs, 100);
    return;
  }

  let activeTool = null;

  // --- Clic sur un bouton de la barre ---
  document.querySelectorAll("#rightTabs .tool-btn").forEach(btn => {
    btn.onclick = () => {

      const tool = btn.dataset.tool;

      // Activer visuellement
      document.querySelectorAll("#rightTabs .tool-btn")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      activeTool = tool;

      // --- Masquer la barre ---
      rightTabs.style.display = "none";

      // --- Afficher le panneau ---
      rightPanel.style.display = "block";

      // --- Construire le panneau ---
      let titre = "";
      if (tool === "layers") titre = "Couches";
      if (tool === "fond") titre = "Fonds de cartes";
      if (tool === "legend") titre = "Légendes";
      if (tool === "dessin") titre = "Dessin";

      rightPanel.innerHTML = `
        <div style="display:flex; justify-content:flex-end;">
          <button id="closeRightPanel" style="
            background:none;
            border:none;
            font-size:22px;
            cursor:pointer;
            color:#444;
          ">&times;</button>
        </div>
        <h3>${titre}</h3>
        <div id="panelContent"></div>
      `;

      const content = document.getElementById("panelContent");

      // --- Injecter le contenu selon l’outil ---
      if (tool === "layers") {
        content.appendChild(window.layersListDiv);
      }

      if (tool === "fond") {
        content.appendChild(window.fondListDiv);
      }

      if (tool === "legend") {
      rightPanel.innerHTML = `
        <div style="display:flex; justify-content:flex-end;">
          <button id="closeRightPanel" style="
            background:none;
            border:none;
            font-size:22px;
            cursor:pointer;
            color:#444;
          ">&times;</button>
        </div>
        <h3>Légende</h3>
        <div id="panelContent"></div>
      `;
    
      const content = document.getElementById("panelContent");
    
      // Injecter ta légende
      content.appendChild(window.legendDiv);

  // Bouton de fermeture
  document.getElementById("closeRightPanel").onclick = () => {
    rightPanel.style.display = "none";
    rightTabs.style.display = "flex";
    activeTool = null;
  };
}


      if (tool === "dessin") {
        content.innerHTML += `<p>(Outils de dessin à intégrer)</p>`;
      }

      // --- Bouton de fermeture ---
      document.getElementById("closeRightPanel").onclick = () => {
        rightPanel.style.display = "none";
        rightTabs.style.display = "flex";
        activeTool = null;
      };
    };
  });

  // --- Toggle pour réafficher la barre ---
  rightTabsToggle.onclick = () => {
    rightTabs.style.display = "flex";
    rightPanel.style.display = "none";
    activeTool = null;
  };
}

initRightTabs();


function initHoverLabels() {
  const rightTabs = window.rightTabs;
  if (!rightTabs) {
    setTimeout(initHoverLabels, 100);
    return;
  }

  const hoverLabel = document.createElement("div");
  hoverLabel.className = "rightTabs-label";
  document.body.appendChild(hoverLabel);

  function attachHoverEvents() {
    document.querySelectorAll("#rightTabs .tool-btn").forEach(btn => {

      btn.addEventListener("mouseenter", () => {
        const tool = btn.dataset.tool;

        const labels = {
          layers: "Couches",
          fond: "Fond de cartes",
          dessin: "Dessin",
          legend: "Légendes"
        };

        hoverLabel.textContent = labels[tool] || "";

        const rect = btn.getBoundingClientRect();
        hoverLabel.style.top = rect.top + "px";
        
        // Position horizontale : à gauche du bouton
        const labelWidth = hoverLabel.offsetWidth;
        hoverLabel.style.left = (rect.left - labelWidth - 10) + "px";
      
        hoverLabel.style.opacity = 1;
      });

      btn.addEventListener("mouseleave", () => {
        hoverLabel.style.opacity = 0;
      });
    });
  }

  // Attacher les événements au chargement
  attachHoverEvents();

  // Réattacher quand rightTabs réapparaît
  const observer = new MutationObserver(() => {
    if (rightTabs.style.display !== "none") {
      attachHoverEvents();
    }
  });

  observer.observe(rightTabs, { attributes: true, attributeFilter: ["style"] });
}

initHoverLabels();
