// StreetCulto CRM — app.js

// ── AUTH ─────────────────────────────────────────────────
// Para cambiar credenciales, edita este arreglo.
const USERS = [
  { user: 'admin',  pass: 'streetculto2026' },
  { user: 'ventas', pass: 'sc2026' },
];

const SESSION_KEY = 'crm-sc-session';

function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

function login(username, password) {
  return USERS.some(u => u.user === username && u.pass === password);
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'grid';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').classList.add('hidden');
}

// ── STORAGE ──────────────────────────────────────────────
const STORAGE_KEY = 'crm-streetculto-v1';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── Image utils ─────────────────────────────────────────
function resizeImage(file, maxPx = 420, quality = 0.72) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxPx || h > maxPx) {
          if (w > h) { h = Math.round(h * maxPx / w); w = maxPx; }
          else       { w = Math.round(w * maxPx / h); h = maxPx; }
        }
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Config ───────────────────────────────────────────────
const SEGMENTS = {
  vip:       { label: 'VIP' },
  dulces:    { label: 'Dulces' },
  frescos:   { label: 'Frescos' },
  reactivar: { label: 'Reactivar' },
};

const PERFUME_COLORS = ['amber', 'citrus', 'rose', 'blue', 'green', 'purple'];

const STATUS_ORDER  = ['interesado', 'apartado', 'pagado'];
const STATUS_LABELS = { interesado: 'Interesado', apartado: 'Apartado', pagado: 'Pagado' };

const SECTION_META = {
  panel:    { eyebrow: 'Panel general',      title: 'Seguimiento de clientes y perfumes' },
  clientes: { eyebrow: 'Directorio',         title: 'Clientes' },
  perfumes: { eyebrow: 'Inventario',         title: 'Perfumes disponibles' },
  whatsapp: { eyebrow: 'Mensajería',         title: 'Envío por WhatsApp' },
  ventas:   { eyebrow: 'Pipeline de ventas', title: 'Oportunidades' },
  credito:  { eyebrow: 'Crédito y cobranza', title: 'Financiamiento' },
};

// ── CRÉDITO ───────────────────────────────────────────────
const LOAN_STATUS = {
  activo:    { label: 'Activo',    color: '#4ea6e0' },
  atrasado:  { label: 'Atrasado',  color: '#e05050' },
  liquidado: { label: 'Liquidado', color: '#1f7a64' },
};

function getLoanStatus(loan) {
  const pending = loan.totalAmount - loan.paidAmount;
  if (pending <= 0) return 'liquidado';
  const today = new Date().toISOString().split('T')[0];
  if (loan.dueDate && loan.dueDate < today) return 'atrasado';
  return loan.status || 'activo';
}

// ── Sample data ──────────────────────────────────────────
const SAMPLE = {
  clients: [
    { id: 'c1', name: 'Mariana Ruiz',     phone: '4491234567', segment: 'vip',       totalSpent: 18900, purchases: 12, lastPurchase: '2026-05-10', notes: '' },
    { id: 'c2', name: 'Sofía Mendoza',    phone: '4497654321', segment: 'dulces',    totalSpent: 5400,  purchases: 4,  lastPurchase: '2026-04-22', notes: '' },
    { id: 'c3', name: 'Carlos Herrera',   phone: '4493456789', segment: 'frescos',   totalSpent: 2980,  purchases: 3,  lastPurchase: '2026-03-15', notes: '' },
    { id: 'c4', name: 'Daniela López',    phone: '4491111222', segment: 'reactivar', totalSpent: 1450,  purchases: 1,  lastPurchase: '2026-01-20', notes: '' },
    { id: 'c5', name: 'Roberto Sánchez',  phone: '4492222333', segment: 'vip',       totalSpent: 12600, purchases: 9,  lastPurchase: '2026-05-05', notes: '' },
    { id: 'c6', name: 'Valentina Torres', phone: '4494444555', segment: 'dulces',    totalSpent: 3200,  purchases: 2,  lastPurchase: '2026-04-01', notes: '' },
  ],
  perfumes: [
    { id: 'p1', name: 'Aura Nocturna',          description: 'Ámbar, vainilla oscura y madera suave. Ideal para noche.', price: 1450, stock: 5, colorClass: 'amber' },
    { id: 'p2', name: 'Citrus Club',             description: 'Salida fresca de toronja, limpio y enérgico para diario.', price: 980,  stock: 8, colorClass: 'citrus' },
    { id: 'p3', name: 'Rose Vice',               description: 'Rosa moderna, almizcle y un fondo dulce elegante.',        price: 1250, stock: 3, colorClass: 'rose' },
    { id: 'p4', name: 'Hugo Boss Bottled Night', description: 'Fresco, floral, lavanda. Aseñorado pero muy fresco.',      price: 1800, stock: 2, colorClass: 'blue' },
  ],
  sales: [
    { id: 's1', clientId: 'c1', clientName: 'Mariana Ruiz',    perfumeId: 'p1', perfumeName: 'Aura Nocturna',          amount: 1450, status: 'pagado',    date: '2026-05-10' },
    { id: 's2', clientId: 'c2', clientName: 'Sofía Mendoza',   perfumeId: 'p3', perfumeName: 'Rose Vice',              amount: 1250, status: 'apartado',  date: '2026-05-15' },
    { id: 's3', clientId: 'c3', clientName: 'Carlos Herrera',  perfumeId: 'p2', perfumeName: 'Citrus Club',            amount: 980,  status: 'interesado', date: '2026-05-17' },
    { id: 's4', clientId: 'c5', clientName: 'Roberto Sánchez', perfumeId: 'p4', perfumeName: 'Hugo Boss Bottled Night', amount: 1800, status: 'interesado', date: '2026-05-18' },
    { id: 's5', clientId: 'c4', clientName: 'Daniela López',   perfumeId: 'p1', perfumeName: 'Aura Nocturna',          amount: 1450, status: 'interesado', date: '2026-05-19' },
    { id: 's6', clientId: 'c1', clientName: 'Mariana Ruiz',    perfumeId: 'p2', perfumeName: 'Citrus Club',            amount: 980,  status: 'pagado',    date: '2026-05-08' },
    { id: 's7', clientId: 'c5', clientName: 'Roberto Sánchez', perfumeId: 'p3', perfumeName: 'Rose Vice',              amount: 1250, status: 'pagado',    date: '2026-05-05' },
  ],
  messagesSent: 47,
  customMessages: {},
  loans: [
    {
      id: 'l1', clientId: 'c2', clientName: 'Sofía Mendoza',
      perfumeId: 'p1', perfumeName: 'Aura Nocturna',
      totalAmount: 1450, paidAmount: 700,
      date: '2026-05-01', dueDate: '2026-06-15',
      notes: 'Paga los 15 y fin de mes',
      payments: [{ id: 'pay1', date: '2026-05-01', amount: 700, notes: 'Enganche' }],
      status: 'activo',
    },
    {
      id: 'l2', clientId: 'c4', clientName: 'Daniela López',
      perfumeId: 'p3', perfumeName: 'Rose Vice',
      totalAmount: 1250, paidAmount: 0,
      date: '2026-05-10', dueDate: '2026-05-20',
      notes: '',
      payments: [],
      status: 'atrasado',
    },
  ],
};

