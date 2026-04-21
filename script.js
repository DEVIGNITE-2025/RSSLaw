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