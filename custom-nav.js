document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.nav-burger');
  const dropdown = document.querySelector('.nav-dropdown');
  const links = document.querySelectorAll('.nav-link');

  if (!burger || !dropdown) return;

  function toggleMenu(show) {
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    const shouldOpen = show !== undefined ? show : !isExpanded;

    burger.classList.toggle('open', shouldOpen);
    dropdown.classList.toggle('open', shouldOpen);
    burger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    dropdown.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  }

  // Toggle dropdown on burger click
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking a link
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !burger.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMenu(false);
      burger.focus();
    }
  });

  // Mark the active link based on current page URL
  const currentPath = window.location.pathname;
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Extract page folder name from href (e.g. "appointment-page" from "./appointment-page/index.html")
      const folderMatch = href.match(/([^\/]+)\/index\.html$/);
      const isHome = href.includes('index.html') && !folderMatch;
      
      if (isHome && (currentPath === '/' || currentPath.endsWith('index.html') && !currentPath.includes('/', currentPath.length - 12))) {
        link.classList.add('active');
      } else if (folderMatch && currentPath.includes(folderMatch[1])) {
        link.classList.add('active');
      }
    }
  });
});
