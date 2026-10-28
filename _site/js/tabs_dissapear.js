function siteBase() {
  if (window.SITE_BASE !== undefined) {
    return window.SITE_BASE;
  }

  const meta = document.querySelector('meta[name="quarto:offset"]');
  if (meta && meta.content) {
    return meta.content;
  }

  return "./";
}


function initRightTabs() {
  const rightTabs = window.rightTabs;
  const rightPanel = window.rightPanel;
  const rightTabsToggle = window.rightTabsToggle;

  if (!rightTabs || !rightPanel || !rightTabsToggle) {
    setTimeout(initRightTabs, 100);
    return;
  }

  let activeTool = null;

  // ===================================================
  // COUCHES PILOTÉES PAR LE BOUTON "indicateur"
  // Toutes ces couches sont affichées / masquées ensemble.
  // Pour en ajouter une : l'ajouter simplement à cette liste.
  // ===================================================
  const INDICATEUR_LAYERS = [
    "indicateurs12aLayer",
    "indicateurs110bLayer",
    "indicateurs31aLayer",
    "indicateurs31jLayer",
    "indicateurs33Layer"
  ];

  // ===================================================
  // OUTILS "DOCKÉS" : le panneau s'ouvre à gauche de la
  // barre, qui reste visible
  // ===================================================
  const DOCKED_TOOLS = ["layers"];

  function dockPanel() {
    const r = rightTabs.getBoundingClientRect();
    const set = (p, v) => rightPanel.style.setProperty(p, v, "important");

    set("position", "fixed");
    set("top", r.top + "px");                                          // même haut que rightTabs
    set("right", (document.documentElement.clientWidth - r.left) + "px"); // collé contre rightTabs
    set("left", "auto");
    set("height", `calc(100vh - ${r.top}px - 20px)`);
    rightPanel.dataset.docked = "1";
  }

  function ouvrirModalIndicateur(btn) {

    // Callouts d'origine (on supprime d'abord une éventuelle modale ouverte,
    // pour ne pas cloner ses propres clones)
    const ancienne = document.getElementById("indicateurDialog");
    if (ancienne) ancienne.remove();

    const callouts = document.querySelectorAll(".callout.info_indicateur");
    console.log("Nombre de callouts .info_indicateur :", callouts.length);

    const dlg = document.createElement("dialog");
    dlg.id = "indicateurDialog";
    dlg.className = "indicateur-dialog";

    dlg.innerHTML = `
      <div class="indicateur-dialog-header">
        <h2>Informations relatives à l'indicateur</h2>
        <button type="button" class="dialog-close-btn" aria-label="Fermer">
          <i class="bi bi-x-lg"></i>
          <span>Fermer</span>
        </button>
      </div>
      <div class="indicateur-dialog-body"></div>
    `;

    const body = dlg.querySelector(".indicateur-dialog-body");

    if (callouts.length === 0) {
      body.innerHTML = "<p style='color:red;'>Aucun callout trouvé.</p>";
    }

    callouts.forEach((original, index) => {
      const clone = original.cloneNode(true);

      const header = clone.querySelector(".callout-header");
      const collapseEl = clone.querySelector(".callout-collapse");

      // Callout repliable : id unique + bandeau réorienté vers cet id
      if (header && collapseEl) {
        const uid = `callout-clone-${Date.now()}-${index}`;
        collapseEl.id = uid;
        header.setAttribute("data-bs-target", `#${uid}`);
        header.setAttribute("aria-controls", uid);
      }

      clone.style.width = "100%";
      clone.style.margin = "0 0 16px 0";

      body.appendChild(clone);
    });

    // Fermeture : bouton, clic sur le fond assombri, touche Échap (native)
    dlg.querySelector(".dialog-close-btn").onclick = () => dlg.close();
    dlg.addEventListener("click", e => {
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", () => {
      btn.classList.remove("active");
      dlg.remove();
    });

    document.body.appendChild(dlg);
    btn.classList.add("active");
    dlg.showModal();
  }

  function ouvrirModalDonnees(btn) {
    const ancienne = document.getElementById("donneesDialog");
    if (ancienne) ancienne.remove();

    const dlg = document.createElement("dialog");
    dlg.id = "donneesDialog";
    dlg.className = "indicateur-dialog donnees-dialog";

    dlg.innerHTML = `
      <div class="indicateur-dialog-header">
        <h2>Données de la commune</h2>
        <button type="button" class="dialog-close-btn" aria-label="Fermer">
          <i class="bi bi-x-lg"></i>
          <span>Fermer</span>
        </button>
      </div>

      <div class="data-switch">
        <button type="button" class="data-switch-btn active" data-vue="tableau">
          <i class="bi bi-table"></i> Tableau
        </button>
        <button type="button" class="data-switch-btn" data-vue="graphique">
          <i class="bi bi-bar-chart"></i> Graphique
        </button>
      </div>

      <div class="donnees-dialog-body"></div>
    `;

    const dataContent = dlg.querySelector(".donnees-dialog-body");
    const btnTableau = dlg.querySelector('[data-vue="tableau"]');
    const btnGraphique = dlg.querySelector('[data-vue="graphique"]');

    function afficherTableau() {
      dataContent.innerHTML = "";

      const iframe = document.createElement("iframe");
      iframe.src = new URL("tableau_commune.html", window.location.href).href;

      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";

      console.log("URL du tableau :", iframe.src);

      dataContent.appendChild(iframe);
    }

    function afficherGraphique() {
      dataContent.innerHTML = "";
      const cfg = window.GRAPHIQUE;

      if (!cfg) {
        dataContent.innerHTML = "<p>Aucune donnée de graphique définie pour cette page.</p>";
        return;
      }
      if (typeof window.graphiqueBarres !== "function") {
        dataContent.innerHTML = "<p>Le graphique est en cours de chargement, réessayez dans un instant.</p>";
        return;
      }

      fetch(cfg.url)
        .then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status} sur ${cfg.url}`);
          return r.json();
        })
        .then(data => {
          window.graphiqueBarres(dataContent, data, cfg.options);
          // Force le recalcul de la taille du graphique dans la modale
          requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
        })
        .catch(err => {
          console.error("Erreur chargement données graphique :", err);
          dataContent.innerHTML = "<p>Impossible de charger les données du graphique.</p>";
        });
    }

    btnTableau.onclick = () => {
      btnTableau.classList.add("active");
      btnGraphique.classList.remove("active");
      afficherTableau();
    };
    btnGraphique.onclick = () => {
      btnGraphique.classList.add("active");
      btnTableau.classList.remove("active");
      afficherGraphique();
    };

    // Fermeture : bouton, clic sur le fond assombri, touche Échap (native)
    dlg.querySelector(".dialog-close-btn").onclick = () => dlg.close();
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", () => {
      btn.classList.remove("active");
      dlg.remove();
    });

    document.body.appendChild(dlg);
    btn.classList.add("active");
    dlg.showModal();
    afficherTableau();
  }

  function ouvrirModalCouches(btn) {
    const ancienne = document.getElementById("couchesDialog");
    if (ancienne) ancienne.remove();

    const dlg = document.createElement("dialog");
    dlg.id = "couchesDialog";
    dlg.className = "indicateur-dialog couches-dialog";

    dlg.innerHTML = `
      <div class="indicateur-dialog-header">
        <h2>Couches</h2>
        <button type="button" class="dialog-close-btn" aria-label="Fermer">
          <i class="bi bi-x-lg"></i>
          <span>Fermer</span>
        </button>
      </div>
      <div class="couches-dialog-body"></div>
    `;

    const body = dlg.querySelector(".couches-dialog-body");

    if (window.layersListDiv) {
      body.appendChild(window.layersListDiv);   // déplacé, pas cloné : les écouteurs sont conservés
    } else {
      body.innerHTML = "<p>La liste des couches n'est pas disponible.</p>";
    }

    // Fermeture : bouton, clic sur le fond, touche Échap (native)
    dlg.querySelector(".dialog-close-btn").onclick = () => dlg.close();
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", () => {
      btn.classList.remove("active");
      dlg.remove();   // window.layersListDiv reste référencé et sera redéplacé à la prochaine ouverture
    });

    document.body.appendChild(dlg);
    btn.classList.add("active");
    dlg.showModal();
  }


  function undockPanel() {
    ["position", "top", "right", "left", "height"]
      .forEach(p => rightPanel.style.removeProperty(p));
    delete rightPanel.dataset.docked;
  }

  function fermerPanneau() {
    rightPanel.style.display = "none";
    undockPanel();
    rightTabs.style.display = "flex";   // la barre reste visible
    panelButtons().forEach(b => b.classList.remove("active"));
    activeTool = null;
  }

  window.addEventListener("resize", () => {
    if (rightPanel.dataset.docked === "1" && rightPanel.style.display !== "none") {
      dockPanel();
    }
  });

  // Boutons d'outils hors couche "indicateur" (qui est un simple interrupteur)
  const panelButtons = () =>
    document.querySelectorAll("#rightTabs .tool-btn:not([data-tool='indicateur'])");

  // ===================================================
  // CLIC SUR UN BOUTON DE LA BARRE
  // ===================================================
  document.querySelectorAll("#rightTabs .tool-btn").forEach(btn => {
    btn.onclick = () => {

      const tool = btn.dataset.tool;

      // -------------------------------------------------
      // COUCHES INDICATEUR (affiche/masque les couches carte)
      // -------------------------------------------------
      if (tool === "indicateur") {

        console.log("Clic sur indicateur");

        const mapLibre = window.map;

        if (!mapLibre || typeof mapLibre.setLayoutProperty !== "function") {
          console.error("Carte MapLibre introuvable :", mapLibre);
          return;
        }

        // On ne garde que les couches réellement présentes sur la carte
        const layers = INDICATEUR_LAYERS.filter(id => {
          const existe = !!mapLibre.getLayer(id);
          if (!existe) console.warn("Couche introuvable :", id);
          return existe;
        });

        if (layers.length === 0) {
          console.error("Aucune couche indicateur trouvée parmi :", INDICATEUR_LAYERS);
          return;
        }

        // La visibilité de la première couche sert de référence
        const currentVisibility =
          mapLibre.getLayoutProperty(layers[0], "visibility");

        console.log("Visibilité actuelle :", currentVisibility);

        const newVisibility =
          currentVisibility === "none" ? "visible" : "none";

        // Même état appliqué à toutes les couches
        layers.forEach(id => {
          mapLibre.setLayoutProperty(id, "visibility", newVisibility);
        });

        // Afficher le titre uniquement si l'indicateur est visible
        if (typeof window.afficherTitre === "function") {
          window.afficherTitre(newVisibility === "visible");
        }

        console.log("Nouvelle visibilité :", newVisibility);

        btn.classList.toggle("active", newVisibility === "visible");

        return;
      }

      // -------------------------------------------------
      // OUTILS AFFICHÉS DANS UNE MODALE
      // -------------------------------------------------
      const MODALES = {
        infoindicateur: ouvrirModalIndicateur,
        donneesgraphique: ouvrirModalDonnees,
        layers: ouvrirModalCouches
      };

      if (MODALES[tool]) {
        fermerPanneau();
        MODALES[tool](btn);
        return;
      }

      // -------------------------------------------------
      // AUTRES OUTILS
      // -------------------------------------------------
      panelButtons().forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      activeTool = tool;

      const docked = DOCKED_TOOLS.includes(tool);

      // Barre masquée, sauf pour les outils docked
      if (!docked) rightTabs.style.display = "none";

      // Panneau : état propre
      undockPanel();
      rightPanel.style.display = "block";
      rightPanel.className = "rightpanel-default";

      // Titre
      let titre = "";
      //if (tool === "layers") titre = "Couches";
      if (tool === "donneesgraphique") titre = "Données de la commune";
      if (tool === "infoindicateur") titre = "Informations relatives à l'indicateur";

      rightPanel.innerHTML = `
        <div style="display:flex; justify-content:flex-end;">
          <button id="closeRightPanel" class="close-btn" aria-label="Fermer">
            <i class="bi bi-x-lg"></i>
            <span>Fermer</span>
          </button>
        </div>
        ${titre ? `<h3>${titre}</h3>` : ""}
        <div id="panelContent"></div>
      `;

      const content = document.getElementById("panelContent");

      // Bouton de fermeture (défini tout de suite : un return plus bas ne le casse pas)
      document.getElementById("closeRightPanel").onclick = () => {
        rightPanel.style.display = "none";
        undockPanel();
        rightTabs.style.display = "flex";
        panelButtons().forEach(b => b.classList.remove("active"));
        activeTool = null;
      };


      // -------------------------------------------------
      // COUCHES
      // -------------------------------------------------
      if (tool === "layers") {
        rightPanel.className = "rightpanel-large";
        content.appendChild(window.layersListDiv);
        //dockPanel();
      }
    };
  });

  // ===================================================
  // TOGGLE POUR RÉAFFICHER LA BARRE
  // ===================================================
  rightTabsToggle.onclick = () => {
    rightTabs.style.display = "flex";
    rightPanel.style.display = "none";
    undockPanel();
    activeTool = null;
  };
}

initRightTabs();

// Supprimer les onglets Quarto du haut
const tabset = document.querySelector(".tabset");
if (tabset) tabset.remove();


// =======================================================
// ÉTIQUETTES AU SURVOL
// =======================================================
function initHoverLabels() {
  const rightTabs = window.rightTabs;
  if (!rightTabs) {
    setTimeout(initHoverLabels, 100);
    return;
  }

  const hoverLabel = document.createElement("div");
  hoverLabel.className = "rightTabs-label";
  document.body.appendChild(hoverLabel);

  const labels = {
    layers: "Couches",
    indicateur: "Couche Indicateur",
    donneesgraphique: "Data",
    infoindicateur: "Informations relatives à l'indicateur"
  };

  function attachHoverEvents() {
    document.querySelectorAll("#rightTabs .tool-btn").forEach(btn => {

      // Évite d'empiler les écouteurs à chaque réaffichage de la barre
      if (btn.dataset.hoverBound === "1") return;
      btn.dataset.hoverBound = "1";

      btn.addEventListener("mouseenter", () => {
        const tool = btn.dataset.tool;

        hoverLabel.textContent = labels[tool] || "";

        const rect = btn.getBoundingClientRect();

        // Rendre visible AVANT de mesurer
        hoverLabel.style.opacity = 0;
        hoverLabel.style.display = "block";

        const labelWidth = hoverLabel.offsetWidth;

        // Aligné avec le bouton, à gauche de celui-ci
        hoverLabel.style.top = rect.top + "px";
        hoverLabel.style.left = (rect.left - labelWidth - 10) + "px";

        hoverLabel.style.opacity = 1;
      });

      btn.addEventListener("mouseleave", () => {
        hoverLabel.style.opacity = 0;
      });
    });
  }

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