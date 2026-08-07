// assets/js/nav-fix.js
// Keeps the #mainNav navbar visible at all times after the user scrolls
// and applies a "transparent" class when scrolled (matches the look when
// the navbar is shown while scrolling up).
//
// This file also ensures the `is-visible` class is never permanently removed
// from the navbar by other scripts. If `is-visible` is removed it will be
// restored immediately.
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

    // Ensure the nav has the 'is-visible' class and cannot be left without it
    function ensureIsVisibleClass() {
      try {
        if (nav.classList && !nav.classList.contains('is-visible')) {
          nav.classList.add('is-visible');
        }
      } catch (e) {
        // Defensive: if classList is not available for some reason, ignore
      }
    }

    // Make sure the navbar is always visible (override hide/translate)
    nav.style.transform = 'translateY(0)';
    nav.style.transition = 'background-color .25s ease, transform .2s ease';

    // Ensure 'is-visible' is present on startup
    ensureIsVisibleClass();

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

      // Ensure 'is-visible' hasn't been removed by other scripts
      ensureIsVisibleClass();
    }

    // Run once and on scroll
    updateNavTransparency();
    window.addEventListener('scroll', updateNavTransparency, { passive: true });

    // Prevent other scripts from hiding the nav by observing mutations and resetting transform
    var observer = new MutationObserver(function (mutations) {
      // Always keep the nav translated into view
      nav.style.transform = 'translateY(0)';

      // If class attribute changed, make sure 'is-visible' is present
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'attributes' && m.attributeName === 'class') {
          try {
            // If this element looks like the navbar and lost 'is-visible', restore it
            if (nav.classList && nav.classList.contains('navbar') && !nav.classList.contains('is-visible')) {
              nav.classList.add('is-visible');
            }
          } catch (e) {
            // ignore
          }
        }
      }
    });
    observer.observe(nav, { attributes: true, attributeFilter: ['style', 'class'] });

    // Additional defensive measure: intercept attempts to remove the specific class
    // on this element by wrapping classList.remove for this element only (non-invasive).
    // This avoids preventing other legitimate class removals across the page.
    try {
      var originalClassList = nav.classList;
      if (originalClassList && originalClassList.remove) {
        var originalRemove = originalClassList.remove.bind(originalClassList);
        originalClassList.remove = function () {
          // Convert arguments to array and filter out attempts to remove 'is-visible'
          var args = Array.prototype.slice.call(arguments);
          var filtered = args.filter(function (c) { return c !== 'is-visible'; });
          return originalRemove.apply(null, filtered);
        };
      }
    } catch (e) {
      // If wrapping fails, we still have the MutationObserver fallback
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
