/* ═══════════════════════════════════════════════
   PIE-1 · main.js
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR scroll shadow + active link ──────────
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id], header');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    // Active nav link
    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active', a.dataset.section === current);
    });
  });

  // ── NAVBAR mobile toggle ─────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.querySelector('.nav-links');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  // ── SLIDESHOW ────────────────────────────────────
  const track     = document.getElementById('slidesTrack');
  const slides    = track ? track.querySelectorAll('.slide') : [];
  const slideNum  = document.getElementById('slideNum');
  const slideTotal= document.getElementById('slideTotal');
  const prevBtn   = document.getElementById('slidePrev');
  const nextBtn   = document.getElementById('slideNext');
  let   current   = 0;

  if (slides.length) {
    slideTotal.textContent = slides.length;
    const goto = (n) => {
      current = Math.max(0, Math.min(n, slides.length - 1));
      track.style.transform = `translateX(-${current * 100}%)`;
      slideNum.textContent = current + 1;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === slides.length - 1;
    };
    prevBtn.addEventListener('click', () => goto(current - 1));
    nextBtn.addEventListener('click', () => goto(current + 1));
    // Keyboard navigation when slideshow is visible
    document.addEventListener('keydown', (e) => {
      const rect = track.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowRight') goto(current + 1);
        if (e.key === 'ArrowLeft')  goto(current - 1);
      }
    });
    // Touch / swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) goto(current + (dx < 0 ? 1 : -1));
    });
    goto(0);
  }

  // ── SECTION 2 TABS ───────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + id);
      if (panel) panel.classList.add('active');
    });
  });

  // ── MAP SECTION TABS ─────────────────────────────
  document.querySelectorAll('.map-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.maptab;
      document.querySelectorAll('.map-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.map-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('maptab-' + tab).classList.add('active');
      if (tab === 'kml' && !mapInitialized) initMap();
    });
  });

  // ── INE MAP PDF ──────────────────────────────────
  // Try to load assets/mapa_ine_pie1.pdf automatically
  const inePlaceholder = document.getElementById('inePlaceholder');
  const ineFrame       = document.getElementById('ineMapFrame');
  const pdfPath        = 'assets/mapa_ine_pie1.pdf';

  fetch(pdfPath, { method: 'HEAD' })
    .then(r => {
      if (r.ok) {
        inePlaceholder.classList.add('hidden');
        ineFrame.src = pdfPath;
        ineFrame.classList.remove('hidden');
      }
    })
    .catch(() => { /* placeholder stays visible */ });

  // ── LEAFLET MAP ──────────────────────────────────
  let map = null;
  let mapInitialized = false;
  let layerGroups = {};
  let allLayers = [];

  const COLORS = {
    salud:       '#1B4F72',
    gastronomia: '#0D9488',
    hospedaje:   '#F4A261',
    ocio:        '#E76F51',
    universidad: '#457B9D',
    default:     '#64748B',
  };

  // Cochabamba city center coords
  const COCHABAMBA = [-17.3935, -66.1568];

  function initMap() {
    if (mapInitialized) return;
    mapInitialized = true;

    map = L.map('map').setView(COCHABAMBA, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add a reference rectangle for the PIE-1 polygon area (approximate)
    const pie1bounds = [
      [-17.406, -66.167],
      [-17.382, -66.148],
    ];
    L.rectangle(pie1bounds, {
      color: '#1B4F72', weight: 2.5, fillColor: '#1B4F72', fillOpacity: 0.06, dashArray: '6 4'
    }).addTo(map).bindPopup('<strong>Polígono PIE-1</strong><br/>Distrito 12 · Adela Zamudio');

    // Initialize layer groups
    ['salud', 'gastronomia', 'hospedaje', 'ocio', 'universidad', 'default'].forEach(t => {
      layerGroups[t] = L.layerGroup().addTo(map);
    });

    // KML file input handler
    document.getElementById('kmlFile').addEventListener('change', handleKMLUpload);

    // Try auto-loading KML from assets
    fetch('data/pie1_mapeo.kml')
      .then(r => r.ok ? r.text() : null)
      .then(text => { if (text) loadKMLText(text, 'pie1_mapeo.kml'); })
      .catch(() => {});
  }

  function handleKMLUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('kmlFilename').textContent = file.name;
    const reader = new FileReader();
    reader.onload = ev => loadKMLText(ev.target.result, file.name);
    reader.readAsText(file);
  }

  function loadKMLText(kmlText, filename) {
    // Clear existing layers
    Object.values(layerGroups).forEach(g => g.clearLayers());
    allLayers = [];

    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, 'text/xml');
    const placemarks = kmlDoc.querySelectorAll('Placemark');

    const counts = {};
    const bounds = [];

    placemarks.forEach(pm => {
      const name = pm.querySelector('name')?.textContent?.trim() || 'Sin nombre';
      const desc = pm.querySelector('description')?.textContent?.trim() || '';
      const coords = pm.querySelector('coordinates')?.textContent?.trim();

      if (!coords) return;

      // Detect type from name/description
      const type = detectType(name + ' ' + desc);
      const color = COLORS[type] || COLORS.default;
      counts[type] = (counts[type] || 0) + 1;

      // Parse coordinates (KML: lon,lat,alt)
      const parts = coords.trim().split(/\s+/)[0].split(',');
      if (parts.length < 2) return;
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      if (isNaN(lat) || isNaN(lng)) return;

      bounds.push([lat, lng]);

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:14px;height:14px;border-radius:50%;
          background:${color};border:2.5px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,.3)">
        </div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([lat, lng], { icon })
        .bindPopup(`<strong>${name}</strong><br/><span style="color:#64748B;font-size:.85rem">${getTypeLabel(type)}</span>${desc ? '<br/><small>' + desc.substring(0, 150) + '</small>' : ''}`)
        .bindTooltip(name, { direction: 'top', offset: [0, -8] });

      marker._type = type;
      layerGroups[type] ? layerGroups[type].addLayer(marker) : layerGroups.default.addLayer(marker);
      allLayers.push(marker);
    });

    if (bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40] });

    // Show stats
    showKMLStats(counts, placemarks.length);
    document.getElementById('kmlFilename').textContent = filename + ` (${placemarks.length} establecimientos)`;
  }

  function detectType(text) {
    text = text.toLowerCase();
    if (/salud|cl[ií]nica|hospital|laboratorio|consultorio|m[eé]dic|farmacia|odont|imagen/.test(text)) return 'salud';
    if (/restaurante|gastronom[ií]a|comida|caf[eé]|cocina|pizz|sushi|buffet/.test(text)) return 'gastronomia';
    if (/hotel|hospedaje|apart|hostal|alojamiento|hospedería/.test(text)) return 'hospedaje';
    if (/bar|discoteca|ocio|pub|karaoke|entretenimiento|noche/.test(text)) return 'ocio';
    if (/universidad|instituto|ipee|unifranz|educaci[oó]n|colegio|academia/.test(text)) return 'universidad';
    return 'default';
  }

  function getTypeLabel(type) {
    const labels = { salud: '🏥 Salud', gastronomia: '🍽 Gastronomía', hospedaje: '🏨 Hospedaje', ocio: '🎭 Ocio', universidad: '🎓 Universidad', default: '📍 Otro' };
    return labels[type] || '📍 Otro';
  }

  function showKMLStats(counts, total) {
    const statsEl = document.getElementById('kmlStats');
    const content = document.getElementById('kmlStatsContent');
    const typeLabels = { salud: '🏥 Salud', gastronomia: '🍽 Gastro', hospedaje: '🏨 Hospedaje', ocio: '🎭 Ocio', universidad: '🎓 Univ.', default: '📍 Otro' };
    let html = `<div class="kml-stats-grid">
      <div class="kml-stat-item">
        <div class="kml-stat-num">${total}</div>
        <div class="kml-stat-label">Total establecimientos</div>
      </div>`;
    Object.entries(counts).forEach(([type, n]) => {
      html += `<div class="kml-stat-item">
        <div class="kml-stat-num">${n}</div>
        <div class="kml-stat-label">${typeLabels[type] || type}</div>
      </div>`;
    });
    html += '</div>';
    content.innerHTML = html;
    statsEl.classList.remove('hidden');
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;

      if (!map || !mapInitialized) return;

      Object.entries(layerGroups).forEach(([t, group]) => {
        if (type === 'all' || type === t) {
          map.addLayer(group);
        } else {
          map.removeLayer(group);
        }
      });
    });
  });

  // ── SMOOTH SCROLL for CTA buttons ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── ANIMATE bars on scroll ────────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.cov-fill, .nse-fill').forEach(el => {
          el.style.width = el.style.width; // trigger reflow
        });
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.tab-panel').forEach(p => observer.observe(p));

});
