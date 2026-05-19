// StreetCulto CRM — app.js

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

const STATUS_ORDER  = ['interesado', 'respondio', 'apartado', 'pagado'];
const STATUS_LABELS = { interesado: 'Interesado', respondio: 'Respondió', apartado: 'Apartado', pagado: 'Pagado' };

const SECTION_META = {
  panel:    { eyebrow: 'Panel general',      title: 'Seguimiento de clientes y perfumes' },
  clientes: { eyebrow: 'Directorio',         title: 'Clientes' },
  perfumes: { eyebrow: 'Inventario',         title: 'Perfumes disponibles' },
  whatsapp: { eyebrow: 'Mensajería',         title: 'Envío por WhatsApp' },
  ventas:   { eyebrow: 'Pipeline de ventas', title: 'Oportunidades' },
};

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
    { id: 's3', clientId: 'c3', clientName: 'Carlos Herrera',  perfumeId: 'p2', perfumeName: 'Citrus Club',            amount: 980,  status: 'respondio', date: '2026-05-17' },
    { id: 's4', clientId: 'c5', clientName: 'Roberto Sánchez', perfumeId: 'p4', perfumeName: 'Hugo Boss Bottled Night', amount: 1800, status: 'interesado', date: '2026-05-18' },
    { id: 's5', clientId: 'c4', clientName: 'Daniela López',   perfumeId: 'p1', perfumeName: 'Aura Nocturna',          amount: 1450, status: 'interesado', date: '2026-05-19' },
    { id: 's6', clientId: 'c1', clientName: 'Mariana Ruiz',    perfumeId: 'p2', perfumeName: 'Citrus Club',            amount: 980,  status: 'pagado',    date: '2026-05-08' },
    { id: 's7', clientId: 'c5', clientName: 'Roberto Sánchez', perfumeId: 'p3', perfumeName: 'Rose Vice',              amount: 1250, status: 'pagado',    date: '2026-05-05' },
  ],
  messagesSent: 47,
};

// ── State ────────────────────────────────────────────────
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(SAMPLE));
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

  document.querySelectorAll('.nav-item[data-nav]').forEach(b => {
    b.classList.toggle('active', b.dataset.nav === section);
  });

  const meta = SECTION_META[section] || {};
  document.getElementById('section-eyebrow').textContent = meta.eyebrow || '';
  document.getElementById('section-title').textContent   = meta.title   || '';

  document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
  document.getElementById(`section-${section}`).classList.add('active');

  renderSection(section);
}

function renderSection(s) {
  switch (s) {
    case 'panel':    renderPanel();    break;
    case 'clientes': renderClientes(); break;
    case 'perfumes': renderPerfumes(); break;
    case 'whatsapp': renderWhatsapp(); break;
    case 'ventas':   renderVentas();   break;
  }
}

