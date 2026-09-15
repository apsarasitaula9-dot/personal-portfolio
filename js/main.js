/* ==========================================================================
   APSARA SITAULA — PORTFOLIO MAIN JAVASCRIPT
   Interactions, Navigation, Filters, Modals, Clipboard, Form & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initProjectFilters();
  initProjectModals();
  initClipboardButtons();
  initContactForm();
  initScrollAnimations();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.mobile-drawer .nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      const isExpanded = mobileToggle.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
      }
    });
  }

  // Set active link based on current page pathname
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   2. PROJECT FILTERING & FEATURED SHOWCASE (PROJECTS PAGE)
   ========================================================================== */
const featuredProjectsData = {
  'all': {
    id: 'pokhara-thakali',
    badge: 'WEBSITE',
    title: 'Pokhara Thakali Kitchen',
    subtitle: 'Web Design & Development',
    description: 'A modern and elegant website for a traditional Nepali restaurant, featuring menu, gallery, reservation system and a fully responsive design.',
    image: 'assets/projects/pokhara-thakali-kitchen.jpg',
    imageAlt: 'Pokhara Thakali Kitchen Website UI',
    link: 'https://restuarant-pokhara-ka66.vercel.app/',
    isExternal: true,
    tags: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
    num: '01',
    note: 'Good Food<br />Good Design <span class="heart">♡</span>'
  },
  'website': {
    id: 'pokhara-thakali',
    badge: 'WEBSITE',
    title: 'Pokhara Thakali Kitchen',
    subtitle: 'Web Design & Development',
    description: 'A modern and elegant website for a traditional Nepali restaurant, featuring menu, gallery, reservation system and a fully responsive design.',
    image: 'assets/projects/pokhara-thakali-kitchen.jpg',
    imageAlt: 'Pokhara Thakali Kitchen Website UI',
    link: 'https://restuarant-pokhara-ka66.vercel.app/',
    isExternal: true,
    tags: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
    num: '01',
    note: 'Good Food<br />Good Design <span class="heart">♡</span>'
  },
  'game': {
    id: 'snake-game',
    badge: 'GAME',
    title: 'Snake Game',
    subtitle: 'Game Development',
    description: 'A modern browser-based Snake Game with multiple difficulty levels, score progression, unlockable skins, sound controls, fullscreen mode, and responsive gameplay.',
    image: 'assets/projects/snake-game.png',
    imageAlt: 'Snake Game Development',
    link: 'https://apsarasitaula9-dot.github.io/snake-game/',
    isExternal: true,
    tags: ['HTML', 'CSS', 'JavaScript'],
    num: '01',
    note: 'Games That Play <span class="heart">♡</span>'
  },
  'graphic-design': {
    id: 'aws-cloud-clubs',
    badge: 'GRAPHIC DESIGN',
    title: 'AWS Cloud Clubs',
    subtitle: 'Social Media & Graphic Design',
    description: 'A collection of social media graphics, event posters, team features, announcements, and community promotional designs created for AWS Student Builder Group / AWS Cloud Clubs at Pokhara Engineering College.',
    image: 'assets/projects/aws-cloud-clubs.jpg',
    imageAlt: 'AWS Cloud Clubs Graphic Design',
    link: 'https://www.instagram.com/awssbg.pec/',
    isExternal: true,
    projectId: 'aws-cloud-clubs',
    tags: ['Graphic Design', 'Social Media', 'Photoshop', 'Illustrator'],
    num: '01',
    note: 'Visuals That Speak <span class="heart">♡</span>'
  }
};

