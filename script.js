/* ── Custom cursor ─────────────────────────────────────────── */
(function () {
  // Only run on devices with a precise pointer (mouse/trackpad), not touch
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let hidden = true;

  // Selectors whose background is definitively dark (includes gradient-based ones
  // that getComputedStyle().backgroundColor can't detect since it returns transparent for gradients)
  const DARK_SELECTORS = [
    '.hero',
    '.page-hero',
    '.site-header',
    '.site-footer',
    '.section-dark',
    '.contact-hero-wrap',
    '.cms-topbar',
    '.cms-sidebar'
  ].join(',');

  // Detect whether the element under the cursor sits on a dark background.
  // Strategy: class-based check first (handles gradients), then luminance walk for solid colors.
  function hasDarkBackground(el) {
    // 1. Check for known dark containers (works even when background is a gradient)
    if (el.closest && el.closest(DARK_SELECTORS)) return true;

    // 2. Walk up the DOM and measure luminance for solid background colors
    let node = el;
    while (node && node !== document.documentElement) {
      const bg = window.getComputedStyle(node).backgroundColor;
      if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        node = node.parentElement;
        continue;
      }
      const parts = bg.match(/[\d.]+/g);
      if (parts && parts.length >= 3) {
        const r = parseFloat(parts[0]);
        const g = parseFloat(parts[1]);
        const b = parseFloat(parts[2]);
        const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
        if (a < 0.15) { node = node.parentElement; continue; }
        const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luma < 0.45;
      }
      node = node.parentElement;
    }
    return false;
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (hidden) {
      // Snap ring on first appearance so it doesn't slide in from a corner
      ringX = mouseX;
      ringY = mouseY;
      hidden = false;
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    }

    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    // Switch cursor colour based on background brightness
    const dark = hasDarkBackground(e.target);
    dot.classList.toggle('is-on-dark', dark);
    ring.classList.toggle('is-on-dark', dark);
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
    hidden = true;
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
    hidden = false;
  });

  // Expand ring when hovering interactive elements
  const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      ring.classList.remove('is-hovering');
    }
  });

  // Lerp loop — ring follows mouse with a slight lag
  const LERP = 0.12;
  function animate() {
    ringX += (mouseX - ringX) * LERP;
    ringY += (mouseY - ringY) * LERP;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}());

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const scrollTopLinks = Array.from(document.querySelectorAll('.scroll-top'));
const revealItems = document.querySelectorAll('.reveal');
const sections = Array.from(document.querySelectorAll('main section[id], header[id]'));
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const closeMenu = () => {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

const openMenu = () => {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
};

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.contains('is-open');

    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

const setHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle('is-scrolled', window.scrollY > 18);
};

const setStaticActiveLink = () => {
  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const isHashOnly = href.startsWith('#');
    const baseHref = href.split('#')[0];
    const matchesCurrentPage = !isHashOnly && baseHref === currentPage;
    const isDefaultHomeState = currentPage === 'index.html' && href === 'index.html' && window.location.hash === '';
    const isCurrentHash = href === window.location.hash;

    link.classList.toggle('is-active', matchesCurrentPage || isDefaultHomeState || isCurrentHash);
  });
};

setHeaderState();
setStaticActiveLink();
window.addEventListener('scroll', setHeaderState, { passive: true });

scrollTopLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: reduceMotionQuery.matches ? 'auto' : 'smooth'
    });

    if (window.location.hash) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      sectionObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
    rootMargin: '0px 0px -10% 0px'
  }
);

if (reduceMotionQuery.matches) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  revealItems.forEach((item) => sectionObserver.observe(item));
}

const pageSectionLinks = navLinks.filter((link) => {
  const href = link.getAttribute('href') || '';
  return href.startsWith('#') || href.startsWith(`${currentPage}#`);
});

if (pageSectionLinks.length > 0 && sections.length > 0) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentId = entry.target.getAttribute('id');

        navLinks.forEach((link) => {
          const href = link.getAttribute('href') || '';
          const isHashMatch = href === `#${currentId}`;
          const isPageHashMatch = href === `${currentPage}#${currentId}`;

          if (isHashMatch || isPageHashMatch) {
            navLinks.forEach((item) => item.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: '-15% 0px -35% 0px'
    }
  );

  sections.forEach((section) => navObserver.observe(section));
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});

const subjectInput = document.querySelector('#subject-line');

if (subjectInput) {
  const queryParams = new URLSearchParams(window.location.search);
  const selectedService = queryParams.get('service');

  if (selectedService && selectedService.trim()) {
    subjectInput.value = selectedService.trim();
  }
}