// ── PANEL ────────────────────────────────────────────────
function renderPanel() {
  const el = document.getElementById('section-panel');

  const now       = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const paidMonth = state.sales
    .filter(s => s.status === 'pagado' && s.date.startsWith(thisMonth))
    .reduce((sum, s) => sum + s.amount, 0);

  const bestClient  = [...state.clients].sort((a, b) => b.totalSpent - a.totalSpent)[0];
  const recentSales = [...state.sales].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const counts      = Object.fromEntries(STATUS_ORDER.map(s => [s, 0]));
  state.sales.forEach(s => { if (counts[s.status] !== undefined) counts[s.status]++; });

  const firstPerfume = state.perfumes[0];
  const firstClient  = state.clients.find(c => c.segment === 'reactivar') || state.clients[0];
  const previewMsg   = firstPerfume && firstClient
    ? `Hola ${firstClient.name.split(' ')[0]}, nos llegó <strong>${firstPerfume.name}</strong>.<br><br>${firstPerfume.description}<br><br>Precio: ${fmt(firstPerfume.price)}. ¿Te aparto uno?`
    : 'Agrega clientes y perfumes para generar mensajes.';

  el.innerHTML = `
    <section class="metrics-grid">
      <article class="metric-card">
        <span>Ventas del mes</span>
        <strong>${fmt(paidMonth)}</strong>
        <small>${state.sales.filter(s => s.status === 'pagado').length} ventas cerradas</small>
      </article>
      <article class="metric-card highlight">
        <span>Mejor cliente</span>
        <strong>${bestClient ? bestClient.name : '—'}</strong>
        <small>${bestClient ? `${bestClient.purchases} compras · ${fmt(bestClient.totalSpent)}` : ''}</small>
      </article>
      <article class="metric-card">
        <span>Mensajes enviados</span>
        <strong>${state.messagesSent}</strong>
        <small>${state.sales.filter(s => s.status !== 'interesado').length} oportunidades activas</small>
      </article>
      <article class="metric-card">
        <span>Perfumes activos</span>
        <strong>${state.perfumes.length}</strong>
        <small>${state.clients.length} clientes registrados</small>
      </article>
    </section>

    <section class="content-grid">
      <article class="panel table-panel large-panel">
        <div class="panel-heading" style="padding:18px 18px 0">
          <div><span class="eyebrow">Actividad reciente</span><h2>Últimas oportunidades</h2></div>
          <button class="ghost-button" type="button" onclick="navigate('ventas')">Ver pipeline</button>
        </div>
        <table class="data-table">
          <thead><tr><th>Cliente</th><th>Perfume</th><th>Monto</th><th>Estado</th><th>Fecha</th></tr></thead>
          <tbody>
            ${recentSales.length ? recentSales.map(s => `
              <tr>
                <td>${s.clientName}</td>
                <td>${s.perfumeName}</td>
                <td>${fmt(s.amount)}</td>
                <td><span class="status-badge status-${s.status}">${STATUS_LABELS[s.status]}</span></td>
                <td>${fmtDate(s.date)}</td>
              </tr>`).join('') : `<tr><td colspan="5" class="empty-row">Sin oportunidades aún</td></tr>`}
          </tbody>
        </table>
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
              <div><span>${STATUS_LABELS[s]}</span><strong>${counts[s]}</strong></div>`).join('')}
          </div>
        </article>
      </div>
    </section>`;

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
  const el = document.getElementById('section-clientes');

  const list = state.clients.filter(c => {
    const okSeg    = clientFilter === 'all' || c.segment === clientFilter;
    const okSearch = !clientSearch
      || c.name.toLowerCase().includes(clientSearch.toLowerCase())
      || c.phone.includes(clientSearch);
    return okSeg && okSearch;
  });

  el.innerHTML = `
    <div class="section-toolbar">
      <div class="search-wrap">
        <input class="search-input" type="search" placeholder="Buscar por nombre o teléfono…" value="${escHtml(clientSearch)}" id="client-search" />
      </div>
      <div class="filter-tabs">
        ${[['all','Todos'],['vip','VIP'],['dulces','Dulces'],['frescos','Frescos'],['reactivar','Reactivar']].map(([v,l]) =>
          `<button class="filter-tab${clientFilter === v ? ' active' : ''}" data-filter="${v}">${l}</button>`).join('')}
      </div>
      <button class="primary-button" type="button" onclick="openClientModal()">+ Nuevo cliente</button>
    </div>

    <article class="panel table-panel">
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
              <td><strong>${escHtml(c.name)}</strong></td>
              <td><a class="phone-link" href="https://wa.me/52${c.phone}" target="_blank" rel="noopener">${c.phone}</a></td>
              <td>${segBadge(c.segment)}</td>
              <td>${c.purchases}</td>
              <td>${fmt(c.totalSpent)}</td>
              <td>${fmtDate(c.lastPurchase)}</td>
              <td class="row-actions">
                <button class="icon-btn" data-edit-client="${c.id}" title="Editar">✏️</button>
                <button class="icon-btn" data-del-client="${c.id}" title="Eliminar">🗑️</button>
              </td>
            </tr>`).join('') : `<tr><td colspan="7" class="empty-row">Sin resultados</td></tr>`}
        </tbody>
      </table>
    </article>`;

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
      ` : ''}
      <label>Notas<textarea name="notes" rows="2">${escHtml(c?.notes || '')}</textarea></label>
      <button class="primary-button" type="submit">${edit ? 'Guardar cambios' : 'Agregar cliente'}</button>
    </form>`);

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
      state.clients.push({
        id: uid(), name: fd.get('name'), phone: fd.get('phone'),
        segment: fd.get('segment'), purchases: 0, totalSpent: 0,
        lastPurchase: '', notes: fd.get('notes'),
      });
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
let wa = { segFilter: 'all', selected: [], perfumeId: '' };