function updateFeaturedProject(category) {
  const data = featuredProjectsData[category] || featuredProjectsData['all'];
  const showcaseCard = document.getElementById('featuredShowcaseCard');
  if (!showcaseCard) return;

  // Add smooth fade transition
  showcaseCard.classList.add('fade-out');

  setTimeout(() => {
    // 1. Image
    const img = document.getElementById('featuredImage');
    if (img) {
      img.src = data.image;
      img.alt = data.imageAlt;
    }

    // 2. Category badge
    const badge = document.getElementById('featuredCategory');
    if (badge) badge.textContent = data.badge;

    // 3. Title
    const title = document.getElementById('featuredTitle');
    if (title) title.textContent = data.title;

    // 4. Subtitle
    const subtitle = document.getElementById('featuredSubtitle');
    if (subtitle) subtitle.textContent = data.subtitle;

    // 5. Description
    const desc = document.getElementById('featuredDesc');
    if (desc) desc.textContent = data.description;

    // 6. Tags
    const tagsContainer = document.getElementById('featuredTags');
    if (tagsContainer) {
      tagsContainer.innerHTML = '';
      data.tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'project-tag';
        span.textContent = t;
        tagsContainer.appendChild(span);
      });
    }

    // 7. Number & Note
    const num = document.getElementById('featuredNum');
    if (num) num.textContent = data.num;

    const note = document.getElementById('featuredNote');
    if (note) note.innerHTML = data.note;

    // 8. Button & Card Click Handler
    const linkBtn = document.getElementById('featuredLink');
    if (linkBtn) {
      if (data.isExternal) {
        linkBtn.href = data.link;
        linkBtn.target = '_blank';
        linkBtn.rel = 'noopener noreferrer';
        linkBtn.removeAttribute('data-project-id');
        linkBtn.onclick = null;
      } else {
        linkBtn.href = '#';
        linkBtn.removeAttribute('target');
        linkBtn.removeAttribute('rel');
        linkBtn.setAttribute('data-project-id', data.projectId);
        linkBtn.onclick = (e) => {
          e.preventDefault();
          openProjectModal(data.projectId);
        };
      }
    }

    // Showcase card click
    showcaseCard.onclick = (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      if (data.isExternal) {
        window.open(data.link, '_blank', 'noopener,noreferrer');
      } else if (data.projectId) {
        openProjectModal(data.projectId);
      }
    };
    showcaseCard.title = data.isExternal ? `Open ${data.title} live website` : `View ${data.title} details`;

    // Remove fade
    showcaseCard.classList.remove('fade-out');
  }, 140);
}

function initProjectFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.portfolio-card[data-category]');

  if (!filterPills.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      // 1. Dynamically update Featured Project Showcase
      updateFeaturedProject(filterValue);

      // 2. Filter Project Grid Cards Below
      const currentFeaturedId = (featuredProjectsData[filterValue] || featuredProjectsData['all']).id;

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const cardProjectId = card.getAttribute('data-project-id');
        const isMatch = (filterValue === 'all' || category === filterValue);

        if (isMatch) {
          card.style.display = 'grid';

          // Handle duplication cleanly if this card matches currently featured project
          if (filterValue !== 'all' && cardProjectId === currentFeaturedId) {
            card.classList.add('is-featured-duplicate');
            let dupBadge = card.querySelector('.featured-indicator-badge');
            if (!dupBadge) {
              dupBadge = document.createElement('div');
              dupBadge.className = 'featured-indicator-badge';
              dupBadge.innerHTML = '★ Spotlight Project Above';
              const body = card.querySelector('.portfolio-card-body > div:first-child');
              if (body) {
                body.insertBefore(dupBadge, body.firstChild);
              }
            } else {
              dupBadge.style.display = 'inline-flex';
            }
          } else {
            card.classList.remove('is-featured-duplicate');
            const dupBadge = card.querySelector('.featured-indicator-badge');
            if (dupBadge) dupBadge.style.display = 'none';
          }

          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   3. PROJECT DETAIL MODAL
   ========================================================================== */
const projectDatabase = {
  'pokhara-thakali': {
    title: 'Pokhara Thakali Kitchen',
    category: 'Website • Web Design & Development',
    image: 'assets/projects/pokhara-thakali-kitchen.jpg',
    description: 'A luxurious, modern website designed and developed for an authentic Thakali dining experience in Pokhara, Nepal. Highlights include a dark-mode palette with warm ambient lighting, interactive digital menu with photography, table reservation system, and full responsiveness across mobile and desktop.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Restaurant Experience'],
    link: 'https://restuarant-pokhara-ka66.vercel.app/'
  },
  'snake-game': {
    title: 'Snake Game',
    category: 'Game • Game Development',
    image: 'assets/projects/snake-game.png',
    description: 'A modern browser-based Snake Game with multiple difficulty levels, score progression, unlockable skins, sound controls, fullscreen mode, and responsive gameplay.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://apsarasitaula9-dot.github.io/snake-game/'
  },
  'aws-cloud-clubs': {
    title: 'AWS Cloud Clubs',
    category: 'Graphic Design • Social Media & Community',
    image: 'assets/projects/aws-cloud-clubs.jpg',
    description: 'A collection of social media graphics, event posters, team features, announcements, and community promotional designs created for AWS Student Builder Group / AWS Cloud Clubs at Pokhara Engineering College.',
    tags: ['Graphic Design', 'Social Media', 'Photoshop', 'Illustrator'],
    link: 'https://www.instagram.com/awssbg.pec/'
  },
  'e-library': {
    title: 'E-Library',
    category: 'Website • Personal Project',
    image: 'assets/projects/e-library.jpg',
    description: 'A modern digital library website designed to provide students with easy access to books, categories, and learning resources.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://e-library-dusky.vercel.app'
  }
};

function openProjectModal(projectId) {
  const modalOverlay = document.getElementById('projectModal');
  if (!modalOverlay) return;

  if (projectId === 'aws-cloud-clubs' || projectId === 'aws-sbg') {
    window.open('https://www.instagram.com/awssbg.pec/', '_blank', 'noopener,noreferrer');
    return;
  }
  if (projectId === 'pokhara-thakali') {
    window.open('https://restuarant-pokhara-ka66.vercel.app/', '_blank', 'noopener,noreferrer');
    return;
  }
  if (projectId === 'e-library') {
    window.open('https://e-library-dusky.vercel.app', '_blank', 'noopener,noreferrer');
    return;
  }
  if (projectId === 'snake-game') {
    window.open('https://apsarasitaula9-dot.github.io/snake-game/', '_blank', 'noopener,noreferrer');
    return;
  }

  const data = projectDatabase[projectId];
  if (data) {
    const modalImg = document.getElementById('modalImage');
    if (modalImg) {
      modalImg.src = data.image;
      modalImg.alt = data.title;
    }
    const modalCat = document.getElementById('modalCategory');
    if (modalCat) modalCat.textContent = data.category;
    const modalTit = document.getElementById('modalTitle');
    if (modalTit) modalTit.textContent = data.title;
    const modalDesc = document.getElementById('modalDesc');
    if (modalDesc) modalDesc.textContent = data.description;

    const tagContainer = document.getElementById('modalTags');
    if (tagContainer) {
      tagContainer.innerHTML = '';
      data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'project-tag';
        span.textContent = tag;
        tagContainer.appendChild(span);
      });
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function initProjectModals() {
  const modalOverlay = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const triggerBtns = document.querySelectorAll('[data-project-id]');

  if (!modalOverlay) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   4. CLIPBOARD COPY BUTTONS
   ========================================================================== */
function initClipboardButtons() {
  const copyBtns = document.querySelectorAll('.btn-copy');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.backgroundColor = 'var(--primary)';
        btn.style.color = '#FFFFFF';

        showToast(`Copied "${textToCopy}" to clipboard`);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }, 2200);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  });
}

