document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // EMAILJS CONFIG (fill these from your EmailJS dashboard)
  // ============================================
  const EMAILJS_SERVICE_ID = 'service_kujjr5m';
  const EMAILJS_TEMPLATE_ID = 'template_u3diugf';    
  const EMAILJS_PUBLIC_KEY = '2vkwsB75zAf1Az-m1E';

  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  // ============================================
  // FLOATING SUNFLOWER PETALS
  // ============================================
  const petalsContainer = document.getElementById('petalsContainer');

  function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    const startX = Math.random() * window.innerWidth;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * 5;
    const size = 0.5 + Math.random() * 1;

    petal.style.left = startX + 'px';
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = delay + 's';
    petal.style.transform = `scale(${size})`;

    petalsContainer.appendChild(petal);

    setTimeout(() => {
      if (petal.parentNode) petal.remove();
    }, (duration + delay) * 1000);
  }

  function spawnPetals() {
    const count = window.innerWidth < 768 ? 1 : 3;
    for (let i = 0; i < count; i++) {
      createPetal();
    }
  }

  spawnPetals();
  setInterval(spawnPetals, 4000);

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ============================================
  // MOBILE NAV TOGGLE
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // COUNTDOWN TIMER
  // ============================================
  const weddingDate = new Date('2026-05-14T14:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '0';
      document.getElementById('hours').textContent = '0';
      document.getElementById('minutes').textContent = '0';
      document.getElementById('seconds').textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  let galleryRevealIndex = 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let delay = parseInt(entry.target.dataset.delay || '0', 10);

        if (entry.target.classList.contains('gallery-item')) {
          delay += galleryRevealIndex * 120;
          galleryRevealIndex += 1;
        }

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ============================================
  // RSVP FORM
  // ============================================
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = rsvpForm.querySelector('.rsvp-btn');
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    const formData = new FormData(rsvpForm);
    const templateParams = {
      guest_name: formData.get('guestName'),
      email: formData.get('guestEmail'),
      attendance: formData.get('attendance'),
      guests: formData.get('guests'),
      message: formData.get('message') || '',
    };

    if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
      emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          rsvpForm.style.display = 'none';
          rsvpSuccess.classList.add('show');
          launchCelebration();
        })
        .catch(() => {
          btn.innerHTML = '<span>Send RSVP</span>';
          btn.disabled = false;
          alert('Sorry, something went wrong sending your RSVP. Please try again.');
        });
    } else {
      // fallback: walang configured EmailJS, behave like demo
      setTimeout(() => {
        rsvpForm.style.display = 'none';
        rsvpSuccess.classList.add('show');
        launchCelebration();
      }, 800);
    }
  });

  // ============================================
  // CELEBRATION ANIMATION (after RSVP)
  // ============================================
  function launchCelebration() {
    const colors = ['#FFC107', '#DAA520', '#FFD54F', '#FFE082', '#B8860B', '#FF8F00'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:hidden;';
    document.body.appendChild(container);

    for (let i = 0; i < 80; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 6 + Math.random() * 8;
      const startX = Math.random() * 100;
      const duration = 2 + Math.random() * 3;
      const delay = Math.random() * 1;

      confetti.style.cssText = `
        position:absolute;
        top:-10px;
        left:${startX}%;
        width:${size}px;
        height:${size * 0.6}px;
        background:${color};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        opacity:0;
        animation:confettiFall ${duration}s ease-out ${delay}s forwards;
      `;
      container.appendChild(confetti);
    }

    if (!document.getElementById('confettiStyle')) {
      const style = document.createElement('style');
      style.id = 'confettiStyle';
      style.textContent = `
        @keyframes confettiFall {
          0% { opacity:1; transform:translateY(0) rotate(0deg) scale(1); }
          100% { opacity:0; transform:translateY(100vh) rotate(${360 + Math.random() * 720}deg) scale(0.3) translateX(${(Math.random()-0.5)*200}px); }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => container.remove(), 6000);
  }

  // ============================================
  // PARALLAX EFFECT ON HERO
  // ============================================
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      const rate = scrolled * 0.3;
      heroContent.style.transform = `translateY(${rate}px)`;
      heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
  }, { passive: true });

  // ============================================
  // SUNFLOWER HOVER ROTATION (on SVGs)
  // ============================================
  document.querySelectorAll('.sunflower-petals-group').forEach(group => {
    group.closest('svg').addEventListener('mouseenter', () => {
      group.style.transition = 'transform 1s ease';
      group.style.transform = 'rotate(30deg)';
    });
    group.closest('svg').addEventListener('mouseleave', () => {
      group.style.transition = 'transform 1s ease';
      group.style.transform = 'rotate(0deg)';
    });
  });

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHT
  // ============================================
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.style.color = '';
          link.classList.add('active-link');
        } else {
          link.classList.remove('active-link');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ============================================
  // TYPED TEXT EFFECT FOR HERO BADGES (both)
  // ============================================
  const badges = document.querySelectorAll('.hero-badge');
  if (badges.length) {
    badges.forEach((badgeEl, index) => {
      const text = badgeEl.textContent;
      badgeEl.textContent = '';
      badgeEl.style.opacity = '1';
      badgeEl.style.transform = 'translateY(0)';

      let i = 0;
      const baseDelay = 600;         
      const betweenDelay = 200;        

      function typeChar() {
        if (i < text.length) {
          badgeEl.textContent += text[i];
          i++;
          setTimeout(typeChar, 80);
        }
      }

      setTimeout(typeChar, baseDelay + index * betweenDelay);
    });
  }

  // ============================================
  // GALLERY LIGHTBOX (simple)
  // ============================================
  const galleryItems = document.querySelectorAll('.gallery-item img');

  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(62,39,35,0.95);
        z-index:10001;display:flex;align-items:center;justify-content:center;
        cursor:pointer;animation:fadeIn 0.3s ease;
      `;

      const largeImg = document.createElement('img');
      largeImg.src = img.src.replace('w=600', 'w=1200').replace('h=400', 'h=800').replace('h=900', 'h=1200');
      largeImg.style.cssText = `
        max-width:90vw;max-height:90vh;border-radius:8px;
        box-shadow:0 20px 60px rgba(0,0,0,0.5);
        animation:scaleIn 0.4s cubic-bezier(0.4,0,0.2,1);
      `;

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '\u00D7';
      closeBtn.style.cssText = `
        position:absolute;top:20px;right:30px;font-size:2.5rem;
        color:#DAA520;background:none;border:none;cursor:pointer;
        font-family:sans-serif;line-height:1;
      `;

      overlay.appendChild(largeImg);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      function closeLightbox() {
        overlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = '';
        }, 300);
      }

      overlay.addEventListener('click', closeLightbox);
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });
    });
  });

  // ============================================
  // FAQ ACCORDION
  // ============================================
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  if (!document.getElementById('lightboxStyle')) {
    const style = document.createElement('style');
    style.id = 'lightboxStyle';
    style.textContent = `
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes fadeOut { from{opacity:1} to{opacity:0} }
      @keyframes scaleIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
      .active-link { color: #DAA520 !important; }
      .navbar:not(.scrolled) .active-link { color: #FFC107 !important; }
    `;
    document.head.appendChild(style);
  }

});
