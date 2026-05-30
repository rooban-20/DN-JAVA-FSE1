'use strict';
document.addEventListener('DOMContentLoaded', () => {
  initFormValidation();
  initBackToTop();
  initScrollReveal();
  initNavbar();
  initSearchHandler();
  initFilterHandler();
  initNewsletterHandlers();
  initCarouselPause();
  initCollapseChevron();
  initTooltips();
  initPopovers();
  initCardRegisterPrefill();
});
function initFormValidation() {
  const form = document.getElementById('registrationForm');
  if (!form) return;
  const submitBtn = document.getElementById('submitBtn');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.add('was-validated');
    if (form.checkValidity()) {
      submitBtn.disabled = true;
      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span>Processing…</span>
      `;
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        form.reset();
        form.classList.remove('was-validated');
        showToast('Registration Successful!', 'Your spot has been confirmed. Check your email.', 'success');
      }, 1800);
    } else {
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      showToast('Incomplete Form', 'Please fill in all required fields correctly.', 'danger');
    }
  });
  const emailField = document.getElementById('emailAddress');
  if (emailField) {
    emailField.addEventListener('input', () => {
      const v = emailField.validity.valid && emailField.value.length > 0;
      emailField.classList.toggle('is-valid', v);
      emailField.classList.toggle('is-invalid', !emailField.validity.valid && emailField.value.length > 0);
    });
  }
  const nameField = document.getElementById('fullName');
  if (nameField) {
    nameField.addEventListener('input', () => {
      const v = nameField.validity.valid;
      nameField.classList.toggle('is-valid', v);
      nameField.classList.toggle('is-invalid', !v && nameField.value.length > 0);
    });
  }
}
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', throttle(() => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, 100));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.event-card, .feature-box, .contact-card, .filter-widget, .tags-widget, .profile-widget, .align-card, .order-box, .accordion-item'
  );
  targets.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling elements
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;
  window.addEventListener('scroll', throttle(() => {
    navbar.classList.toggle('shrunk', window.scrollY > 60);
  }, 100));
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#mainNavbar .nav-link[href^="#"]');
  window.addEventListener('scroll', throttle(() => {
    let current = '';
    sections.forEach(section => {
      if (section.offsetTop <= window.scrollY + 120) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }, 120));
}
function initSearchHandler() {
  document.querySelectorAll('form[role="search"]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="search"]');
      const query = input ? input.value.trim() : '';
      if (query.length < 2) {
        showToast('Search', 'Please enter at least 2 characters.', 'warning');
        return;
      }
      showToast('Searching…', `Finding events matching "${escapeHTML(query)}"`, 'info');
      setTimeout(() => {
        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
        if (input) input.value = '';
      }, 800);
    });
  });
}
function initFilterHandler() {
  const filterBtn = document.querySelector('.filter-btn');
  if (!filterBtn) return;
  filterBtn.addEventListener('click', () => {
    const select = document.querySelector('.filter-select');
    const category = select ? select.value : 'All';
    filterBtn.disabled = true;
    filterBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Filtering…';
    setTimeout(() => {
      filterBtn.disabled = false;
      filterBtn.innerHTML = 'Apply Filters';
      showToast('Filters Applied', `Showing results for: ${escapeHTML(category)}`, 'success');
    }, 1000);
  });
}
function initNewsletterHandlers() {
  document.querySelectorAll('.newsletter-input-group button, .footer-newsletter button').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.newsletter-input-group') || btn.closest('.footer-newsletter');
      if (!group) return;
      const emailInput = group.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email || !isValidEmail(email)) {
        showToast('Invalid Email', 'Please enter a valid email address.', 'warning');
        emailInput?.focus();
        return;
      }
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = orig;
        if (emailInput) emailInput.value = '';
        showToast('Subscribed! ✦', `${escapeHTML(email)} added to our mailing list.`, 'success');
      }, 1200);
    });
  });
}
function initCarouselPause() {
  const carouselEl = document.getElementById('galleryCarousel');
  if (!carouselEl) return;
  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
    interval: 4500,
    ride: 'carousel',
    wrap: true,
  });
  carouselEl.addEventListener('mouseenter', () => carousel.pause());
  carouselEl.addEventListener('mouseleave', () => carousel.cycle());
  document.addEventListener('keydown', (e) => {
    const rect = carouselEl.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowLeft')  carousel.prev();
      if (e.key === 'ArrowRight') carousel.next();
    }
  });
}
function showToast(title, message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '11000';
    document.body.appendChild(container);
  }
  const colorMap = {
    success: '#4ade80',
    danger:  '#f87171',
    warning: '#fbbf24',
    info:    '#60a5fa',
    primary: '#c9a84c',
  };
  const iconMap = {
    success: 'bi-check-circle-fill',
    danger:  'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info:    'bi-info-circle-fill',
    primary: 'bi-star-fill',
  };
  const color = colorMap[type] || colorMap.info;
  const icon  = iconMap[type] || iconMap.info;
  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center border-0 rounded-3 overflow-hidden';
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="toast-header">
      <i class="bi ${icon} me-2" style="color:${color};font-size:0.9rem;"></i>
      <strong class="me-auto" style="font-size:0.85rem;">${escapeHTML(title)}</strong>
      <small style="color:var(--ash);font-family:var(--font-mono);font-size:0.6rem;">now</small>
      <button type="button" class="btn-close ms-2" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body" style="font-size:0.8rem;">${escapeHTML(message)}</div>
  `;
  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
function initCollapseChevron() {
  document.querySelectorAll('[data-bs-toggle="collapse"] i.bi-chevron-down').forEach(icon => {
    icon.style.transition = 'transform 0.3s ease';
  });
  document.addEventListener('show.bs.collapse', (e) => {
    const trigger = document.querySelector(`[data-bs-target="#${e.target.id}"] i.bi-chevron-down`);
    if (trigger) trigger.style.transform = 'rotate(180deg)';
  });
  document.addEventListener('hide.bs.collapse', (e) => {
    const trigger = document.querySelector(`[data-bs-target="#${e.target.id}"] i.bi-chevron-down`);
    if (trigger) trigger.style.transform = 'rotate(0deg)';
  });
  document.addEventListener('show.bs.collapse', (e) => {
    const btn = document.querySelector(`[data-bs-target="#${e.target.id}"]`);
    if (btn) btn.setAttribute('aria-expanded', 'true');
  });
  document.addEventListener('hide.bs.collapse', (e) => {
    const btn = document.querySelector(`[data-bs-target="#${e.target.id}"]`);
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}
function initTooltips() {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
}
function initPopovers() {
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el =>
    new bootstrap.Popover(el, { trigger: 'hover focus' })
  );
}
function initCardRegisterPrefill() {
  document.querySelectorAll('.card-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.event-card');
      if (!card) return;
      const category = card.getAttribute('data-category') || '';
      const selectEl = document.getElementById('eventCategory');
      if (selectEl && category) {
        const map = {
          music:    'music',
          tech:     'tech',
          food:     'food',
          arts:     'art',
          wellness: 'wellness',
          lit:      'literature',
        };
        if (map[category]) selectEl.value = map[category];
      }
    });
  });
}
function throttle(fn, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
document.getElementById('successModal')?.addEventListener('hidden.bs.modal', () => {
});
window.addEventListener('load', () => {
  if (window.performance) {
    const t = (performance.now() / 1000).toFixed(2);
  }
});
