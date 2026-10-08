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
      
      
     if (tool === "indicateur") {

        console.log("Clic sur indicateur");
      
        const mapLibre = window.map;
      
        if (!mapLibre || typeof mapLibre.setLayoutProperty !== "function") {
          console.error("Carte MapLibre introuvable :", mapLibre);
          return;
        }
    
        const currentVisibility =
          mapLibre.getLayoutProperty(
            "indicateurs12aLayer",
            "visibility"
          );
      
        console.log("Visibilité actuelle :", currentVisibility);
      
        const newVisibility =
          currentVisibility === "none"
            ? "visible"
            : "none";
      
        mapLibre.setLayoutProperty(
          "indicateurs12aLayer",
          "visibility",
          newVisibility
        );
        
         // Afficher le titre uniquement si l'indicateur est visible
          if (typeof window.afficherTitre === "function") {
            window.afficherTitre(newVisibility === "visible");
          }

      
        console.log("Nouvelle visibilité :", newVisibility);
      
        btn.classList.toggle(
          "active",
          newVisibility === "visible"
        );
      
        return;
      }
      
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
      if (tool === "donneesgraphique") titre = "Données de la commune";
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


      // TABLEAU DE DONNÉES (tab5)
      // =====================================================
      // TABLEAU / GRAPHIQUE
      // =====================================================

      if (tool === "donneesgraphique") {
      
        rightPanel.className = "rightpanel-full2";
      
        const title = rightPanel.querySelector("h3");
        if (title) title.style.display = "none";
      
        content.innerHTML = "";
      
        // ---------------------------------------------------
        // SWITCH TABLEAU / GRAPHIQUE
        // ---------------------------------------------------
      
        const switchContainer = document.createElement("div");
        switchContainer.className = "data-switch";
      
        switchContainer.innerHTML = `
          <button id="btnTableau" class="data-switch-btn active">
            <i class="bi bi-table"></i>
            Tableau
          </button>
      
          <button id="btnGraphique" class="data-switch-btn">
            <i class="bi bi-bar-chart"></i>
            Graphique
          </button>
        `;
      
        content.appendChild(switchContainer);
      
      
        // ---------------------------------------------------
        // CONTENEUR DU CONTENU
        // ---------------------------------------------------
      
        const dataContent = document.createElement("div");
        dataContent.id = "dataContent";
      
        content.appendChild(dataContent);
      
      
        // ---------------------------------------------------
        // FONCTION TABLEAU
        // ---------------------------------------------------
      
        function afficherTableau() {
      
          dataContent.innerHTML = "";
      
          const iframe = document.createElement("iframe");
      
          iframe.src = "tableau_commune.html";
          iframe.style.width = "100%";
          iframe.style.height = "calc(100vh - 170px)";
          iframe.style.border = "none";
          iframe.style.display = "block";
      
          dataContent.appendChild(iframe);
        }
      
      
        // ---------------------------------------------------
        // FONCTION GRAPHIQUE
        // ---------------------------------------------------
      
          function afficherGraphique() {
            dataContent.innerHTML = '';
            const cfg = window.GRAPHIQUE;
          
            if (!cfg) {
              dataContent.innerHTML = '<p>Aucune donnée de graphique définie pour cette page.</p>';
              return;
            }
            if (typeof window.graphiqueBarres !== 'function') {
              dataContent.innerHTML = '<p>Le graphique est en cours de chargement, réessayez dans un instant.</p>';
              return;
            }
          
            fetch(cfg.url)
              .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status} sur ${cfg.url}`);
                return r.json();
              })
              .then(data => window.graphiqueBarres(dataContent, data, cfg.options))
              .catch(err => {
                console.error('Erreur chargement données graphique :', err);
                dataContent.innerHTML = '<p>Impossible de charger les données du graphique.</p>';
              });
          }


          // ---------------------------------------------------
          // GESTION DU SWITCH
          // ---------------------------------------------------
        
          const btnTableau =
            switchContainer.querySelector("#btnTableau");
        
          const btnGraphique =
            switchContainer.querySelector("#btnGraphique");
        
        
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
        
        
          // ---------------------------------------------------
          // AFFICHAGE INITIAL
          // ---------------------------------------------------
        
          afficherTableau();
        }
        
        
          if (tool === "infoindicateur") {

            rightPanel.className = "rightpanel-full2";
          
            const title = rightPanel.querySelector("h3");
            if (title) title.style.display = "none";
          
            content.innerHTML = "";
          
            // ---------------------------------------------------
            // BLOC "PLUS D'INFORMATIONS"
            // ---------------------------------------------------
          
            const bloc = document.querySelector("#collapse_indicateur");
          
            console.log("bloc collapse_indicateur :", bloc);
          
            // ---------------------------------------------------
            // TABLEAUX
            // ---------------------------------------------------
          
            const tables = document.querySelectorAll(".info_indicateur");
          
            console.log(
              "Nombre de tableaux .info_indicateur :",
              tables.length
            );
          
            if (!bloc && tables.length === 0) {
          
              content.innerHTML =
                "<p style='color:red;'>Aucun bloc ni tableau trouvé.</p>";
          
              return;
            }
          
          
            // ===================================================
            // CLONAGE DU BLOC DÉPLIABLE
            // ===================================================
          
            if (bloc) {

                // =================================================
                // CRÉATION D'UN NOUVEAU BLOC INDÉPENDANT
                // =================================================
              
                const blocInfo = document.createElement("div");
              
                blocInfo.className = "collapse-box";
                blocInfo.style.display = "block";
                blocInfo.style.width = "95%";
                blocInfo.style.height = "auto";
                blocInfo.style.maxHeight = "none";
                blocInfo.style.overflow = "visible";
              
              
                // -------------------------------------------------
                // TITRE
                // -------------------------------------------------
              
                const titreInfo = document.createElement("h1");
              
                titreInfo.innerHTML =
                  "Nombre de personnes occupant des bâtiments de plain-pied fortement inondables";
              
                titreInfo.style.color = "orangered";
                titreInfo.style.fontSize = "1.5rem";
                titreInfo.style.margin = "20px";
                titreInfo.style.fontFamily = "avenir";
                titreInfo.style.opacity = "0.7";
              
              
                // -------------------------------------------------
                // HEADER CLIQUABLE
                // -------------------------------------------------
              
                const header = document.createElement("div");
              
                header.className = "collapse-header";
              
                header.innerHTML = `
                  <span>Plus d'informations concernant cet indicateur</span>
              
                  <svg class="collapse-arrow"
                       viewBox="0 0 24 24">
                    <path
                      d="M8 5l8 7-8 7"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
                  </svg>
                `;
              
                header.style.cursor = "pointer";
              
              
                // -------------------------------------------------
                // CONTENU
                // -------------------------------------------------
              
                const collapseContent =
                  document.createElement("div");
              
                collapseContent.className =
                  "collapse-content";
              
                collapseContent.style.display = "none";
                collapseContent.style.width = "100%";
                collapseContent.style.height = "auto";
                collapseContent.style.maxHeight = "none";
                collapseContent.style.overflow = "visible";
                collapseContent.style.paddingBottom = "15px";
              
              
                // -------------------------------------------------
                // RÉCUPÉRATION DU CONTENU ORIGINAL
                // -------------------------------------------------
              
                const originalContent =
                  bloc.querySelector(".collapse-content");
              
                if (originalContent) {
              
                  // On récupère uniquement le contenu intérieur
                  collapseContent.innerHTML =
                    originalContent.innerHTML;
              
                }
              
              
                // -------------------------------------------------
                // CONSTRUCTION
                // -------------------------------------------------
              
                blocInfo.appendChild(titreInfo);
                blocInfo.appendChild(header);
                blocInfo.appendChild(collapseContent);
              
                content.appendChild(blocInfo);
              
              
                // -------------------------------------------------
                // GESTION DE LA FLÈCHE
                // -------------------------------------------------
              
                const arrow =
                  header.querySelector(".collapse-arrow");
              
              
                header.addEventListener("click", function () {
              
                  const ouvert =
                    collapseContent.style.display !== "none";
              
              
                  if (ouvert) {
              
                    // FERMETURE
                    collapseContent.style.display = "none";
              
                    if (arrow) {
                      arrow.style.transform = "rotate(0deg)";
                    }
              
                  } else {
              
                    // OUVERTURE
                    collapseContent.style.display = "block";
              
                    if (arrow) {
                      arrow.style.transform = "rotate(90deg)";
                    }
              
                  }
              
                });
              
              }
          
          
            // ===================================================
            // AJOUT DES 3 TABLEAUX
            // ===================================================
          
            tables.forEach((tbl, index) => {
          
              console.log(
                "Ajout du tableau",
                index + 1
              );
          
              const cloneTable =
                tbl.cloneNode(true);
          
              cloneTable.style.display = "table";
              cloneTable.style.width = "90%";
              cloneTable.style.margin =
                "0 auto 20px auto";
          
              content.appendChild(cloneTable);
          
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
        indicateur: "Couche Indicateur",
        //donnees: "Données de la commune",
        donneesgraphique: "Data",
        infoindicateur: "Informations relatives à l'indicateur"
        //legend: "Légendes",
        //tableau: "Tableau de données", 
        //batiment3d: "Bâtiments 3D: Mode d'emploi",
        //graphique: "Graphiques"
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
