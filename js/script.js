/* =====================================================
   HEARTH & TABLE — Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Detect page type ── */
  const isRecipePage = document.body.classList.contains('recipe-page');

  /* ── Auto date ── */
  const dateEl = document.getElementById('autoDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  /* ── Hero Ken Burns ── */
  const hero = document.querySelector('.hero');
  if (hero) setTimeout(() => hero.classList.add('loaded'), 100);

  /* ── Sticky nav shadow ── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === currentPage) link.classList.add('nav__link--active');
  });

  /* ── Mobile nav ── */
  const burger = document.getElementById('navBurger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => mobileNav.classList.add('open'));
    mobileClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  /* ── Lead Form Modal ── */
  const modalOverlay = document.getElementById('leadModal');
  const modalTitle   = document.getElementById('modalTitle');
  const leadForm     = document.getElementById('leadForm');
  const formContent  = document.getElementById('formContent');
  const successMsg   = document.getElementById('successMessage');

  const openModal = (context) => {
    if (!modalOverlay) return;
    if (modalTitle) {
      const titles = {
        'Join Free':      'Start Cooking for Free',
        'Get Recipe':     'Unlock This Recipe',
        'Subscribe':      'Join Hearth & Table',
        'Newsletter':     'Get Weekly Recipes',
        'default':        'Join Hearth & Table'
      };
      modalTitle.textContent = titles[context] || titles['default'];
    }
    if (formContent) formContent.style.display = 'block';
    if (successMsg) successMsg.classList.remove('show');
    if (leadForm) leadForm.reset();
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-modal="lead"]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.context || 'default'));
  });

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ── Form Submission ── */
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const consent = document.getElementById('formConsent');
      if (!consent?.checked) {
        consent?.setCustomValidity('Please agree to the Privacy Policy and Terms to continue.');
        consent?.reportValidity();
        return;
      }
      consent.setCustomValidity('');

      if (isRecipePage) {
        if (formContent) formContent.style.display = 'none';
        successMsg?.classList.add('show');
        setTimeout(() => {
          closeModal();
          unlockRecipeContent();
        }, 2000);
      } else {
        if (formContent) formContent.style.display = 'none';
        successMsg?.classList.add('show');
      }
    });
  }

  /* ── Unlock Recipe Content ── */
  function unlockRecipeContent() {
    const locked = document.getElementById('gateContent');
    const wall   = document.getElementById('gateWall');
    if (locked) {
      locked.classList.add('unlocked');
      sessionStorage.setItem('ht_recipe_unlocked', 'true');
    }
    if (wall) wall.style.display = 'none';
  }

  /* Auto-unlock if previously unlocked in session */
  if (isRecipePage && sessionStorage.getItem('ht_recipe_unlocked')) {
    unlockRecipeContent();
  }

  /* ── Filter Pills (homepage) ── */
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('filter-pill--active'));
      pill.classList.add('filter-pill--active');
    });
  });

  /* ── Newsletter micro-interaction ── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button');
      if (btn) { btn.textContent = '✓ Subscribed!'; btn.style.background = '#6B7C45'; }
      if (input) input.value = '';
      setTimeout(() => {
        if (btn) { btn.textContent = 'Subscribe'; btn.style.background = ''; }
      }, 3000);
    });
  });

  /* ── Sidebar newsletter ── */
  document.querySelectorAll('.sidebar-nl-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      if (btn) { btn.textContent = '✓ Subscribed!'; }
    });
  });

  /* ── Cookie Consent ── */
  const cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner && !localStorage.getItem('ht_cookie_consent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1200);
  }
  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('ht_cookie_consent', 'accepted');
    cookieBanner?.classList.remove('show');
  });
  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    localStorage.setItem('ht_cookie_consent', 'declined');
    cookieBanner?.classList.remove('show');
  });

  /* ── Scroll Animations ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

});
