// assets/js/nav-fix.js
// Keeps the #mainNav navbar visible at all times after the user scrolls
// and applies a "transparent" class when scrolled (matches the look when
// the navbar is shown while scrolling up).
//
// Instructions:
// 1) Add the accompanying CSS (see README or assistant message) for
//    .navbar-transparent and .navbar-solid.
// 2) Include this script after your other scripts, e.g.:
//    <script src="assets/js/script.min.js"></script>
//    <script src="assets/js/nav-fix.js"></script>

(function () {
  function init() {
    var nav = document.getElementById('mainNav') || document.querySelector('.navbar');
    if (!nav) return;

    // Make sure the navbar is always visible (override hide/translate)
    nav.style.transform = 'translateY(0)';
    nav.style.transition = 'background-color .25s ease, transform .2s ease';

    function updateNavTransparency() {
      // When scrolled down, show transparent navbar (matches "shown when scrolling up" look)
      if (window.scrollY > 10) {
        nav.classList.add('navbar-transparent');
        nav.classList.remove('navbar-solid');
      } else {
        // At very top, use solid by default — change if you want transparent at top
        nav.classList.remove('navbar-transparent');
        nav.classList.add('navbar-solid');
      }

      // Ensure style-level transform (in case other scripts try to hide it)
      nav.style.transform = 'translateY(0)';
    }

    // Run once and on scroll
    updateNavTransparency();
    window.addEventListener('scroll', updateNavTransparency, { passive: true });

    // Prevent other scripts from hiding the nav by observing mutations and resetting transform
    var observer = new MutationObserver(function () {
      nav.style.transform = 'translateY(0)';
    });
    observer.observe(nav, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