// ── State ────────────────────────────────────────────────
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(SAMPLE));
    const s = JSON.parse(raw);
    // Migración: "respondio" → "interesado" (pipeline simplificado a 3 etapas)
    if (s.sales) s.sales.forEach(sale => {
      if (sale.status === 'respondio') sale.status = 'interesado';
    });
    // Asegurar que customMessages y loans existen
    if (!s.customMessages) s.customMessages = {};
    if (!s.loans) s.loans = [];
    return s;
  } catch {
    return JSON.parse(JSON.stringify(SAMPLE));
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Formatters ───────────────────────────────────────────
function fmt(n) {
  return '$' + Number(n).toLocaleString('es-MX');
}

function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function segBadge(seg) {
  const s = SEGMENTS[seg];
  if (!s) return '';
  return `<span class="badge seg-${seg}">${s.label}</span>`;
}

// ── Navigation ───────────────────────────────────────────
let currentSection = 'panel';

function navigate(section) {
  currentSection = section;

  // Desktop sidebar nav
  document.querySelectorAll('.nav-item[data-nav]').forEach(b =>
    b.classList.toggle('active', b.dataset.nav === section));

  // Mobile bottom nav
  document.querySelectorAll('.mob-nav-item[data-nav]').forEach(b =>
    b.classList.toggle('active', b.dataset.nav === section));

  const meta = SECTION_META[section] || {};
  document.getElementById('section-eyebrow').textContent = meta.eyebrow || '';
  document.getElementById('section-title').textContent   = meta.title   || '';

  document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
  document.getElementById(`section-${section}`).classList.add('active');

  // Scroll workspace al tope
  const ws = document.querySelector('.workspace');
  if (ws) ws.scrollTo({ top: 0, behavior: 'instant' });

  renderSection(section);
}

function renderSection(s) {
  switch (s) {
    case 'panel':    renderPanel();         break;
    case 'clientes': renderClientes();      break;
    case 'perfumes': renderPerfumes();      break;
    case 'whatsapp': renderWhatsapp();      break;
    case 'ventas':   renderVentas();        break;
    case 'credito':  renderCredito();       break;
  }
}

// ── PANEL ────────────────────────────────────────────────
let panelPeriod = 'mes';

function salesByPeriod() {
  const now = new Date();
  if (panelPeriod === 'todo') return state.sales;
  if (panelPeriod === '7d') {
    const since = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return state.sales.filter(s => s.date >= since);
  }
  // mes
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return state.sales.filter(s => s.date.startsWith(month));
}

const PERIOD_LABELS = { mes: 'Este mes', '7d': 'Últimos 7 días', todo: 'Todo' };

function renderPanel() {
  const el      = document.getElementById('section-panel');
  const sales   = salesByPeriod();

  const paid    = sales.filter(s => s.status === 'pagado');
  const paidAmt = paid.reduce((sum, s) => sum + s.amount, 0);

  const bestClient  = [...state.clients].sort((a, b) => b.totalSpent - a.totalSpent)[0];
  const recentSales = [...sales].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const counts      = Object.fromEntries(STATUS_ORDER.map(s => [s, 0]));
  sales.forEach(s => { if (counts[s.status] !== undefined) counts[s.status]++; });

  const firstPerfume = state.perfumes[0];
  const firstClient  = state.clients.find(c => c.segment === 'reactivar') || state.clients[0];
  const previewMsg   = firstPerfume && firstClient
    ? `Hola ${firstClient.name.split(' ')[0]}, nos llegó <strong>${firstPerfume.name}</strong>.<br><br>${firstPerfume.description}<br><br>Precio: ${fmt(firstPerfume.price)}. ¿Te aparto uno?`
    : 'Agrega clientes y perfumes para generar mensajes.';

  // Pills de segmento
  const segCounts = Object.fromEntries(Object.keys(SEGMENTS).map(k => [k, 0]));
  state.clients.forEach(c => { if (segCounts[c.segment] !== undefined) segCounts[c.segment]++; });
  const SEG_STYLES = {
    vip:       { bg: 'rgba(196,123,56,0.18)',  color: '#7a4a18' },
    dulces:    { bg: 'rgba(212,114,168,0.18)', color: '#7a2058' },
    frescos:   { bg: 'rgba(31,122,100,0.18)',  color: '#0d4a3c' },
    reactivar: { bg: 'rgba(136,136,136,0.18)', color: '#555' },
  };

  el.innerHTML = `
    <div class="pills-scroll" style="margin-bottom:14px">
      ${Object.entries(PERIOD_LABELS).map(([k, label]) =>
        `<button class="period-pill${panelPeriod === k ? ' active' : ''}" data-period="${k}">${label}</button>`
      ).join('')}
    </div>

    <div class="seg-summary-pills">
      ${Object.entries(SEGMENTS).map(([k, s]) => {
        const st = SEG_STYLES[k] || {};
        return `<button class="seg-sum-pill" data-seg-nav="${k}"
          style="background:${st.bg};color:${st.color}">
          ${s.label} <span class="pill-num">(${segCounts[k]})</span>
        </button>`;
      }).join('')}
    </div>

    <section class="metrics-grid">
      <article class="metric-card">
        <span>Ventas cobradas</span>
        <strong>${fmt(paidAmt)}</strong>
        <small>${paid.length} venta${paid.length !== 1 ? 's' : ''} · ${PERIOD_LABELS[panelPeriod].toLowerCase()}</small>
      </article>
      <article class="metric-card highlight">
        <span>Mejor cliente</span>
        <strong>${bestClient ? bestClient.name.split(' ')[0] : '—'}</strong>
        <small>${bestClient ? `${bestClient.purchases} compras · ${fmt(bestClient.totalSpent)}` : ''}</small>
      </article>
      <article class="metric-card">
        <span>Mensajes enviados</span>
        <strong>${state.messagesSent}</strong>
        <small>${sales.filter(s => s.status !== 'interesado').length} oportunidades activas</small>
      </article>
      <article class="metric-card">
        <span>Perfumes activos</span>
        <strong>${state.perfumes.length}</strong>
        <small>${state.clients.length} clientes</small>
      </article>
    </section>

    <section class="content-grid">
      <article class="panel table-panel large-panel">
        <div class="panel-heading" style="padding:18px 18px 0">
          <div><span class="eyebrow">Actividad reciente</span><h2>Últimas oportunidades</h2></div>
          <button class="ghost-button" type="button" onclick="navigate('ventas')">Ver kanban</button>
        </div>
        <table class="data-table">
          <thead><tr><th>Cliente</th><th>Perfume</th><th>Monto</th><th>Estado</th><th>Fecha</th></tr></thead>
          <tbody>
            ${recentSales.length ? recentSales.map(s => `
              <tr>
                <td>${s.clientName}</td>
                <td>${s.perfumeName}</td>
                <td>${fmt(s.amount)}</td>
                <td><span class="status-badge status-${s.status}">${STATUS_LABELS[s.status] || s.status}</span></td>
                <td>${fmtDate(s.date)}</td>
              </tr>`).join('') : `<tr><td colspan="5" class="empty-row">Sin oportunidades en este período</td></tr>`}
          </tbody>
        </table>
        <div class="rs-list">
          ${recentSales.length ? recentSales.map(s => `
            <div class="rs-item">
              <div class="rs-info">
                <strong>${escHtml(s.clientName)}</strong>
                <span>${escHtml(s.perfumeName)}</span>
              </div>
              <div class="rs-right">
                <strong>${fmt(s.amount)}</strong>
                <span class="status-badge status-${s.status}">${STATUS_LABELS[s.status]}</span>
              </div>
            </div>`).join('')
          : `<p class="muted-note" style="padding:16px;text-align:center">Sin oportunidades en este período</p>`}
        </div>
      </article>

      <div class="panel-stack">
        <article class="panel">
          <div class="panel-heading compact">
            <div><span class="eyebrow">WhatsApp</span><h2>Mensaje rápido</h2></div>
          </div>
          <div class="phone-preview">
            <div class="chat-bubble">${previewMsg}</div>
            <button class="primary-button wide" type="button" onclick="navigate('whatsapp')">Preparar envío</button>
          </div>
        </article>

        <article class="panel">
          <div class="panel-heading compact">
            <div><span class="eyebrow">Pipeline</span><h2>Estado actual</h2></div>
          </div>
          <div class="pipeline">
            ${STATUS_ORDER.map(s => `
              <div style="cursor:pointer" onclick="navigate('ventas')" title="Ver en kanban">
                <span>${STATUS_LABELS[s]}</span>
                <strong>${counts[s]}</strong>
              </div>`).join('')}
          </div>
        </article>
      </div>
    </section>`;

  // Period pills
  el.querySelectorAll('.period-pill').forEach(btn =>
    btn.addEventListener('click', () => { panelPeriod = btn.dataset.period; renderPanel(); }));

  // Segment pills → navegar a clientes con filtro
  el.querySelectorAll('[data-seg-nav]').forEach(btn =>
    btn.addEventListener('click', () => { clientFilter = btn.dataset.segNav; navigate('clientes'); }));

  updateSidebarSuggestion();
}

function updateSidebarSuggestion() {
  const reactivar = state.clients.filter(c => c.segment === 'reactivar').length;
  const dulces    = state.clients.filter(c => c.segment === 'dulces').length;
  const frescos   = state.clients.filter(c => c.segment === 'frescos').length;

  let title, desc;
  if (reactivar > 0) {
    title = 'Reactivar clientes';
    desc  = `${reactivar} cliente${reactivar > 1 ? 's' : ''} sin compra en más de 90 días. Ofrece una novedad.`;
  } else if (dulces > 0) {
    title = 'Campaña dulces';
    desc  = `${dulces} cliente${dulces > 1 ? 's' : ''} que prefieren vainilla y gourmand.`;
  } else {
    title = 'Campaña frescos';
    desc  = `${frescos} cliente${frescos > 1 ? 's' : ''} que prefieren fragancias cítricas.`;
  }

  document.getElementById('suggestion-title').textContent = title;
  document.getElementById('suggestion-desc').textContent  = desc;
}

// ── CLIENTES ─────────────────────────────────────────────
let clientFilter = 'all';
let clientSearch = '';

function renderClientes() {
  const el    = document.getElementById('section-clientes');
  const isMob = window.innerWidth <= 640;

  // Calcular deuda activa por cliente
  const debtorMap = {};
  (state.loans || []).forEach(l => {
    if (getLoanStatus(l) !== 'liquidado') {
      const pending = l.totalAmount - l.paidAmount;
      if (pending > 0) debtorMap[l.clientId] = (debtorMap[l.clientId] || 0) + pending;
    }
  });

  // Clientes frescos/dulces sin compra en 60+ días → badge "Reactivar"
  const sixtyDaysAgo = new Date(Date.now() - 60 * 864e5).toISOString().split('T')[0];
  const needsReactivar = c =>
    (c.segment === 'frescos' || c.segment === 'dulces') &&
    (!c.lastPurchase || c.purchases === 0 || c.lastPurchase < sixtyDaysAgo);

  const list = state.clients.filter(c => {
    const okSeg = clientFilter === 'all'
      || (clientFilter === 'deudor'    ? !!debtorMap[c.id]
        : clientFilter === 'reactivar' ? (c.segment === 'reactivar' || needsReactivar(c))
        : c.segment === clientFilter);
    const okSearch = !clientSearch
      || c.name.toLowerCase().includes(clientSearch.toLowerCase())
      || c.phone.includes(clientSearch);
    return okSeg && okSearch;
  });

  const WA_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.526 5.862L0 24l6.293-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.371l-.36-.213-3.733.885.936-3.618-.234-.372A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>`;

  el.innerHTML = `
    <div class="section-toolbar">
      <div class="search-wrap">
        <input class="search-input" type="search" placeholder="Buscar…" value="${escHtml(clientSearch)}" id="client-search" />
      </div>
      <div class="filter-tabs">
        ${[['all','Todos'],['vip','VIP'],['dulces','Dulces'],['frescos','Frescos'],['reactivar','Reactivar'],['deudor','💸 Deudores']].map(([v,l]) =>
          `<button class="filter-tab${clientFilter === v ? ' active' : ''}" data-filter="${v}">${l}</button>`).join('')}
      </div>
      <button class="primary-button" type="button" onclick="openClientModal()">+ Nuevo</button>
    </div>

    ${isMob ? `
      <div class="ccm-list">
        ${list.length ? list.map(c => `
          <article class="ccm">
            <div class="ccm-avatar seg-${c.segment}">${initials(c.name)}</div>
            <div class="ccm-body">
              <div class="ccm-name-row">
                <strong>${escHtml(c.name)}</strong>
                ${segBadge(c.segment)}
                ${needsReactivar(c) && c.segment !== 'reactivar' ? `<span class="badge seg-reactivar">Reactivar</span>` : ''}
                ${debtorMap[c.id] ? `<span class="badge debtor-badge">💸 ${fmt(debtorMap[c.id])}</span>` : ''}
              </div>
              <div class="ccm-stats">
                ${c.purchases} compra${c.purchases !== 1 ? 's' : ''} · ${fmt(c.totalSpent)}
                ${c.lastPurchase ? `<span class="muted-note"> · ${fmtDate(c.lastPurchase)}</span>` : ''}
              </div>
              <a class="ccm-wa" href="https://wa.me/52${c.phone}" target="_blank" rel="noopener">
                ${WA_SVG} ${c.phone}
              </a>
            </div>
            <div class="ccm-btns">
              <button class="icon-btn" data-edit-client="${c.id}">✏️</button>
              <button class="icon-btn" data-del-client="${c.id}">🗑️</button>
            </div>
          </article>`).join('')
        : `<p class="muted-note" style="padding:28px;text-align:center">Sin resultados</p>`}
      </div>
    ` : `
      <article class="panel table-panel client-table-desktop">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th><th>Teléfono</th><th>Segmento</th>
              <th>Compras</th><th>Total gastado</th><th>Última compra</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${list.length ? list.map(c => `
              <tr>
                <td>
                  <strong>${escHtml(c.name)}</strong>
                  ${debtorMap[c.id] ? `<span class="badge debtor-badge" style="margin-left:6px">💸 ${fmt(debtorMap[c.id])}</span>` : ''}
                </td>
                <td><a class="phone-link" href="https://wa.me/52${c.phone}" target="_blank" rel="noopener">${c.phone}</a></td>
                <td style="display:flex;gap:4px;flex-wrap:wrap;align-items:center">
                  ${segBadge(c.segment)}
                  ${needsReactivar(c) && c.segment !== 'reactivar' ? `<span class="badge seg-reactivar">Reactivar</span>` : ''}
                  ${debtorMap[c.id] ? `<span class="badge debtor-badge">💸</span>` : ''}
                </td>
                <td>${c.purchases}</td>
                <td>${fmt(c.totalSpent)}</td>
                <td>${fmtDate(c.lastPurchase)}</td>
                <td class="row-actions">
                  <button class="icon-btn" data-edit-client="${c.id}">✏️</button>
                  <button class="icon-btn" data-del-client="${c.id}">🗑️</button>
                </td>
              </tr>`).join('')
            : `<tr><td colspan="7" class="empty-row">Sin resultados</td></tr>`}
          </tbody>
        </table>
      </article>
    `}`;

  el.querySelector('#client-search').addEventListener('input', e => {
    clientSearch = e.target.value;
    renderClientes();
  });

  el.querySelectorAll('[data-filter]').forEach(btn =>
    btn.addEventListener('click', () => { clientFilter = btn.dataset.filter; renderClientes(); }));

  el.querySelectorAll('[data-edit-client]').forEach(btn =>
    btn.addEventListener('click', () => openClientModal(btn.dataset.editClient)));

  el.querySelectorAll('[data-del-client]').forEach(btn =>
    btn.addEventListener('click', () => deleteClient(btn.dataset.delClient)));
}

function openClientModal(id) {
  const c    = id ? state.clients.find(x => x.id === id) : null;
  const edit = !!c;
  const today = new Date().toISOString().split('T')[0];

  showModal(`
    <h2>${edit ? 'Editar cliente' : 'Nuevo cliente'}</h2>
    <form id="client-form" class="modal-form">
      <label>Nombre<input name="name" required value="${escHtml(c?.name || '')}" /></label>
      <label>Teléfono (sin código país)<input name="phone" type="tel" required value="${escHtml(c?.phone || '')}" /></label>
      <label>Segmento
        <select name="segment">
          ${Object.entries(SEGMENTS).map(([v,s]) =>
            `<option value="${v}"${c?.segment === v ? ' selected' : ''}>${s.label}</option>`).join('')}
        </select>
      </label>
      ${edit ? `
        <label>Compras<input name="purchases" type="number" min="0" value="${c.purchases}" /></label>
        <label>Total gastado (MXN)<input name="totalSpent" type="number" min="0" value="${c.totalSpent}" /></label>
        <label>Última compra<input name="lastPurchase" type="date" value="${c.lastPurchase || ''}" /></label>
      ` : `
        <div class="first-sale-panel">
          <div class="first-sale-header">
            <span class="modal-field-label">Primera venta</span>
            <span class="first-sale-hint">¿Qué compró hoy?</span>
          </div>
          <label>Perfume
            <select name="salePerfumeId" id="sale-perfume-sel">
              <option value="">— Sin venta por ahora —</option>
              ${state.perfumes.map(p =>
                `<option value="${p.id}" data-price="${p.price}">${escHtml(p.name)}</option>`).join('')}
            </select>
          </label>
          <div id="sale-price-block" class="sale-price-block hidden">
            <label>Precio de lista
              <input name="saleListPrice" id="sale-list-price" type="number" readonly tabindex="-1" />
            </label>
            <label>Monto real cobrado
              <input name="saleRealPrice" id="sale-real-price" type="number" min="0" required />
            </label>
            <div id="sale-diff-badge" class="sale-diff-badge"></div>
          </div>
          <label>Fecha de venta
            <input name="saleDate" id="sale-date" type="date" value="${today}" />
          </label>
        </div>

        <div class="credito-toggle-row">
          <span>¿Registrar como deudor? 💸</span>
          <label class="ios-toggle">
            <input type="checkbox" id="credito-check" name="hasCredito" />
            <span class="ios-toggle-slider"></span>
          </label>
        </div>

        <div id="credito-panel" class="credito-inline-panel hidden">
          <div class="credito-panel-header">
            <span class="modal-field-label">Datos del crédito</span>
            <span class="first-sale-hint">💸 Se creará un adeudo activo</span>
          </div>
          <label>Perfume a crédito
            <select name="creditPerfumeId" id="credit-perf-sel">
              <option value="">— Mismo que la primera venta —</option>
              ${state.perfumes.map(p =>
                `<option value="${p.id}" data-price="${p.price}">${escHtml(p.name)} — ${fmt(p.price)}</option>`
              ).join('')}
            </select>
          </label>
          <label>Precio total acordado (MXN)
            <input name="creditTotal" id="credit-total" type="number" min="0" placeholder="0" />
          </label>
          <label>Enganche / primer pago (MXN)
            <input name="creditDown" type="number" min="0" value="0" placeholder="0 si no hay enganche" />
          </label>
          <label>Fecha límite de pago
            <input name="creditDue" type="date" value="${today}" />
          </label>
          <label>Notas del crédito
            <input name="creditNotes" type="text" placeholder="Ej. Paga los 15 y 30 de cada mes…" />
          </label>
        </div>
      `}
      <label>Notas<textarea name="notes" rows="2">${escHtml(c?.notes || '')}</textarea></label>
      <button class="primary-button" type="submit">${edit ? 'Guardar cambios' : 'Agregar cliente'}</button>
    </form>`);

  // ── Lógica del panel de primera venta ────────────────────
  if (!edit) {
    const perfSel   = document.getElementById('sale-perfume-sel');
    const priceBlock = document.getElementById('sale-price-block');
    const listInput = document.getElementById('sale-list-price');
    const realInput = document.getElementById('sale-real-price');
    const diffBadge = document.getElementById('sale-diff-badge');

    function updateDiff() {
      const list = parseInt(listInput.value) || 0;
      const real = parseInt(realInput.value) || 0;
      if (!list) { diffBadge.textContent = ''; return; }
      if (real === list) {
        diffBadge.className = 'sale-diff-badge badge-exact';
        diffBadge.textContent = '✓ Precio de lista';
      } else if (real < list) {
        const diff = list - real;
        diffBadge.className = 'sale-diff-badge badge-discount';
        diffBadge.textContent = `Descuento de ${fmt(diff)}`;
      } else {
        const diff = real - list;
        diffBadge.className = 'sale-diff-badge badge-over';
        diffBadge.textContent = `+${fmt(diff)} sobre lista`;
      }
    }

    perfSel.addEventListener('change', () => {
      const opt = perfSel.selectedOptions[0];
      const price = parseInt(opt?.dataset.price) || 0;
      if (price) {
        listInput.value = price;
        realInput.value = price;
        priceBlock.classList.remove('hidden');
        realInput.required = true;
        updateDiff();
      } else {
        priceBlock.classList.add('hidden');
        realInput.required = false;
        listInput.value = '';
        realInput.value = '';
        diffBadge.textContent = '';
      }
    });

    realInput.addEventListener('input', updateDiff);

    // ── Lógica del panel de crédito ──────────────────────────
    const creditCheck  = document.getElementById('credito-check');
    const creditPanel  = document.getElementById('credito-panel');
    const creditPerfSel = document.getElementById('credit-perf-sel');
    const creditTot    = document.getElementById('credit-total');

    creditCheck?.addEventListener('change', () => {
      creditPanel.classList.toggle('hidden', !creditCheck.checked);
    });

    creditPerfSel?.addEventListener('change', () => {
      const price = parseInt(creditPerfSel.selectedOptions[0]?.dataset.price) || 0;
      if (price) creditTot.value = price;
    });
  }

  document.getElementById('client-form').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    if (edit) {
      const idx = state.clients.findIndex(x => x.id === id);
      state.clients[idx] = {
        ...state.clients[idx],
        name: fd.get('name'), phone: fd.get('phone'), segment: fd.get('segment'),
        purchases:    parseInt(fd.get('purchases')    ?? c.purchases),
        totalSpent:   parseInt(fd.get('totalSpent')   ?? c.totalSpent),
        lastPurchase: fd.get('lastPurchase') || c.lastPurchase,
        notes: fd.get('notes'),
      };
    } else {
      const salePerfumeId = fd.get('salePerfumeId');
      const saleReal      = parseInt(fd.get('saleRealPrice')) || 0;
      const saleDate      = fd.get('saleDate') || new Date().toISOString().split('T')[0];
      const hasSale       = !!salePerfumeId && saleReal > 0;

      const newClient = {
        id: uid(), name: fd.get('name'), phone: fd.get('phone'),
        segment:      fd.get('segment'),
        purchases:    hasSale ? 1 : 0,
        totalSpent:   hasSale ? saleReal : 0,
        lastPurchase: hasSale ? saleDate : '',
        notes: fd.get('notes'),
      };
      state.clients.push(newClient);

      if (hasSale) {
        const perf = state.perfumes.find(p => p.id === salePerfumeId);
        if (perf) {
          state.sales.push({
            id: uid(),
            clientId:    newClient.id,
            clientName:  newClient.name,
            perfumeId:   perf.id,
            perfumeName: perf.name,
            amount:      saleReal,
            listPrice:   perf.price,
            status:      'pagado',
            date:        saleDate,
          });
        }
      }

      if (fd.get('hasCredito')) {
        const cpid  = fd.get('creditPerfumeId') || salePerfumeId;
        const cPerf = state.perfumes.find(p => p.id === cpid);
        if (cPerf) {
          const ctotal  = parseInt(fd.get('creditTotal')) || cPerf.price;
          const cdown   = Math.min(parseInt(fd.get('creditDown')) || 0, ctotal);
          const cdate   = saleDate;
          state.loans = state.loans || [];
          state.loans.push({
            id: uid(),
            clientId:    newClient.id,
            clientName:  newClient.name,
            perfumeId:   cPerf.id,
            perfumeName: cPerf.name,
            totalAmount: ctotal,
            paidAmount:  cdown,
            date:        cdate,
            dueDate:     fd.get('creditDue') || '',
            notes:       fd.get('creditNotes') || '',
            payments:    cdown > 0 ? [{ id: uid(), date: cdate, amount: cdown, notes: 'Enganche' }] : [],
            status:      cdown >= ctotal ? 'liquidado' : 'activo',
          });
        }
      }
    }
    saveState(); closeModal(); renderClientes();
  });
}

function deleteClient(id) {
  if (!confirm('¿Eliminar este cliente?')) return;
  state.clients = state.clients.filter(c => c.id !== id);
  state.sales   = state.sales.filter(s => s.clientId !== id);
  saveState(); renderClientes();
}

// ── PERFUMES ─────────────────────────────────────────────
function renderPerfumes() {
  const el = document.getElementById('section-perfumes');

  el.innerHTML = `
    <div class="section-toolbar">
      <div></div>
      <button class="primary-button" type="button" onclick="openPerfumeModal()">+ Nuevo perfume</button>
    </div>
    <div class="perfumes-grid">
      ${state.perfumes.map(p => `
        <article class="perfume-card">
          ${p.photo
            ? `<img class="perfume-photo perfume-photo-img" src="${p.photo}" alt="${escHtml(p.name)}" />`
            : `<div class="perfume-photo ${p.colorClass}">${p.name.charAt(0)}</div>`}
          <div class="perfume-body">
            <h3>${escHtml(p.name)}</h3>
            <p>${escHtml(p.description)}</p>
            <div class="perfume-footer">
              <strong>${fmt(p.price)}</strong>
              <span class="stock-badge${p.stock <= 2 ? ' stock-low' : ''}">Stock: ${p.stock}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="icon-btn" data-edit-perfume="${p.id}" title="Editar">✏️</button>
            <button class="icon-btn" data-del-perfume="${p.id}" title="Eliminar">🗑️</button>
          </div>
        </article>`).join('')}
      ${!state.perfumes.length ? '<p class="muted-note" style="padding:20px">Agrega tu primer perfume.</p>' : ''}
    </div>`;

  el.querySelectorAll('[data-edit-perfume]').forEach(btn =>
    btn.addEventListener('click', () => openPerfumeModal(btn.dataset.editPerfume)));

  el.querySelectorAll('[data-del-perfume]').forEach(btn =>
    btn.addEventListener('click', () => deletePerfume(btn.dataset.delPerfume)));
}

function openPerfumeModal(id) {
  const p    = id ? state.perfumes.find(x => x.id === id) : null;
  const edit = !!p;

  showModal(`
    <h2>${edit ? 'Editar perfume' : 'Nuevo perfume'}</h2>
    <form id="perfume-form" class="modal-form">
      <label>Nombre<input name="name" required value="${escHtml(p?.name || '')}" /></label>
      <label>Descripción<textarea name="description" rows="2">${escHtml(p?.description || '')}</textarea></label>
      <label>Precio (MXN)<input name="price" type="number" min="0" required value="${p?.price ?? ''}" /></label>
      <label>Stock<input name="stock" type="number" min="0" required value="${p?.stock ?? 1}" /></label>
      <label>Color de tarjeta (si no hay foto)
        <select name="colorClass">
          ${PERFUME_COLORS.map(c =>
            `<option value="${c}"${p?.colorClass === c ? ' selected' : ''}>${c}</option>`).join('')}
        </select>
      </label>
      <div class="modal-field-group">
        <span class="modal-field-label">FOTO DEL PERFUME</span>
        <div class="photo-upload-area" id="photo-upload-area">
          ${p?.photo
            ? `<img class="photo-thumb-preview" id="photo-preview-img" src="${p.photo}" />`
            : `<div class="photo-placeholder" id="photo-preview-img">📷</div>`}
          <span class="photo-upload-hint">Haz clic para subir o cambiar</span>
          <input type="file" id="photo-file-input" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer;" />
        </div>
      </div>
      <button class="primary-button" type="submit">${edit ? 'Guardar cambios' : 'Agregar perfume'}</button>
    </form>`);

  // Live photo preview
  document.getElementById('photo-file-input').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await resizeImage(file);
    const prev = document.getElementById('photo-preview-img');
    prev.outerHTML = `<img class="photo-thumb-preview" id="photo-preview-img" src="${dataUrl}" />`;
    document.getElementById('photo-upload-area')._pendingPhoto = dataUrl;
  });

  document.getElementById('perfume-form').addEventListener('submit', e => {
    e.preventDefault();
    const fd   = new FormData(e.target);
    const area = document.getElementById('photo-upload-area');
    const photo = area._pendingPhoto ?? p?.photo ?? null;
    const data = {
      name: fd.get('name'), description: fd.get('description'),
      price: parseInt(fd.get('price')), stock: parseInt(fd.get('stock')),
      colorClass: fd.get('colorClass'), photo,
    };
    if (edit) {
      const idx = state.perfumes.findIndex(x => x.id === id);
      state.perfumes[idx] = { ...state.perfumes[idx], ...data };
    } else {
      state.perfumes.push({ id: uid(), ...data });
    }
    saveState(); closeModal(); renderPerfumes();
  });
}

function deletePerfume(id) {
  if (!confirm('¿Eliminar este perfume?')) return;
  state.perfumes = state.perfumes.filter(p => p.id !== id);
  saveState(); renderPerfumes();
}

// ── WHATSAPP ─────────────────────────────────────────────
let wa = { segFilter: 'all', selected: [], perfumeId: '', step: 0 };

const WA_STEPS = [
  { eyebrow: 'Paso 1 de 3', title: '¿A quién enviar?' },
  { eyebrow: 'Paso 2 de 3', title: '¿Qué ofrecer?'   },
  { eyebrow: 'Paso 3 de 3', title: 'Revisar y enviar' },
];

function setWaStep(step) {
  wa.step = Math.max(0, Math.min(2, step));
  const el = document.getElementById('section-whatsapp');
  if (!el) return;

  el.querySelectorAll('.wa-step').forEach((panel, i) =>
    panel.classList.toggle('mob-active', i === wa.step));

  el.querySelectorAll('.wa-dot').forEach((dot, i) =>
    dot.classList.toggle('active', i === wa.step));

  const prevBtn = el.querySelector('#wa-prev');
  const nextBtn = el.querySelector('#wa-next');
  if (prevBtn) prevBtn.disabled = wa.step === 0;
  if (nextBtn) {
    nextBtn.disabled = wa.step === 2;
    nextBtn.textContent = wa.step === 1 ? 'Ver mensaje →' : 'Siguiente →';
    nextBtn.classList.toggle('is-fwd', wa.step === 1);
  }
  // Scroll al tope del workspace
  document.querySelector('.workspace')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderWhatsapp() {
  const el = document.getElementById('section-whatsapp');
  const visibleClients  = state.clients.filter(c => wa.segFilter === 'all' || c.segment === wa.segFilter);
  const selectedPerfume = state.perfumes.find(p => p.id === wa.perfumeId);
  const hasBoth         = wa.selected.length > 0 && !!wa.perfumeId;

  const WA_SVG_18 = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.526 5.862L0 24l6.293-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.371l-.36-.213-3.733.885.936-3.618-.234-.372A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>`;

  el.innerHTML = `
    <div class="wa-toolbar">
      <button class="ghost-button wa-cfg-btn" type="button" onclick="openCustomMessagesModal()">⚙️ Mensajes del embudo</button>
    </div>

    <div class="wa-step-nav">
      <button class="wa-nav-btn" id="wa-prev" ${wa.step === 0 ? 'disabled' : ''}>← Atrás</button>
      <div class="wa-dot-row">
        ${[0,1,2].map(i => `<span class="wa-dot${wa.step === i ? ' active' : ''}"></span>`).join('')}
      </div>
      <button class="wa-nav-btn${wa.step === 1 ? ' is-fwd' : ''}" id="wa-next" ${wa.step === 2 ? 'disabled' : ''}>
        ${wa.step === 1 ? 'Ver mensaje →' : 'Siguiente →'}
      </button>
    </div>

    <div class="wa-layout">

      <article class="panel wa-step${wa.step === 0 ? ' mob-active' : ''}">
        <div class="step-badge">1</div>
        <div class="panel-heading compact">
          <div><span class="eyebrow">Audiencia</span><h2>¿A quién enviar?</h2></div>
        </div>
        <div class="filter-tabs">
          ${[['all','Todos'],['vip','VIP'],['dulces','Dulces'],['frescos','Frescos'],['reactivar','Reactivar']].map(([v,l]) =>
            `<button class="filter-tab${wa.segFilter === v ? ' active' : ''}" data-wa-seg="${v}">${l}</button>`).join('')}
        </div>
        <div class="client-checklist">
          ${visibleClients.map(c => `
            <label class="check-row">
              <input type="checkbox" value="${c.id}" data-cc ${wa.selected.includes(c.id) ? 'checked' : ''} />
              <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(c.name)}</span>
              ${segBadge(c.segment)}
            </label>`).join('')}
          ${!visibleClients.length ? '<span class="muted-note" style="padding:12px 0;display:block">Sin clientes en este segmento.</span>' : ''}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;gap:8px">
          <small class="muted-note wa-count-badge" id="wa-count">
            ${wa.selected.length === 0 ? 'Ninguno seleccionado' : `${wa.selected.length} seleccionado${wa.selected.length !== 1 ? 's' : ''}`}
          </small>
          ${wa.selected.length > 0 ? `<button class="wa-nav-btn is-fwd" id="wa-next-inline">Elegir perfume →</button>` : ''}
        </div>
      </article>

      <article class="panel wa-step${wa.step === 1 ? ' mob-active' : ''}">
        <div class="step-badge">2</div>
        <div class="panel-heading compact">
          <div><span class="eyebrow">Producto</span><h2>¿Qué ofrecer?</h2></div>
        </div>
        <div class="perfume-selector">
          ${state.perfumes.map(p => `
            <button class="perfume-option${wa.perfumeId === p.id ? ' selected' : ''}" data-po="${p.id}">
              ${p.photo
                ? `<img class="po-thumb" src="${p.photo}" alt="" />`
                : `<span class="dot ${p.colorClass}"></span>`}
              <span style="flex:1;text-align:left">${escHtml(p.name)}</span>
              <strong>${fmt(p.price)}</strong>
            </button>`).join('')}
          ${!state.perfumes.length ? '<span class="muted-note">Agrega perfumes primero.</span>' : ''}
        </div>
        ${wa.perfumeId ? `<button class="wa-nav-btn is-fwd wide" style="margin-top:14px" id="wa-next-perf">Ver mensaje →</button>` : ''}
      </article>

      <article class="panel wa-step wa-preview-step${wa.step === 2 ? ' mob-active' : ''}">
        <div class="step-badge">3</div>
        <div class="panel-heading compact">
          <div><span class="eyebrow">Mensaje</span><h2>Vista previa</h2></div>
        </div>
        <div class="phone-preview">
          ${selectedPerfume?.photo
            ? `<div class="wa-photo-preview">
                 <img src="${selectedPerfume.photo}" alt="${escHtml(selectedPerfume?.name || '')}" />
                 <a class="wa-photo-download" download="${escHtml(selectedPerfume?.name || 'perfume')}.jpg" href="${selectedPerfume.photo}">⬇ Descargar foto</a>
               </div>`
            : ''}
          <div class="chat-bubble" id="wa-bubble">${buildPreview(visibleClients, selectedPerfume)}</div>
          <button class="ghost-button wide" id="wa-copy" ${hasBoth ? '' : 'disabled'}>Copiar mensaje</button>
          <button class="wa-open-btn wide" id="wa-open" ${hasBoth ? '' : 'disabled'}>
            <span class="wa-icon">${WA_SVG_18}</span>
            Mandar WhatsApp${wa.selected.length > 1 ? ` (${wa.selected.length})` : ''}
          </button>
          <button class="primary-button wide" id="wa-send" ${hasBoth ? '' : 'disabled'}>
            ✓ Registrar en pipeline${wa.selected.length > 0 ? ` (${wa.selected.length})` : ''}
          </button>
        </div>
      </article>

    </div>`;

  // Step nav botones
  el.querySelector('#wa-prev')?.addEventListener('click', () => setWaStep(wa.step - 1));
  el.querySelector('#wa-next')?.addEventListener('click', () => setWaStep(wa.step + 1));
  el.querySelector('#wa-next-inline')?.addEventListener('click', () => setWaStep(1));
  el.querySelector('#wa-next-perf')?.addEventListener('click', () => setWaStep(2));

  // Segment filter
  el.querySelectorAll('[data-wa-seg]').forEach(btn => btn.addEventListener('click', () => {
    wa.segFilter = btn.dataset.waSeg; wa.selected = []; renderWhatsapp();
  }));

  // Checkboxes
  el.querySelectorAll('[data-cc]').forEach(cb => cb.addEventListener('change', () => {
    wa.selected = [...el.querySelectorAll('[data-cc]:checked')].map(x => x.value);
    const hb    = wa.selected.length > 0 && !!wa.perfumeId;
    const count = el.querySelector('#wa-count');
    if (count) count.textContent = wa.selected.length === 0
      ? 'Ninguno seleccionado'
      : `${wa.selected.length} seleccionado${wa.selected.length !== 1 ? 's' : ''}`;
    el.querySelector('#wa-send')?.toggleAttribute('disabled', !hb);
    if (el.querySelector('#wa-send')) el.querySelector('#wa-send').textContent = `✓ Registrar en pipeline (${wa.selected.length})`;
    el.querySelector('#wa-copy')?.toggleAttribute('disabled', !hb);
    el.querySelector('#wa-open')?.toggleAttribute('disabled', !hb);
    if (el.querySelector('#wa-open')) el.querySelector('#wa-open').innerHTML = `<span class="wa-icon">${WA_SVG_18}</span> Mandar WhatsApp${wa.selected.length > 1 ? ` (${wa.selected.length})` : ''}`;
    // Mostrar/ocultar botón inline "Elegir perfume"
    let nextInline = el.querySelector('#wa-next-inline');
    if (!nextInline && wa.selected.length > 0) {
      const countEl = el.querySelector('.wa-count-badge')?.parentElement;
      if (countEl) {
        const btn = document.createElement('button');
        btn.className = 'wa-nav-btn is-fwd';
        btn.id = 'wa-next-inline';
        btn.textContent = 'Elegir perfume →';
        btn.addEventListener('click', () => setWaStep(1));
        countEl.appendChild(btn);
      }
    } else if (nextInline && wa.selected.length === 0) {
      nextInline.remove();
    }
    refreshBubble(el, visibleClients);
  }));

  // Perfume selection
  el.querySelectorAll('[data-po]').forEach(btn => btn.addEventListener('click', () => {
    wa.perfumeId = btn.dataset.po;
    el.querySelectorAll('[data-po]').forEach(b => b.classList.toggle('selected', b === btn));
    const hb = wa.selected.length > 0 && !!wa.perfumeId;
    el.querySelector('#wa-send')?.toggleAttribute('disabled', !hb);
    el.querySelector('#wa-copy')?.toggleAttribute('disabled', !hb);
    el.querySelector('#wa-open')?.toggleAttribute('disabled', !hb);
    // Mostrar botón "Ver mensaje →" si hay perfume seleccionado
    if (!el.querySelector('#wa-next-perf')) {
      const sel = el.querySelector('.perfume-selector');
      if (sel) {
        const btn2 = document.createElement('button');
        btn2.className = 'wa-nav-btn is-fwd wide';
        btn2.id = 'wa-next-perf';
        btn2.style.marginTop = '14px';
        btn2.textContent = 'Ver mensaje →';
        btn2.addEventListener('click', () => setWaStep(2));
        sel.after(btn2);
      }
    }
    refreshBubble(el, visibleClients);
  }));

  // Mandar WhatsApp
  el.querySelector('#wa-open').addEventListener('click', () => {
    const perf = state.perfumes.find(p => p.id === wa.perfumeId);
    if (!perf) return;
    wa.selected.forEach(cid => {
      const client = state.clients.find(c => c.id === cid);
      if (!client) return;
      window.open(`https://wa.me/52${client.phone}?text=${encodeURIComponent(buildPlainMessage(client.name.split(' ')[0], perf))}`, '_blank');
    });
  });

  // Copy
  el.querySelector('#wa-copy').addEventListener('click', () => {
    const perf  = state.perfumes.find(p => p.id === wa.perfumeId);
    const fname = wa.selected.length === 1
      ? (state.clients.find(c => c.id === wa.selected[0])?.name.split(' ')[0] || 'cliente')
      : 'cliente';
    const text = `Hola ${fname}, nos llegó ${perf.name}.\n\n${perf.description}\n\nPrecio: ${fmt(perf.price)}. ¿Te aparto uno?`;
    navigator.clipboard.writeText(text).then(() => {
      const btn = el.querySelector('#wa-copy');
      btn.textContent = '✓ Copiado';
      setTimeout(() => { btn.textContent = 'Copiar mensaje'; }, 2000);
    });
  });

  // Registrar envío
  el.querySelector('#wa-send').addEventListener('click', () => {
    const perf = state.perfumes.find(p => p.id === wa.perfumeId);
    if (!perf) return;
    wa.selected.forEach(cid => {
      const client = state.clients.find(c => c.id === cid);
      if (!client) return;
      state.sales.push({
        id: uid(), clientId: client.id, clientName: client.name,
        perfumeId: perf.id, perfumeName: perf.name,
        amount: perf.price, status: 'interesado',
        date: new Date().toISOString().split('T')[0],
      });
    });
    state.messagesSent += wa.selected.length;
    saveState();
    wa.selected = []; wa.perfumeId = ''; wa.step = 0;
    const btn = el.querySelector('#wa-send');
    if (btn) { btn.textContent = '✓ Enviado al pipeline'; btn.disabled = true; }
    setTimeout(() => renderWhatsapp(), 1200);
  });
}