/* ==========================================================================
   5. CONTACT FORM VALIDATION & REAL EMAIL DISPATCH
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const messageInput = document.getElementById('contactMessage');
  const charCounter = document.getElementById('charCount');

  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len}/500`;
      if (len > 480) {
        charCounter.style.color = 'var(--primary)';
      } else {
        charCounter.style.color = '';
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('contactSubject');
      const gotchaInput = document.getElementById('contactGotcha');

      const name = nameInput?.value.trim();
      const email = emailInput?.value.trim();
      const subject = subjectInput?.value;
      const message = messageInput ? messageInput.value.trim() : '';
      const gotcha = gotchaInput ? gotchaInput.value : '';

      // Field validation
      if (!name) {
        showToast('Please enter your name.', 'warning');
        nameInput?.focus();
        return;
      }

      if (!email) {
        showToast('Please enter your email address.', 'warning');
        emailInput?.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'warning');
        emailInput?.focus();
        return;
      }

      if (!subject) {
        showToast('Please select a subject for your inquiry.', 'warning');
        subjectInput?.focus();
        return;
      }

      if (!message) {
        showToast('Please enter your message.', 'warning');
        messageInput?.focus();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnContent = submitBtn.innerHTML;

      // Loading state - prevent duplicate submissions
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending Message...</span>
        <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12" stroke-linecap="round" />
        </svg>
      `;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
            _gotcha: gotcha,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
          contactForm.reset();
          if (charCounter) charCounter.textContent = '0/500';
        } else {
          const errorMessage =
            data.error ||
            'Unable to send email right now. Please try again later or email apsarasitaula9@gmail.com directly.';
          showToast(errorMessage, 'error');
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
        showToast(
          'Network connection error. Please check your internet or reach out directly to apsarasitaula9@gmail.com.',
          'error'
        );
      } finally {
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
      }
    });
  }
}

/* ==========================================================================
   6. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout = null;

function showToast(message, type = 'success') {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    document.body.appendChild(toast);
  }

  let iconSvg = '';
  if (type === 'error') {
    iconSvg = `
      <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    `;
  } else if (type === 'warning') {
    iconSvg = `
      <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    `;
  } else {
    iconSvg = `
      <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    `;
  }

  toast.className = `toast-notice toast-${type}`;
  toast.innerHTML = `
    ${iconSvg}
    <span class="toast-text">${message}</span>
  `;

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   7. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(
    '.preview-card, .discipline-card, .portfolio-card, .timeline-item, .takeaway-card, .assurance-card'
  );

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.1}s`;
    observer.observe(el);
  });
}
