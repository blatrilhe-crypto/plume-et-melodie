/* ════════════════════════════════════════════════════════
   PLUME & MÉLODIE — Script
   ════════════════════════════════════════════════════════ */

'use strict';

/* ── Navigation ─────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const burger   = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

/* ── Audio Player ────────────────────────────────────────── */
const audio         = document.getElementById('audioPlayer');
const playBtn       = document.getElementById('playBtn');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const progressFill  = document.getElementById('progressFill');
const progressTrack = document.getElementById('progressTrack');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl   = document.getElementById('totalTime');
const playerCard    = document.getElementById('playerCard');
const playerTrackEl = document.getElementById('playerTrack');
const iconPlay      = playBtn.querySelector('.icon-play');
const iconPause     = playBtn.querySelector('.icon-pause');
const playlistItems = document.querySelectorAll('.playlist-item');

const tracks = [
  { title: 'Te voilà',                    src: 'Te voilà.mp3' },
  { title: '50 bougies au compteur',      src: '50 bougies au compteur.mp3' },
  { title: 'Je te choisis encore',        src: 'Je te choisis encore.mp3' },
  { title: 'Là Où Tu Sais',              src: 'Là Où Tu Sais.mp3' },
  { title: 'Enfin en congé définitif',    src: 'Enfin en congé définitif.mp3' },
];

let currentIndex = 0;

function formatTime(s) {
  if (isNaN(s) || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function setPlaying(playing) {
  iconPlay.style.display  = playing ? 'none' : '';
  iconPause.style.display = playing ? '' : 'none';
  playerCard.classList.toggle('playing', playing);
}

function loadTrack(index, autoplay = false) {
  currentIndex = index;
  const t = tracks[index];
  audio.src = t.src;
  playerTrackEl.textContent = t.title;
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  totalTimeEl.textContent = '—:——';
  setPlaying(false);

  // Update playlist active state
  playlistItems.forEach(item => {
    item.classList.toggle('active', parseInt(item.dataset.index) === index);
  });

  if (autoplay) {
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }
}

// Preload durations for all tracks
tracks.forEach((t, i) => {
  const tmp = new Audio();
  tmp.preload = 'metadata';
  tmp.src = t.src;
  tmp.addEventListener('loadedmetadata', () => {
    const el = document.getElementById(`dur-${i}`);
    if (el) el.textContent = formatTime(tmp.duration);
  });
});

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('ended', () => {
  // Auto-play next track
  if (currentIndex < tracks.length - 1) {
    loadTrack(currentIndex + 1, true);
  } else {
    setPlaying(false);
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
  }
});

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().then(() => setPlaying(true)).catch(err => {
      console.warn('Lecture audio impossible :', err);
    });
  } else {
    audio.pause();
    setPlaying(false);
  }
});

prevBtn.addEventListener('click', () => {
  // If more than 3s played, restart current; otherwise go to previous
  if (audio.currentTime > 3 && !audio.paused) {
    audio.currentTime = 0;
  } else {
    const prev = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(prev, !audio.paused);
  }
});

nextBtn.addEventListener('click', () => {
  const next = (currentIndex + 1) % tracks.length;
  loadTrack(next, !audio.paused);
});

// Playlist item click
playlistItems.forEach(item => {
  item.addEventListener('click', () => {
    const idx = parseInt(item.dataset.index);
    if (idx === currentIndex) {
      // Toggle play/pause
      if (audio.paused) {
        audio.play().then(() => setPlaying(true)).catch(() => {});
      } else {
        audio.pause(); setPlaying(false);
      }
    } else {
      loadTrack(idx, true);
    }
  });
});

// Progress bar interaction
progressTrack.addEventListener('click', e => {
  if (!audio.duration) return;
  const rect = progressTrack.getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
});

let dragging = false;
progressTrack.addEventListener('mousedown', () => { dragging = true; });
document.addEventListener('mousemove', e => {
  if (!dragging || !audio.duration) return;
  const rect = progressTrack.getBoundingClientRect();
  const pct  = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  progressFill.style.width = (pct * 100) + '%';
  currentTimeEl.textContent = formatTime(pct * audio.duration);
});
document.addEventListener('mouseup', e => {
  if (!dragging) return;
  dragging = false;
  if (!audio.duration) return;
  const rect = progressTrack.getBoundingClientRect();
  const pct  = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
});

