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

      // --- Classe par défaut ---
      rightPanel.className = "rightpanel-default";

      // --- Construire le panneau ---
      let titre = "";
      if (tool === "layers") titre = "Couches";
      if (tool === "fond") titre = "Fonds de cartes";
      if (tool === "legend") titre = "Légendes";
      if (tool === "dessin") titre = "Dessin";
      if (tool === "donnees") titre = "Données de la commune";
      if (tool === "tableau") titre = "Tableau de données";
      if (tool === "batiment3d") titre = "Bâtiments 3D: Mode d'emploi";
      if (tool ==="infoindicateur") titre ="Informations relatives à l'indicateur";

      rightPanel.innerHTML = `
        <div style="display:flex; justify-content:flex-end;">
          <button id="closeRightPanel" class="close-btn">&times;</button>
        </div>
        <h3>${titre}</h3>
        <div id="panelContent"></div>
      `;

      const content = document.getElementById("panelContent");

      // --- ROUTAGE PROPRE PAR OUTIL ---

      // COUCHES
      if (tool === "layers") {
        rightPanel.className = "rightpanel-large";
        content.appendChild(window.layersListDiv);
      }

      // FONDS
      if (tool === "fond") {
        rightPanel.className = "rightpanel-large";
        content.appendChild(window.fondListDiv);
      }

      // LÉGENDE
      if (tool === "legend") {
        rightPanel.className = "rightpanel-large";
        content.appendChild(window.legendDiv);
      }

      // DONNÉES DE LA COMMUNE (tab4)
      if (tool === "donnees") {
        rightPanel.className = "rightpanel-large";
        const title = rightPanel.querySelector("h3");
        if (title) title.style.display = "none";

        const quartoTabs = document.querySelectorAll("#tab4");
        donneesDiv.innerHTML = "";

        quartoTabs.forEach(tab => {
          const clone = tab.cloneNode(true);
          clone.style.display = "block";
          donneesDiv.appendChild(clone);
        });

        content.appendChild(donneesDiv);
      }

      // TABLEAU DE DONNÉES (tab5)
      if (tool === "tableau") {
      rightPanel.className = "rightpanel-full2";
    
      const title = rightPanel.querySelector("h3");
      if (title) title.style.display = "none";
    
      const iframe = document.createElement("iframe");
      iframe.src = "tableau_commune.html";
      iframe.style.width = "100%";
      iframe.style.height = "calc(100vh - 120px)";   // hauteur dynamique
      iframe.style.border = "none";
      iframe.style.display = "block";
    
      content.innerHTML = "";
      content.appendChild(iframe);
    }
    
      if (tool === "batiment3d") {
        rightPanel.className = "rightpanel-full2";
        
        const title = rightPanel.querySelector("h3");
      if (title) title.style.display = "none";
    
        const bloc = document.querySelector("#batiment3d-info");

        const clone = bloc.cloneNode(true);
        clone.style.display = "block";
      
        content.appendChild(clone);
      }

      if (tool === "infoindicateur") {
      rightPanel.className = "rightpanel-full2";
    
      const title = rightPanel.querySelector("h3");
      if (title) title.style.display = "none";
    
      const tables = document.querySelectorAll(".info_indicateur");
    
      content.innerHTML = ""; // vider le panneau
    
      tables.forEach(tbl => {
        const clone = tbl.cloneNode(true);
        //clone.style.display = "block";
        content.appendChild(clone);
      });
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

// Supprimer les onglets Quarto du haut
const tabset = document.querySelector(".tabset");
if (tabset) tabset.remove();




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
        fond: "Fonds de carte",
        donnees: "Données de la commune",
        legend: "Légendes",
        tableau: "Tableau de données", 
        batiment3d: "Bâtiments 3D: Mode d'emploi",
        infoindicateur: "Informations relatives à l'indicateur"
      };
    
      hoverLabel.textContent = labels[tool] || "";
    
      const rect = btn.getBoundingClientRect();
    
      // 1️⃣ rendre visible AVANT de mesurer
      hoverLabel.style.opacity = 0;
      hoverLabel.style.display = "block";
    
      // 2️⃣ mesurer la largeur réelle
      const labelWidth = hoverLabel.offsetWidth;
    
      // 3️⃣ position verticale : alignée avec le bouton
      hoverLabel.style.top = rect.top + "px";
    
      // 4️⃣ position horizontale : à gauche du bouton (IGN style)
      hoverLabel.style.left = (rect.left - labelWidth - 10) + "px";
    
      // 5️⃣ afficher
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
