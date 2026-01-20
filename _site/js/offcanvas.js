document.addEventListener('DOMContentLoaded', function () {
  // Trouve le collapse généré par Quarto
  const collapse =
    document.getElementById('quarto-navbar-collapse') ||
    document.getElementById('navbarCollapse');

  const toggler = document.querySelector('.navbar-toggler');
  if (!collapse || !toggler) return;

  // Crée le conteneur offcanvas
  const offcanvas = document.createElement('div');
  offcanvas.className = 'offcanvas offcanvas-start site-offcanvas';
  offcanvas.id = 'site-offcanvas';
  offcanvas.setAttribute('tabindex', '-1');

  // Header avec logo + bouton de fermeture
  const header = document.createElement('div');
  header.className = 'offcanvas-header';

  const img = document.createElement('img');
  img.src = 'Images/logo_porteurs_projet_anc.png';
  img.alt = 'Logo';
  img.style.maxHeight = '84px';
  img.style.objectFit = 'contain';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn-close';
  closeBtn.setAttribute('data-bs-dismiss', 'offcanvas');

  header.appendChild(img);
  header.appendChild(closeBtn);

  // Body : déplacer tous les enfants du collapse
  const body = document.createElement('div');
  body.className = 'offcanvas-body';

  while (collapse.firstChild) {
    body.appendChild(collapse.firstChild);
  }

  offcanvas.appendChild(header);
  offcanvas.appendChild(body);

  // Insère l’offcanvas dans le DOM
  const navbar = document.querySelector('nav.navbar');
  (navbar?.parentNode || document.body).appendChild(offcanvas);

  // Cache l’ancien collapse
  collapse.classList.add('d-none');

  // Retarget le burger vers l’offcanvas
  toggler.setAttribute('data-bs-toggle', 'offcanvas');
  toggler.setAttribute('data-bs-target', '#site-offcanvas');
  
  
});