/* ── Multi-step Form ─────────────────────────────────────── */
const form        = document.getElementById('orderForm');
const formSuccess = document.getElementById('formSuccess');
const formSteps   = form.querySelectorAll('.form-step');
const progSteps   = form.querySelectorAll('.prog-step');

let currentStep = 1;

function goToStep(n) {
  // Hide all steps
  formSteps.forEach(s => s.classList.remove('active'));
  // Show target
  const target = form.querySelector(`.form-step[data-step="${n}"]`);
  if (target) {
    target.classList.add('active');
    currentStep = n;
  }
  // Update progress indicators
  progSteps.forEach(ps => {
    const s = parseInt(ps.dataset.step);
    ps.classList.remove('active', 'done');
    if (s === n)   ps.classList.add('active');
    if (s < n)     ps.classList.add('done');
  });
  // Scroll form into view smoothly
  const section = document.getElementById('commander');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Next buttons
form.querySelectorAll('.btn-next').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = parseInt(btn.dataset.next);
    // Basic validation for step 1: occasion must be selected
    if (currentStep === 1) {
      const occasion = form.querySelector('input[name="occasion"]:checked');
      if (!occasion) {
        highlightRequired(form.querySelector('.occasions'));
        return;
      }
    }
    // Basic validation for step 2
    if (currentStep === 2) {
      const dest  = form.querySelector('#destinataire');
      const hist  = form.querySelector('#histoire');
      if (!dest.value.trim()) { dest.focus(); dest.classList.add('error'); return; }
      if (!hist.value.trim()) { hist.focus(); hist.classList.add('error'); return; }
      dest.classList.remove('error');
      hist.classList.remove('error');
    }
    goToStep(next);
  });
});

// Previous buttons
form.querySelectorAll('.btn-prev').forEach(btn => {
  btn.addEventListener('click', () => {
    const prev = parseInt(btn.dataset.prev);
    goToStep(prev);
  });
});

// Remove error on input
form.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('error'));
});

function highlightRequired(container) {
  container.classList.add('shake');
  setTimeout(() => container.classList.remove('shake'), 500);
}

// Submit
form.addEventListener('submit', e => {
  e.preventDefault();

  // Validate step 3
  const style = form.querySelector('input[name="style"]:checked');
  const email = form.querySelector('#email');
  if (!style) { highlightRequired(form.querySelector('.styles')); return; }
  if (!email.value.trim() || !email.validity.valid) {
    email.focus(); email.classList.add('error'); return;
  }

  // Hide form, show success
  formSteps.forEach(s => { s.style.display = 'none'; });
  form.querySelector('.form-progress').style.display = 'none';
  formSuccess.classList.add('visible');
});

/* ── Reveal on Scroll ────────────────────────────────────── */
const revealEls = [];

function addReveal() {
  const selectors = [
    '.section-header',
    '.step',
    '.player-stage',
    '.temoignage',
    '.form-wrapper',
    '.apropos-layout',
  ];
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, j) => {
      el.classList.add('reveal');
      if (j > 0) el.classList.add(`reveal-delay-${Math.min(j, 3)}`);
      revealEls.push(el);
    });
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

function observeReveal() {
  revealEls.forEach(el => observer.observe(el));
}

/* ── Error input style ───────────────────────────────────── */
const errorStyle = document.createElement('style');
errorStyle.textContent = `
  input.error, textarea.error {
    border-color: rgba(220, 80, 80, 0.6) !important;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60%  { transform: translateX(-6px); }
    40%, 80%  { transform: translateX(6px); }
  }
  .shake { animation: shake 0.4s ease; }
`;
document.head.appendChild(errorStyle);

/* ── Offres → Formulaire ─────────────────────────────────── */
document.querySelectorAll('.offre-cta[data-offre]').forEach(btn => {
  btn.addEventListener('click', () => {
    const offre = btn.dataset.offre;
    const input = document.getElementById('offreInput');
    if (input) input.value = offre;
    // Affiche un badge dans le titre du formulaire
    const titre = document.querySelector('#commander .section-header h2');
    if (titre && offre) {
      titre.innerHTML = `Offre <em>${offre}</em><br>commence ici`;
    }
  });
});


/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  addReveal();
  observeReveal();
});