// ─── Services category filter ───────────────────────────────────────────
const svcFilter = document.getElementById('svc-filter');
const svcGrid   = document.getElementById('svc-grid');
const noResults = document.getElementById('svc-no-results');

if (svcFilter && svcGrid) {
  const filterBtns = Array.from(svcFilter.querySelectorAll('.svc-filter-btn'));
  const svcCards   = Array.from(svcGrid.querySelectorAll('.svc-card'));

  // ── Dropdown helpers ──
  const allDropdowns = Array.from(svcFilter.querySelectorAll('.svc-cat-dropdown'));

  // Show all cards and mark first button active on load
  svcCards.forEach((c) => c.removeAttribute('data-hidden'));
  if (filterBtns[0]) filterBtns[0].classList.add('is-active');

  const openDrop = (dropdown, btn) => {
    dropdown.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
  };

  const closeDrop = (dropdown, btn) => {
    dropdown.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  const closeAllDrops = () => {
    allDropdowns.forEach((drop) => {
      drop.classList.remove('is-open');
      const triggerBtn = svcFilter.querySelector(`[aria-controls="${drop.id}"]`);
      if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
    });
  };

  // ── Card filter ──
  const applyFilter = (category) => {
    let visibleCount = 0;

    svcCards.forEach((card) => {
      const matches = category === 'all' || card.dataset.category === category;
      if (matches) {
        card.removeAttribute('data-hidden');
        visibleCount++;
      } else {
        card.setAttribute('data-hidden', '');
      }
    });

    if (noResults) {
      noResults.classList.toggle('is-visible', visibleCount === 0);
    }
  };

  // ── Filter button clicks ──
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter   = btn.dataset.filter || 'all';
      const dropId   = btn.getAttribute('aria-controls');
      const dropdown = dropId ? document.getElementById(dropId) : null;
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Update active state
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Freeze scroll position before filter changes page height
      const gridTop = svcGrid.getBoundingClientRect().top + window.scrollY - 100;

      applyFilter(filter);

      // Restore scroll so page height change doesn't throw the user around
      window.scrollTo({ top: gridTop, behavior: 'instant' });

      if (dropdown) {
        closeAllDrops();
        if (!isExpanded) {
          openDrop(dropdown, btn);
          btn.classList.add('is-active');
        }
      } else {
        closeAllDrops();
      }
    });
  });

  // ── Service item clicks (scroll to card, apply category filter) ──
  svcFilter.addEventListener('click', (e) => {
    const item = e.target.closest('.svc-cat-item');
    if (!item) return;
    e.preventDefault();

    const category = item.dataset.category;
    const targetId = item.getAttribute('href').replace('#', '');
    const targetCard = document.getElementById(targetId);

    // Apply category filter so the card is visible
    filterBtns.forEach((b) => b.classList.remove('is-active'));
    const catBtn = filterBtns.find((b) => b.dataset.filter === category);
    if (catBtn) catBtn.classList.add('is-active');
    applyFilter(category);

    // Highlight active item
    Array.from(svcFilter.querySelectorAll('.svc-cat-item')).forEach((i) => i.classList.remove('is-active'));
    item.classList.add('is-active');

    // Scroll card to centre of viewport
    if (targetCard) {
      setTimeout(() => {
        const cardRect  = targetCard.getBoundingClientRect();
        const cardMid   = cardRect.top + window.scrollY + cardRect.height / 2;
        const scrollTo  = cardMid - window.innerHeight / 2;
        window.scrollTo({ top: Math.max(0, scrollTo), behavior: 'smooth' });
      }, 50);
    }
  });

  // Deep-link: ?category=technology
  const urlParams = new URLSearchParams(window.location.search);
  const preselect = urlParams.get('category');
  if (preselect) {
    const target = filterBtns.find((b) => b.dataset.filter === preselect);
    if (target) {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      target.classList.add('is-active');
      applyFilter(preselect);
      const dropId = target.getAttribute('aria-controls');
      if (dropId) {
        const drop = document.getElementById(dropId);
        if (drop) openDrop(drop, target);
      }
    }
  }

  // Search bar
  const searchInput = document.getElementById('svc-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();

      if (!query) {
        // Restore: show all cards, re-activate first button
        svcCards.forEach((c) => c.removeAttribute('data-hidden'));
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        if (filterBtns[0]) filterBtns[0].classList.add('is-active');
        return;
      }

      // On search: deactivate category filters, show matching cards
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      let visibleCount = 0;

      svcCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(query);
        if (matches) {
          card.removeAttribute('data-hidden');
          visibleCount++;
        } else {
          card.setAttribute('data-hidden', '');
        }
      });

      if (noResults) {
        noResults.classList.toggle('is-visible', visibleCount === 0);
      }
    });
  }
}

