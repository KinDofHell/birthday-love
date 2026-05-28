/* ============================================================
   Navigation — scroll effect + mobile menu
   ============================================================ */
const nav    = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const mobile = document.querySelector('.nav-mobile');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

if (toggle && mobile) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    mobile.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobile.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* Mark active nav link */
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ============================================================
   Scroll-reveal (IntersectionObserver)
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   Canvas petal animation (hero page only)
   ============================================================ */
const canvas = document.getElementById('petals-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const PETAL_COUNT = 28;
  const petals = [];

  const COLORS = [
    [255, 183, 197],  // blossom pink
    [232, 116, 138],  // rose
    [255, 220, 235],  // pale pink
    [184, 169, 217],  // lavender
    [200, 230, 216],  // sage mint
    [255, 208, 220],  // soft rose
  ];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Petal {
    constructor(randomY = false) {
      const [r, g, b] = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.color   = `rgba(${r},${g},${b},`;
      this.reset(randomY);
    }

    reset(randomY = false) {
      this.x      = Math.random() * canvas.width;
      this.startX = this.x;
      this.y      = randomY ? Math.random() * canvas.height : -20;
      this.size   = Math.random() * 9 + 4;
      this.speedY = Math.random() * 1.1 + 0.4;
      this.alpha  = Math.random() * 0.55 + 0.25;
      this.rot    = Math.random() * Math.PI * 2;
      this.rotSpd = (Math.random() - 0.5) * 0.04;
      this.swayA  = Math.random() * 35 + 15;
      this.swayF  = Math.random() * 0.018 + 0.008;
      this.t      = Math.random() * Math.PI * 2;
    }

    update() {
      this.t    += this.swayF;
      this.y    += this.speedY;
      this.x     = this.startX + Math.sin(this.t) * this.swayA;
      this.rot  += this.rotSpd;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color + this.alpha + ')';

      /* Petal — two mirrored bezier curves */
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(
         this.size * 0.9, -this.size * 0.6,
         this.size * 0.9,  this.size * 0.6,
         0, this.size
      );
      ctx.bezierCurveTo(
        -this.size * 0.9,  this.size * 0.6,
        -this.size * 0.9, -this.size * 0.6,
         0, -this.size
      );
      ctx.fill();
      ctx.restore();
    }

    isDead() {
      return this.y > canvas.height + 30;
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal(true));
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of petals) {
      p.update();
      p.draw();
      if (p.isDead()) {
        p.reset();
        p.startX = Math.random() * canvas.width;
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* ============================================================
   Typewriter effect
   ============================================================ */
const typeEl = document.querySelector('.typewriter');
if (typeEl) {
  const text   = typeEl.dataset.text || typeEl.textContent;
  typeEl.textContent = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      typeEl.textContent += text[i++];
      setTimeout(type, 65 + Math.random() * 45);
    } else {
      typeEl.classList.remove('typewriter');
    }
  }

  setTimeout(type, 600);
}

/* ============================================================
   Simple lightbox (gallery page)
   ============================================================ */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImg   = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const ph = item.querySelector('.photo-placeholder');
      /* When user adds real <img> tags, swap src; for now show placeholder */
      lightboxImg.innerHTML = ph ? ph.outerHTML : '';
      lightboxImg.style.minWidth  = '280px';
      lightboxImg.style.minHeight = '200px';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLB);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
}