function dataURLtoBlob(dataURL) {
  const [header, data] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(data);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function buildPlainMessage(firstName, perf) {
  if (!perf) return '';
  return `Hola ${firstName}, nos llegó ${perf.name}.\n\n${perf.description}\n\nPrecio: ${fmt(perf.price)}. ¿Te aparto uno?`;
}

function buildPreview(clients, perf) {
  if (!perf) return '<span class="muted-note">Selecciona un perfume para ver el mensaje.</span>';
  const fname = wa.selected.length === 1
    ? (clients.find(c => c.id === wa.selected[0])?.name.split(' ')[0] || '[nombre]')
    : '[nombre]';
  return `Hola ${fname}, nos llegó <strong>${escHtml(perf.name)}</strong>.<br><br>${escHtml(perf.description)}<br><br>Precio: ${fmt(perf.price)}. ¿Te aparto uno?`;
}

function refreshBubble(el, clients) {
  const perf   = state.perfumes.find(p => p.id === wa.perfumeId);
  const bubble = el.querySelector('#wa-bubble');
  if (bubble) bubble.innerHTML = buildPreview(clients, perf);

  // Update photo block
  const previewStep = el.querySelector('.wa-preview-step .phone-preview');
  if (!previewStep) return;
  let photoBlock = previewStep.querySelector('.wa-photo-preview');
  if (perf?.photo) {
    if (!photoBlock) {
      photoBlock = document.createElement('div');
      photoBlock.className = 'wa-photo-preview';
      previewStep.insertBefore(photoBlock, bubble);
    }
    photoBlock.innerHTML = `<img src="${perf.photo}" alt="" /><a class="wa-photo-download" download="${escHtml(perf.name)}.jpg" href="${perf.photo}">⬇ Descargar foto</a>`;
  } else if (photoBlock) {
    photoBlock.remove();
  }
}

// ── MENSAJES POR ETAPA ───────────────────────────────────
const STAGE_WA = {
  interesado: {
    label: 'Dar seguimiento',
    icon:  '👋',
    msg: (nombre, perfume, monto) =>
`Hola ${nombre} 👋

Vi que te interesó el *${perfume}*. ¿Todavía lo quieres? Solo me quedan pocos 🙌

Precio: ${monto}

¡Avísame y te lo aparto hoy mismo!`,
  },
  apartado: {
    label: 'Recordar pago',
    icon:  '📦',
    msg: (nombre, perfume, monto) =>
`Hola ${nombre} 📦

Te recuerdo que tienes apartado el *${perfume}* por *${monto}*.

¿Cuándo pasamos a liquidarlo? Aquí te espero 😊`,
  },
  pagado: {
    label: 'Mensaje de gracias',
    icon:  '🙏',
    msg: (nombre, perfume, _monto) =>
`Hola ${nombre} 🙏

¿Qué tal te quedó el *${perfume}*? ¡Espero que te esté encantando! 💫

Si quieres ver lo nuevo que llegó, con gusto te muestro 🌟`,
  },
};

// Devuelve el mensaje personalizado (si existe) o el predeterminado
function getStageMsg(status, nombre, perfume, monto) {
  const custom = (state.customMessages || {})[status];
  if (custom && custom.trim()) {
    return custom
      .replace(/{nombre}/g, nombre)
      .replace(/{perfume}/g, perfume)
      .replace(/{monto}/g, monto);
  }
  return STAGE_WA[status]?.msg(nombre, perfume, monto) || '';
}

function buildStageWaUrl(sale) {
  const client = state.clients.find(c => c.id === sale.clientId);
  if (!client?.phone) return null;
  if (!STAGE_WA[sale.status]) return null;
  const nombre  = sale.clientName.split(' ')[0];
  const mensaje = getStageMsg(sale.status, nombre, sale.perfumeName, fmt(sale.amount));
  return `https://wa.me/52${client.phone}?text=${encodeURIComponent(mensaje)}`;
}

// ── VENTAS ───────────────────────────────────────────────
const STATUS_COLORS = {
  interesado: { accent: '#4ea6e0', bg: 'rgba(78,166,224,0.08)',  icon: '💬' },
  apartado:   { accent: '#c47b38', bg: 'rgba(196,123,56,0.08)',  icon: '📦' },
  pagado:     { accent: '#1f7a64', bg: 'rgba(31,122,100,0.08)',  icon: '✅' },
};

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function renderVentas() {
  const el      = document.getElementById('section-ventas');
  const paidAll = state.sales.filter(s => s.status === 'pagado').reduce((s, x) => s + x.amount, 0);

  const colCounts = Object.fromEntries(STATUS_ORDER.map(s => [
    s, state.sales.filter(x => x.status === s).length
  ]));

  const WA_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.526 5.862L0 24l6.293-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.371l-.36-.213-3.733.885.936-3.618-.234-.372A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>`;

  el.innerHTML = `
    <div class="section-toolbar">
      <div class="kanban-summary">
        <span><strong>${state.sales.length}</strong> oportunidades · <strong>${fmt(paidAll)}</strong> cobrado</span>
      </div>
      <button class="primary-button" id="ventas-new-btn" type="button" onclick="openSaleModal()">+ Nueva</button>
    </div>

    <div class="kb-col-pills" id="kb-col-pills">
      ${STATUS_ORDER.map((s, i) => {
        const cfg = STATUS_COLORS[s];
        return `<button class="kb-col-pill${i === 0 ? ' active' : ''}" data-col="${s}"
          style="--col-accent:${cfg.accent}">
          ${cfg.icon} ${STATUS_LABELS[s]}
          <span class="pill-badge">${colCounts[s]}</span>
        </button>`;
      }).join('')}
    </div>

    <div class="kanban-board" id="kanban-board">
      ${STATUS_ORDER.map((status, colIdx) => {
        const cfg       = STATUS_COLORS[status];
        const cards     = state.sales.filter(s => s.status === status);
        const total     = cards.reduce((sum, s) => sum + s.amount, 0);
        const isFirst   = colIdx === 0;
        const isLast    = colIdx === STATUS_ORDER.length - 1;
        const nextLabel = !isLast ? STATUS_LABELS[STATUS_ORDER[colIdx + 1]] : '';

        return `
          <div class="kb-col" data-status="${status}" style="--col-accent:${cfg.accent};--col-bg:${cfg.bg}">
            <div class="kb-col-header">
              <div class="kb-col-title">
                <span class="kb-icon">${cfg.icon}</span>
                <span class="kb-label">${STATUS_LABELS[status]}</span>
                <span class="kb-count">${cards.length}</span>
              </div>
              <div class="kb-col-total">${fmt(total)}</div>
            </div>

            <div class="kb-cards" id="kb-cards-${status}">
              ${cards.length === 0 ? `<div class="kb-empty">Sin oportunidades</div>` : ''}
              ${cards.map(s => {
                const waUrl  = buildStageWaUrl(s);
                const waInfo = STAGE_WA[status];
                return `
                <article class="kb-card" data-id="${s.id}">
                  <div class="kb-prog">
                    ${STATUS_ORDER.map((_, si) =>
                      `<span class="kb-prog-step ${si < colIdx ? 'done' : si === colIdx ? 'active' : ''}"></span>`
                    ).join('')}
                  </div>
                  <div class="kb-card-top">
                    <div class="kb-avatar">${initials(s.clientName)}</div>
                    <div class="kb-card-info">
                      <strong>${escHtml(s.clientName)}</strong>
                      <span>${escHtml(s.perfumeName)}</span>
                    </div>
                    <div class="kb-card-right">
                      <span class="kb-amount">${fmt(s.amount)}</span>
                      <span class="kb-date">${fmtDate(s.date)}</span>
                    </div>
                    <button class="icon-btn small kb-del" data-del-sale="${s.id}" title="Eliminar">✕</button>
                  </div>
                  ${waUrl ? `
                  <a class="kb-wa-btn" href="${waUrl}" target="_blank" rel="noopener">
                    ${WA_SVG} ${waInfo.icon} ${escHtml(waInfo.label)}
                  </a>` : ''}
                  <div class="kb-card-actions">
                    ${!isFirst ? `<button class="kb-move-btn kb-back" data-back="${s.id}">← Atrás</button>` : '<span></span>'}
                    ${!isLast  ? `<button class="kb-move-btn kb-fwd" data-advance="${s.id}">${escHtml(nextLabel)} →</button>`
                               : '<span class="kb-paid-badge">✓ Cobrado</span>'}
                  </div>
                </article>`;
              }).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>

    <button class="ventas-fab" id="ventas-fab" type="button" aria-label="Nueva oportunidad" onclick="openSaleModal()">+</button>`;

  el.querySelectorAll('[data-advance]').forEach(btn =>
    btn.addEventListener('click', () => advanceSale(btn.dataset.advance)));

  el.querySelectorAll('[data-back]').forEach(btn =>
    btn.addEventListener('click', () => backSale(btn.dataset.back)));

  el.querySelectorAll('[data-del-sale]').forEach(btn =>
    btn.addEventListener('click', () => deleteSale(btn.dataset.delSale)));

  // Pills de columna → scroll horizontal
  const board = el.querySelector('#kanban-board');
  el.querySelectorAll('.kb-col-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      el.querySelectorAll('.kb-col-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const col = board?.querySelector(`[data-status="${pill.dataset.col}"]`);
      if (col) col.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
  });

  // Sincronizar pill activa al hacer scroll en mobile
  if (board) {
    board.addEventListener('scroll', () => {
      const colEls    = [...board.querySelectorAll('[data-status]')];
      const scrollLeft = board.scrollLeft;
      let nearest = colEls[0];
      let minDist = Infinity;
      colEls.forEach(col => {
        const dist = Math.abs(col.offsetLeft - scrollLeft);
        if (dist < minDist) { minDist = dist; nearest = col; }
      });
      if (nearest) {
        el.querySelectorAll('.kb-col-pill').forEach(p =>
          p.classList.toggle('active', p.dataset.col === nearest.dataset.status));
      }
    }, { passive: true });
  }
}

function advanceSale(id) {
  const sale = state.sales.find(s => s.id === id);
  if (!sale) return;
  const i = STATUS_ORDER.indexOf(sale.status);
  if (i < STATUS_ORDER.length - 1) {
    sale.status = STATUS_ORDER[i + 1];
    if (sale.status === 'pagado') {
      const client = state.clients.find(c => c.id === sale.clientId);
      if (client) {
        client.purchases++;
        client.totalSpent  += sale.amount;
        client.lastPurchase = new Date().toISOString().split('T')[0];
      }
    }
    saveState(); renderVentas();
  }
}

function backSale(id) {
  const sale = state.sales.find(s => s.id === id);
  if (!sale) return;
  const i = STATUS_ORDER.indexOf(sale.status);
  if (i > 0) {
    // Si retrocede desde pagado, revertir stats del cliente
    if (sale.status === 'pagado') {
      const client = state.clients.find(c => c.id === sale.clientId);
      if (client && client.purchases > 0) {
        client.purchases--;
        client.totalSpent = Math.max(0, client.totalSpent - sale.amount);
      }
    }
    sale.status = STATUS_ORDER[i - 1];
    saveState(); renderVentas();
  }
}

function deleteSale(id) {
  if (!confirm('¿Eliminar esta oportunidad?')) return;
  state.sales = state.sales.filter(s => s.id !== id);
  saveState(); renderVentas();
}

function openSaleModal() {
  showModal(`
    <h2>Nueva oportunidad</h2>
    <form id="sale-form" class="modal-form">

      <label>Cliente
        <select name="clientId" id="sale-client-sel">
          <option value="">Seleccionar…</option>
          ${state.clients.map(c => `<option value="${c.id}">${escHtml(c.name)}</option>`).join('')}
          <option value="__new__">➕ Nuevo cliente…</option>
        </select>
      </label>

      <div id="new-client-panel" class="new-client-panel hidden">
        <div class="new-client-header">
          <span class="modal-field-label">Datos del nuevo cliente</span>
        </div>
        <label>Nombre completo
          <input name="newName" id="nc-name" placeholder="Ej. Laura García" />
        </label>
        <label>Teléfono (sin código país)
          <input name="newPhone" id="nc-phone" type="tel" placeholder="449 123 4567" />
        </label>
        <label>Segmento
          <select name="newSegment" id="nc-segment">
            ${Object.entries(SEGMENTS).map(([v,s]) =>
              `<option value="${v}">${s.label}</option>`).join('')}
          </select>
        </label>
      </div>

      <label>Perfume
        <select name="perfumeId" id="sale-perf-sel">
          <option value="">Seleccionar…</option>
          ${state.perfumes.map(p =>
            `<option value="${p.id}" data-price="${p.price}">${escHtml(p.name)} — ${fmt(p.price)}</option>`).join('')}
        </select>
      </label>

      <div id="sale-amount-block" class="hidden">
        <label>Monto a cobrar (MXN)
          <input name="amount" id="sale-amount" type="number" min="0" />
        </label>
      </div>

      <label>Estado inicial
        <select name="status">
          ${STATUS_ORDER.map(s => `<option value="${s}">${STATUS_LABELS[s]}</option>`).join('')}
        </select>
      </label>

      <button class="primary-button" type="submit" id="sale-submit-btn">Agregar oportunidad</button>
    </form>`);

  const clientSel   = document.getElementById('sale-client-sel');
  const newPanel    = document.getElementById('new-client-panel');
  const perfSel     = document.getElementById('sale-perf-sel');
  const amountBlock = document.getElementById('sale-amount-block');
  const amountInput = document.getElementById('sale-amount');

  // Mostrar/ocultar panel nuevo cliente
  clientSel.addEventListener('change', () => {
    const isNew = clientSel.value === '__new__';
    newPanel.classList.toggle('hidden', !isNew);
    document.getElementById('nc-name').required  = isNew;
    document.getElementById('nc-phone').required = isNew;
  });

  // Autocompletar monto al elegir perfume
  perfSel.addEventListener('change', () => {
    const opt   = perfSel.selectedOptions[0];
    const price = parseInt(opt?.dataset.price) || 0;
    if (price) {
      amountInput.value = price;
      amountBlock.classList.remove('hidden');
      amountInput.required = true;
    } else {
      amountBlock.classList.add('hidden');
      amountInput.required = false;
      amountInput.value = '';
    }
  });

  document.getElementById('sale-form').addEventListener('submit', e => {
    e.preventDefault();
    const fd   = new FormData(e.target);
    const perf = state.perfumes.find(p => p.id === fd.get('perfumeId'));
    if (!perf) return;

    let client;

    if (fd.get('clientId') === '__new__') {
      // Crear cliente nuevo
      const newName = fd.get('newName').trim();
      const newPhone = fd.get('newPhone').trim();
      if (!newName || !newPhone) return;
      client = {
        id: uid(),
        name: newName,
        phone: newPhone,
        segment: fd.get('newSegment') || 'frescos',
        purchases: 0,
        totalSpent: 0,
        lastPurchase: '',
        notes: '',
      };
      state.clients.push(client);
    } else {
      client = state.clients.find(c => c.id === fd.get('clientId'));
    }

    if (!client) return;

    const amount = parseInt(fd.get('amount')) || perf.price;
    const status = fd.get('status');

    state.sales.push({
      id: uid(),
      clientId:    client.id,
      clientName:  client.name,
      perfumeId:   perf.id,
      perfumeName: perf.name,
      amount,
      status,
      date: new Date().toISOString().split('T')[0],
    });

    // Si se registra como pagado, actualizar stats del cliente
    if (status === 'pagado') {
      client.purchases++;
      client.totalSpent  += amount;
      client.lastPurchase = new Date().toISOString().split('T')[0];
    }

    saveState(); closeModal(); renderVentas();
  });
}

// ── MODAL ────────────────────────────────────────────────
function showModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-content').innerHTML = '';
}

// ── UTILS ────────────────────────────────────────────────
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── CRÉDITO / FINANCIAMIENTO ─────────────────────────────
function buildDebtMsg(loan) {
  const nombre  = loan.clientName.split(' ')[0];
  const pending = loan.totalAmount - loan.paidAmount;
  return `Hola ${nombre} 💸\n\nTe recuerdo que tienes un saldo pendiente de *${fmt(pending)}* por el *${loan.perfumeName}*.\n\nTotal acordado: ${fmt(loan.totalAmount)}\nYa pagaste: ${fmt(loan.paidAmount)}\nFalta: *${fmt(pending)}*\n\n¿Cuándo lo liquidamos? 😊`;
}

function renderCredito() {
  const el = document.getElementById('section-credito');

  const loans       = state.loans || [];
  const totalLent   = loans.reduce((s, l) => s + l.totalAmount, 0);
  const totalPaid   = loans.reduce((s, l) => s + l.paidAmount, 0);
  const totalPend   = totalLent - totalPaid;
  const activeLoans = loans.filter(l => getLoanStatus(l) !== 'liquidado');
  const debtorCount = new Set(activeLoans.map(l => l.clientId)).size;

  const WA_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.526 5.862L0 24l6.293-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.371l-.36-.213-3.733.885.936-3.618-.234-.372A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>`;

  el.innerHTML = `
    <div class="section-toolbar">
      <div class="kanban-summary">
        <span><strong>${debtorCount}</strong> deudor${debtorCount !== 1 ? 'es' : ''} · <strong>${fmt(totalPend)}</strong> por cobrar</span>
      </div>
      <button class="primary-button" type="button" onclick="openLoanModal()">+ Nuevo crédito</button>
    </div>

    <div class="metrics-grid" style="margin-bottom:16px">
      <article class="metric-card">
        <span>Total financiado</span>
        <strong>${fmt(totalLent)}</strong>
        <small>${loans.length} crédito${loans.length !== 1 ? 's' : ''} registrado${loans.length !== 1 ? 's' : ''}</small>
      </article>
      <article class="metric-card">
        <span>Total cobrado</span>
        <strong>${fmt(totalPaid)}</strong>
        <small>${totalLent > 0 ? Math.round((totalPaid / totalLent) * 100) : 0}% recuperado</small>
      </article>
      <article class="metric-card highlight">
        <span>Por cobrar</span>
        <strong>${fmt(totalPend)}</strong>
        <small>${debtorCount} cliente${debtorCount !== 1 ? 's' : ''} con saldo activo</small>
      </article>
      <article class="metric-card">
        <span>Liquidados</span>
        <strong>${loans.filter(l => getLoanStatus(l) === 'liquidado').length}</strong>
        <small>de ${loans.length} totales</small>
      </article>
    </div>

    <div class="loans-list">
      ${!loans.length
        ? `<div class="panel" style="text-align:center;padding:48px 20px;color:var(--muted)">
             <div style="font-size:2rem;margin-bottom:10px">💸</div>
             <p style="margin:0;font-size:0.9rem">Sin créditos registrados.<br>Usa "+ Nuevo crédito" para empezar.</p>
           </div>`
        : loans.map(loan => {
            const status  = getLoanStatus(loan);
            const cfg     = LOAN_STATUS[status];
            const pending = loan.totalAmount - loan.paidAmount;
            const pct     = loan.totalAmount > 0 ? Math.min(100, Math.round((loan.paidAmount / loan.totalAmount) * 100)) : 0;
            const client  = state.clients.find(c => c.id === loan.clientId);
            const waUrl   = client?.phone
              ? `https://wa.me/52${client.phone}?text=${encodeURIComponent(buildDebtMsg(loan))}`
              : null;

            return `
            <article class="loan-card panel">
              <div class="loan-card-header">
                <div class="loan-avatar">${initials(loan.clientName)}</div>
                <div class="loan-info">
                  <div class="loan-name-row">
                    <strong>${escHtml(loan.clientName)}</strong>
                    <span class="loan-status-badge" style="--ls-color:${cfg.color}">${cfg.label}</span>
                  </div>
                  <span class="loan-product">${escHtml(loan.perfumeName)}</span>
                </div>
                <button class="icon-btn small" data-del-loan="${loan.id}" title="Eliminar">🗑️</button>
              </div>

              <div class="loan-progress-wrap">
                <div class="loan-progress-bar">
                  <div class="loan-progress-fill" style="width:${pct}%;background:${cfg.color}"></div>
                </div>
                <div class="loan-amounts">
                  <span>Pagado: <strong>${fmt(loan.paidAmount)}</strong></span>
                  <span>Pendiente: <strong style="color:${cfg.color}">${pending > 0 ? fmt(pending) : '—'}</strong></span>
                  <span class="loan-pct">${pct}%</span>
                </div>
              </div>

              ${loan.payments.length ? `
              <details class="loan-payments-wrap">
                <summary class="loan-payments-toggle">Historial de pagos (${loan.payments.length})</summary>
                <div class="loan-payments">
                  ${loan.payments.map(p => `
                    <div class="loan-payment-row">
                      <span>${fmtDate(p.date)}</span>
                      <span>${escHtml(p.notes || '—')}</span>
                      <strong>${fmt(p.amount)}</strong>
                    </div>`).join('')}
                </div>
              </details>` : ''}

              ${loan.notes ? `<p class="loan-notes">"${escHtml(loan.notes)}"</p>` : ''}
              ${loan.dueDate ? `<p class="loan-due ${status === 'atrasado' ? 'loan-due-late' : ''}">
                📅 Fecha límite: ${fmtDate(loan.dueDate)}${status === 'atrasado' ? ' · <strong>Atrasado</strong>' : ''}
              </p>` : ''}

              <div class="loan-actions">
                ${waUrl && status !== 'liquidado' ? `
                <a class="kb-wa-btn loan-wa-btn" href="${waUrl}" target="_blank" rel="noopener">
                  ${WA_SVG} 💬 Recordar pago
                </a>` : ''}
                ${status !== 'liquidado'
                  ? `<button class="primary-button loan-pay-btn" data-pay-loan="${loan.id}">+ Registrar pago</button>`
                  : `<span class="loan-paid-label">✅ Liquidado · ${fmt(loan.totalAmount)}</span>`}
              </div>
            </article>`;
          }).join('')}
    </div>

    <button class="ventas-fab" id="credito-fab" type="button" aria-label="Nuevo crédito" onclick="openLoanModal()">+</button>`;

  el.querySelectorAll('[data-del-loan]').forEach(btn =>
    btn.addEventListener('click', () => deleteLoan(btn.dataset.delLoan)));

  el.querySelectorAll('[data-pay-loan]').forEach(btn =>
    btn.addEventListener('click', () => openPaymentModal(btn.dataset.payLoan)));
}

function openLoanModal() {
  const today = new Date().toISOString().split('T')[0];

  showModal(`
    <h2>Nuevo crédito</h2>
    <form id="loan-form" class="modal-form">
      <label>Cliente
        <select name="clientId" id="loan-client-sel" required>
          <option value="">Seleccionar cliente…</option>
          <option value="__new__">＋ Nuevo cliente…</option>
          ${state.clients.map(c => `<option value="${c.id}">${escHtml(c.name)}</option>`).join('')}
        </select>
      </label>

      <div id="loan-new-client-panel" class="credito-inline-panel hidden">
        <div class="credito-panel-header">
          <span class="modal-field-label">Datos del nuevo cliente</span>
          <span class="first-sale-hint">👤 Se creará al guardar</span>
        </div>
        <label>Nombre completo
          <input name="newName" type="text" placeholder="Ej. Ana García" />
        </label>
        <label>Teléfono (sin código país)
          <input name="newPhone" type="tel" placeholder="449 123 4567" />
        </label>
        <label>Segmento
          <select name="newSegment">
            ${Object.entries(SEGMENTS).map(([v,s]) => `<option value="${v}">${s.label}</option>`).join('')}
          </select>
        </label>
      </div>

      <label>Perfume
        <select name="perfumeId" id="loan-perf-sel" required>
          <option value="">Seleccionar perfume…</option>
          ${state.perfumes.map(p =>
            `<option value="${p.id}" data-price="${p.price}">${escHtml(p.name)} — ${fmt(p.price)}</option>`
          ).join('')}
        </select>
      </label>
      <label>Precio total acordado (MXN)
        <input name="totalAmount" id="loan-total" type="number" min="0" required placeholder="0" />
      </label>
      <label>Enganche / primer pago (MXN)
        <input name="downPayment" id="loan-down" type="number" min="0" value="0" placeholder="0 si no hay enganche" />
      </label>
      <label>Fecha límite de pago
        <input name="dueDate" type="date" value="${today}" />
      </label>
      <label>Notas
        <textarea name="notes" rows="2" placeholder="Ej. Paga quincena, días de cobro…"></textarea>
      </label>
      <button class="primary-button" type="submit">Registrar crédito</button>
    </form>`);

  // Mostrar panel nuevo cliente al elegir esa opción
  const clientSel      = document.getElementById('loan-client-sel');
  const newClientPanel = document.getElementById('loan-new-client-panel');
  clientSel.addEventListener('change', () => {
    const isNew = clientSel.value === '__new__';
    newClientPanel.classList.toggle('hidden', !isNew);
    // Campos de nuevo cliente: required sólo cuando el panel está visible
    newClientPanel.querySelectorAll('input[name="newName"], input[name="newPhone"]').forEach(inp => {
      inp.required = isNew;
    });
  });

  // Auto-rellenar precio total al elegir perfume
  document.getElementById('loan-perf-sel').addEventListener('change', e => {
    const price = parseInt(e.target.selectedOptions[0]?.dataset.price) || 0;
    if (price) document.getElementById('loan-total').value = price;
  });

  document.getElementById('loan-form').addEventListener('submit', e => {
    e.preventDefault();
    const fd      = new FormData(e.target);
    const perfume = state.perfumes.find(p => p.id === fd.get('perfumeId'));
    if (!perfume) return;

    // Resolver cliente: existente o nuevo
    let client;
    if (fd.get('clientId') === '__new__') {
      const newName = (fd.get('newName') || '').trim();
      if (!newName) return;
      client = {
        id: uid(),
        name:        newName,
        phone:       (fd.get('newPhone') || '').trim(),
        segment:     fd.get('newSegment') || 'frescos',
        purchases:   0,
        totalSpent:  0,
        lastPurchase: '',
        notes:       '',
      };
      state.clients.push(client);
    } else {
      client = state.clients.find(c => c.id === fd.get('clientId'));
      if (!client) return;
    }

    const totalAmount = parseInt(fd.get('totalAmount')) || 0;
    const downPayment = Math.min(parseInt(fd.get('downPayment')) || 0, totalAmount);
    const dueDate     = fd.get('dueDate');
    const payments    = downPayment > 0
      ? [{ id: uid(), date: today, amount: downPayment, notes: 'Enganche' }]
      : [];

    state.loans.push({
      id: uid(),
      clientId: client.id, clientName: client.name,
      perfumeId: perfume.id, perfumeName: perfume.name,
      totalAmount, paidAmount: downPayment,
      date: today, dueDate,
      notes: fd.get('notes') || '',
      payments,
      status: downPayment >= totalAmount ? 'liquidado' : 'activo',
    });

    saveState(); closeModal(); renderCredito();
    if (currentSection === 'clientes') renderClientes();
  });
}

function openPaymentModal(loanId) {
  const loan = (state.loans || []).find(l => l.id === loanId);
  if (!loan) return;
  const pending = loan.totalAmount - loan.paidAmount;
  const today   = new Date().toISOString().split('T')[0];

  showModal(`
    <h2>Registrar pago</h2>
    <div class="loan-pay-info">
      <strong>${escHtml(loan.clientName)}</strong> · ${escHtml(loan.perfumeName)}
      <div class="loan-pay-balance">
        Pagado: ${fmt(loan.paidAmount)} · <strong>Pendiente: ${fmt(pending)}</strong>
      </div>
    </div>
    <form id="payment-form" class="modal-form">
      <label>Monto del pago (MXN)
        <input name="amount" type="number" min="1" value="${pending}" required />
      </label>
      <label>Fecha del pago
        <input name="date" type="date" value="${today}" required />
      </label>
      <label>Concepto / nota
        <input name="notes" type="text" placeholder="Ej. Abono quincena" />
      </label>
      <button class="primary-button" type="submit">Confirmar pago</button>
    </form>`);

  document.getElementById('payment-form').addEventListener('submit', e => {
    e.preventDefault();
    const fd     = new FormData(e.target);
    const amount = Math.min(parseInt(fd.get('amount')) || 0, pending);
    if (amount <= 0) return;

    loan.payments.push({ id: uid(), date: fd.get('date'), amount, notes: fd.get('notes') || '' });
    loan.paidAmount = Math.min(loan.totalAmount, loan.paidAmount + amount);
    if (loan.paidAmount >= loan.totalAmount) loan.status = 'liquidado';

    saveState(); closeModal(); renderCredito();
    if (currentSection === 'clientes') renderClientes();
  });
}

function deleteLoan(id) {
  if (!confirm('¿Eliminar este crédito?')) return;
  state.loans = (state.loans || []).filter(l => l.id !== id);
  saveState(); renderCredito();
  if (currentSection === 'clientes') renderClientes();
}

// ── PERSONALIZAR MENSAJES DEL EMBUDO ─────────────────────
function openCustomMessagesModal() {
  if (!state.customMessages) state.customMessages = {};
  const stages = STATUS_ORDER.filter(s => STAGE_WA[s]);

  showModal(`
    <h2>Mensajes del embudo</h2>
    <p class="msg-hint">
      Personaliza el mensaje de WhatsApp para cada etapa del pipeline.<br>
      Variables disponibles:
      <span class="msg-vars" style="display:inline-flex;gap:5px;vertical-align:middle;margin-left:4px">
        <span class="msg-var-chip">{nombre}</span>
        <span class="msg-var-chip">{perfume}</span>
        <span class="msg-var-chip">{monto}</span>
      </span>
    </p>
    <form id="msg-form" class="modal-form">
      ${stages.map(status => {
        const cfg    = STATUS_COLORS[status];
        const wa     = STAGE_WA[status];
        const custom = state.customMessages[status] || '';
        const defMsg = wa.msg('{nombre}', '{perfume}', '{monto}');
        return `
        <div class="msg-block">
          <div class="msg-block-header">
            <span>${cfg.icon}</span>
            <strong>${STATUS_LABELS[status]}</strong>
            <span class="muted-note" style="font-weight:400;font-size:0.78rem">${wa.icon} ${escHtml(wa.label)}</span>
            ${custom ? '<span class="badge seg-frescos" style="font-size:0.65rem">personalizado</span>' : ''}
          </div>
          <textarea name="msg_${status}" rows="5"
            placeholder="${escHtml(defMsg)}">${escHtml(custom)}</textarea>
          <button type="button" class="msg-reset-btn" data-reset="${status}">↩ Restaurar predeterminado</button>
        </div>`;
      }).join('')}
      <button class="primary-button" type="submit">Guardar mensajes</button>
    </form>`);

  // Reset individual por etapa
  document.querySelectorAll('.msg-reset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ta = document.querySelector(`[name="msg_${btn.dataset.reset}"]`);
      if (ta) { ta.value = ''; ta.focus(); }
    });
  });

  document.getElementById('msg-form').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    if (!state.customMessages) state.customMessages = {};
    stages.forEach(status => {
      state.customMessages[status] = (fd.get(`msg_${status}`) || '').trim();
    });
    saveState();
    closeModal();
    if (currentSection === 'ventas')   renderVentas();
    if (currentSection === 'whatsapp') renderWhatsapp();
  });
}

// ── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    if (login(user, pass)) {
      sessionStorage.setItem(SESSION_KEY, '1');
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('main-app').style.display = '';
      initApp();
    } else {
      document.getElementById('login-error').classList.remove('hidden');
      document.getElementById('login-pass').value = '';
      document.getElementById('login-pass').focus();
    }
  });

  // Si ya hay sesión activa, mostrar la app directamente
  if (isAuthenticated()) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = '';
    initApp();
  }
});

function initApp() {
  // Theme toggle
  document.querySelectorAll('.theme-button').forEach(btn =>
    btn.addEventListener('click', () => {
      const neon = btn.dataset.theme === 'neon';
      document.body.classList.toggle('theme-neon', neon);
      document.body.classList.toggle('theme-minimal', !neon);
      document.querySelectorAll('.theme-button').forEach(b => b.classList.toggle('active', b === btn));
      // Sync theme-color para barra de estado iPhone
      const meta = document.getElementById('theme-color-meta');
      if (meta) meta.content = neon ? '#05070b' : '#fffaf2';
    }));

  // Nav (desktop sidebar + mobile bottom)
  document.querySelectorAll('.nav-item[data-nav], .mob-nav-item[data-nav]').forEach(btn =>
    btn.addEventListener('click', () => navigate(btn.dataset.nav)));

  // Modal close
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', logout);

  // Sidebar suggestion → WhatsApp
  document.getElementById('suggestion-btn').addEventListener('click', () => {
    wa.segFilter = 'reactivar'; navigate('whatsapp');
  });

  navigate('panel');
}