function renderWhatsapp() {
  const el = document.getElementById('section-whatsapp');
  const visibleClients  = state.clients.filter(c => wa.segFilter === 'all' || c.segment === wa.segFilter);
  const selectedPerfume = state.perfumes.find(p => p.id === wa.perfumeId);
  const hasBoth         = wa.selected.length > 0 && !!wa.perfumeId;

  el.innerHTML = `
    <div class="wa-layout">
      <article class="panel wa-step">
        <div class="step-badge">1</div>
        <div class="panel-heading compact"><div><span class="eyebrow">Audiencia</span><h2>¿A quién enviar?</h2></div></div>
        <div class="filter-tabs">
          ${[['all','Todos'],['vip','VIP'],['dulces','Dulces'],['frescos','Frescos'],['reactivar','Reactivar']].map(([v,l]) =>
            `<button class="filter-tab${wa.segFilter === v ? ' active' : ''}" data-wa-seg="${v}">${l}</button>`).join('')}
        </div>
        <div class="client-checklist">
          ${visibleClients.map(c => `
            <label class="check-row">
              <input type="checkbox" value="${c.id}" data-cc ${wa.selected.includes(c.id) ? 'checked' : ''} />
              <span>${escHtml(c.name)}</span>
              ${segBadge(c.segment)}
              <span class="phone-muted">${c.phone}</span>
            </label>`).join('')}
          ${!visibleClients.length ? '<span class="muted-note">Sin clientes en este segmento.</span>' : ''}
        </div>
        <small class="muted-note" id="wa-count">${wa.selected.length} seleccionado${wa.selected.length !== 1 ? 's' : ''}</small>
      </article>

      <article class="panel wa-step">
        <div class="step-badge">2</div>
        <div class="panel-heading compact"><div><span class="eyebrow">Producto</span><h2>¿Qué ofrecer?</h2></div></div>
        <div class="perfume-selector">
          ${state.perfumes.map(p => `
            <button class="perfume-option${wa.perfumeId === p.id ? ' selected' : ''}" data-po="${p.id}">
              ${p.photo
                ? `<img class="po-thumb" src="${p.photo}" alt="" />`
                : `<span class="dot ${p.colorClass}"></span>`}
              <span>${escHtml(p.name)}</span>
              <strong>${fmt(p.price)}</strong>
            </button>`).join('')}
          ${!state.perfumes.length ? '<span class="muted-note">Agrega perfumes primero.</span>' : ''}
        </div>
      </article>

      <article class="panel wa-step wa-preview-step">
        <div class="step-badge">3</div>
        <div class="panel-heading compact"><div><span class="eyebrow">Mensaje</span><h2>Vista previa</h2></div></div>
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
            <span class="wa-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.526 5.862L0 24l6.293-1.494A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.371l-.36-.213-3.733.885.936-3.618-.234-.372A9.817 9.817 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            </span>
            Mandar WhatsApp
          </button>
          <button class="primary-button wide" id="wa-send" ${hasBoth ? '' : 'disabled'}>
            Registrar envío (${wa.selected.length})
          </button>
        </div>
      </article>
    </div>`;

  // Segment filter
  el.querySelectorAll('[data-wa-seg]').forEach(btn => btn.addEventListener('click', () => {
    wa.segFilter = btn.dataset.waSeg; wa.selected = []; renderWhatsapp();
  }));

  // Checkboxes (live update without full re-render)
  el.querySelectorAll('[data-cc]').forEach(cb => cb.addEventListener('change', () => {
    wa.selected = [...el.querySelectorAll('[data-cc]:checked')].map(x => x.value);
    const hb = wa.selected.length > 0 && !!wa.perfumeId;
    el.querySelector('#wa-count').textContent = `${wa.selected.length} seleccionado${wa.selected.length !== 1 ? 's' : ''}`;
    el.querySelector('#wa-send').disabled = !hb;
    el.querySelector('#wa-send').textContent = `Registrar envío (${wa.selected.length})`;
    el.querySelector('#wa-copy').disabled = !hb;
    el.querySelector('#wa-open').disabled = !hb;
    refreshBubble(el, visibleClients);
  }));

  // Perfume selection
  el.querySelectorAll('[data-po]').forEach(btn => btn.addEventListener('click', () => {
    wa.perfumeId = btn.dataset.po;
    el.querySelectorAll('[data-po]').forEach(b => b.classList.toggle('selected', b === btn));
    const hb = wa.selected.length > 0 && !!wa.perfumeId;
    el.querySelector('#wa-send').disabled = !hb;
    el.querySelector('#wa-copy').disabled = !hb;
    el.querySelector('#wa-open').disabled = !hb;
    refreshBubble(el, visibleClients);
  }));

  // Mandar WhatsApp
  el.querySelector('#wa-open').addEventListener('click', () => {
    const perf = state.perfumes.find(p => p.id === wa.perfumeId);
    if (!perf) return;
    wa.selected.forEach((cid, i) => {
      const client = state.clients.find(c => c.id === cid);
      if (!client) return;
      const msg  = buildPlainMessage(client.name.split(' ')[0], perf);
      const url  = `https://wa.me/52${client.phone}?text=${encodeURIComponent(msg)}`;
      setTimeout(() => window.open(url, '_blank'), i * 400);
    });
  });

  // Copy
  el.querySelector('#wa-copy').addEventListener('click', () => {
    const perf   = state.perfumes.find(p => p.id === wa.perfumeId);
    const fname  = wa.selected.length === 1
      ? (state.clients.find(c => c.id === wa.selected[0])?.name.split(' ')[0] || 'cliente')
      : 'cliente';
    const text = `Hola ${fname}, nos llegó ${perf.name}.\n\n${perf.description}\n\nPrecio: ${fmt(perf.price)}. ¿Te aparto uno?`;
    navigator.clipboard.writeText(text).then(() => {
      const btn = el.querySelector('#wa-copy');
      btn.textContent = '✓ Copiado';
      setTimeout(() => { btn.textContent = 'Copiar mensaje'; }, 2000);
    });
  });

  // Register send
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
    wa.selected = []; wa.perfumeId = '';
    const btn = el.querySelector('#wa-send');
    btn.textContent = '✓ Registrado en pipeline';
    btn.disabled = true;
    setTimeout(() => renderWhatsapp(), 1400);
  });
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

