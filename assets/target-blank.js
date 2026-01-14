document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    const isExternal = link.hostname !== window.location.hostname;
    const isInNavbar = link.closest('.navbar');
    
    if (isExternal && isInNavbar) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });
});

