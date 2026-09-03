function initRightTabs() {
  const rightTabs = window.rightTabs;
  const rightPanel = window.rightPanel;
  const rightTabsToggle = window.rightTabsToggle;

  if (!rightTabs || !rightPanel || !rightTabsToggle) {
    setTimeout(initRightTabs, 100);
    return;
  }

  let isCollapsed = false;

  // --- Rétraction / déploiement ---
  rightTabsToggle.onclick = () => {
    isCollapsed = !isCollapsed;

    if (isCollapsed) {
      rightTabs.style.display = "none";
      rightPanel.style.display = "none";
      rightTabsToggle.innerHTML = `<i class="bi bi-chevron-left" style="font-size:18px; color:#2A3B4D;"></i>`;
    } else {
      rightTabs.style.display = "flex";
      rightTabsToggle.innerHTML = `<i class="bi bi-chevron-right" style="font-size:18px; color:#2A3B4D;"></i>`;
    }
  };

    // --- Label flottant au survol façon Géoportail ---
  const hoverLabel = document.createElement("div");
  hoverLabel.className = "rightTabs-label";
  document.body.appendChild(hoverLabel);
  
  document.querySelectorAll("#rightTabs .tool-btn").forEach(btn => {
  
    btn.addEventListener("mouseenter", () => {
      const tool = btn.dataset.tool;
  
      const labels = {
        layers: "Couches",
        fond: "Fonds de cartes",
        mesures: "Mesures",
        dessin: "Dessin"
      };
  
      hoverLabel.textContent = labels[tool] || "";
      
      const rect = btn.getBoundingClientRect();
      hoverLabel.style.top = rect.top + "px";
      hoverLabel.style.opacity = 1;
    });
  
    btn.addEventListener("mouseleave", () => {
      hoverLabel.style.opacity = 0;
    });
  });


  // --- Activation des onglets ---
  document.querySelectorAll("#rightTabs .tool-btn").forEach(btn => {
    btn.onclick = () => {

      // Si la barre est rétractée → la déployer
      if (isCollapsed) {
        isCollapsed = false;
        rightTabs.style.display = "flex";
        rightTabsToggle.innerHTML = `<i class="bi bi-chevron-right" style="font-size:18px; color:#2A3B4D;"></i>`;
      }

      // Activer visuellement
      document.querySelectorAll("#rightTabs .tool-btn")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tool = btn.dataset.tool;

      // Afficher le panneau
      rightPanel.style.display = "block";

      if (tool === "layers") {
      rightPanel.innerHTML = `
        <h3 style="margin-bottom:10px;">Couches</h3>
        <div id="layersListContainer"></div>
      `;
    
      const container = document.getElementById("layersListContainer");
    
      // Réinjecter la liste des couches
      container.appendChild(window.layersListDiv);
    
      // Toujours visible
      window.layersListDiv.style.display = "block";
    }

      if (tool === "fond") {
      rightPanel.innerHTML = `
        <h3 style="margin-bottom:10px;">Fonds de cartes</h3>
        <div id="fondContainer" style="display:flex; justify-content:center;"></div>
      `;
    
      const container = document.getElementById("fondContainer");
    
      // Réinjecter les vignettes
      container.appendChild(window.fondListDiv);
    
      window.fondListDiv.style.display = "flex";
    }



      if (tool === "mesures") {
        rightPanel.innerHTML = `
          <h3>Mesures</h3>
          <p>(Outils de mesure à intégrer)</p>
        `;
      }

      if (tool === "dessin") {
        rightPanel.innerHTML = `
          <h3>Dessin</h3>
          <p>(Outils de dessin à intégrer)</p>
        `;
      }
    };
  });
}

initRightTabs();