// ── VENTAS ───────────────────────────────────────────────
function renderVentas() {
  const el = document.getElementById('section-ventas');

  el.innerHTML = `
    <div class="section-toolbar">
      <div></div>
      <button class="primary-button" type="button" onclick="openSaleModal()">+ Nueva oportunidad</button>
    </div>
    <div class="kanban">
      ${STATUS_ORDER.map(status => {
        const cards = state.sales.filter(s => s.status === status);
        const total = cards.reduce((sum, s) => sum + s.amount, 0);
        return `
          <div class="kanban-col">
            <div class="kanban-header">
              <span class="kanban-label">${STATUS_LABELS[status]}</span>
              <span class="kanban-count">${cards.length}</span>
            </div>
            <div class="kanban-total">${fmt(total)}</div>
            <div class="kanban-cards">
              ${cards.map(s => `
                <article class="kanban-card">
                  <strong>${escHtml(s.clientName)}</strong>
                  <span>${escHtml(s.perfumeName)}</span>
                  <div class="kanban-card-footer">
                    <strong>${fmt(s.amount)}</strong>
                    <span class="muted-note">${fmtDate(s.date)}</span>
                  </div>
                  <div class="kanban-card-actions">
                    ${status !== 'pagado'
                      ? `<button class="advance-btn" data-advance="${s.id}">Avanzar →</button>`
                      : '<span class="paid-badge">✓ Pagado</span>'}
                    <button class="icon-btn small" data-del-sale="${s.id}" title="Eliminar">🗑️</button>
                  </div>
                </article>`).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>`;

  el.querySelectorAll('[data-advance]').forEach(btn =>
    btn.addEventListener('click', () => advanceSale(btn.dataset.advance)));

  el.querySelectorAll('[data-del-sale]').forEach(btn =>
    btn.addEventListener('click', () => deleteSale(btn.dataset.delSale)));
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
        <select name="clientId" required>
          <option value="">Seleccionar…</option>
          ${state.clients.map(c => `<option value="${c.id}">${escHtml(c.name)}</option>`).join('')}
        </select>
      </label>
      <label>Perfume
        <select name="perfumeId" required>
          <option value="">Seleccionar…</option>
          ${state.perfumes.map(p => `<option value="${p.id}">${escHtml(p.name)} — ${fmt(p.price)}</option>`).join('')}
        </select>
      </label>
      <label>Estado inicial
        <select name="status">
          ${STATUS_ORDER.map(s => `<option value="${s}">${STATUS_LABELS[s]}</option>`).join('')}
        </select>
      </label>
      <button class="primary-button" type="submit">Agregar</button>
    </form>`);

  document.getElementById('sale-form').addEventListener('submit', e => {
    e.preventDefault();
    const fd     = new FormData(e.target);
    const client = state.clients.find(c => c.id === fd.get('clientId'));
    const perf   = state.perfumes.find(p => p.id === fd.get('perfumeId'));
    if (!client || !perf) return;
    state.sales.push({
      id: uid(), clientId: client.id, clientName: client.name,
      perfumeId: perf.id, perfumeName: perf.name,
      amount: perf.price, status: fd.get('status'),
      date: new Date().toISOString().split('T')[0],
    });
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

// ── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  document.querySelectorAll('.theme-button').forEach(btn =>
    btn.addEventListener('click', () => {
      const neon = btn.dataset.theme === 'neon';
      document.body.classList.toggle('theme-neon', neon);
      document.body.classList.toggle('theme-minimal', !neon);
      document.querySelectorAll('.theme-button').forEach(b => b.classList.toggle('active', b === btn));
    }));

  // Nav
  document.querySelectorAll('.nav-item[data-nav]').forEach(btn =>
    btn.addEventListener('click', () => navigate(btn.dataset.nav)));

  // Modal close
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Sidebar suggestion → WhatsApp
  document.getElementById('suggestion-btn').addEventListener('click', () => {
    wa.segFilter = 'reactivar'; navigate('whatsapp');
  });

  navigate('panel');
});
