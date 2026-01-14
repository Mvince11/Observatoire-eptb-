document.addEventListener("DOMContentLoaded", function () {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.getElementById("navbarCollapse");
    const navbarNav = document.querySelector(".navbar-nav");

    function adjustMenu() {
        if (window.innerWidth >= 992 && window.innerWidth <= 1360) {
            let clonedContainer = document.getElementById("cloned-items");
            
            if (!clonedContainer) {
                clonedContainer = document.createElement("ul");
                clonedContainer.id = "cloned-items";
                clonedContainer.classList.add("navbar-nav");
                
                document.querySelectorAll(".nav-item:nth-child(3), .nav-item:nth-child(4)").forEach(item => {
                    let clonedItem = item.cloneNode(true);
                    clonedContainer.appendChild(clonedItem);
                });

                navbarCollapse.appendChild(clonedContainer);
            }
        } else {
            const clonedItems = document.getElementById("cloned-items");
            if (clonedItems) {
                clonedItems.remove(); // Nettoyage quand la résolution change
            }
        }
    }

    window.addEventListener("resize", adjustMenu);
    adjustMenu(); // Exécuter au chargement
});






