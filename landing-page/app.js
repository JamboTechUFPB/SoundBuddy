import { people, opportunities } from './data.js';

const app = document.querySelector('#app');
const savedKey = 'soundbuddy-demo-saved';
const draftKey = 'soundbuddy-demo-drafts';
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private storage can be unavailable */ } };
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const avatar = (person, extra = '') => `<span class="avatar avatar--${person.tone} ${extra}" aria-hidden="true">${person.initials}</span>`;
const tagList = (tags) => tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
const params = new URLSearchParams(location.search);
let state = { view: 'discover', query: '', filter: 'Todos', selected: params.get('perfil') || 'lia', saved: read(savedKey, []), drafts: read(draftKey, []), notice: '', compose: null };
if (!people.some(person => person.id === state.selected)) state.selected = 'lia';
function matchingPeople() {
  const q = state.query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return people.filter(person => `${person.name} ${person.role} ${person.city} ${person.tags.join(' ')}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(q) && (state.filter === 'Todos' || person.tags.includes(state.filter)));
}
function selectFirstMatch() {
  const matches = matchingPeople();
  if (matches.length && !matches.some(person => person.id === state.selected)) state.selected = matches[0].id;
}

function selectPerson(id) {
  state.selected = id;
  const url = new URL(location.href);
  url.searchParams.set('perfil', id);
  history.replaceState(null, '', url);
  render();
  if (innerWidth < 1000) document.querySelector('#profile-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function personCard(person) {
  const active = state.selected === person.id;
  return `<button type="button" class="person-card ${active ? 'is-selected' : ''}" data-person="${person.id}" aria-pressed="${active}">
    ${avatar(person)}<span class="person-card__body"><strong>${person.name}</strong><span>${person.role} <span aria-hidden="true">·</span> ${person.city}</span><span class="person-card__tags">${tagList(person.tags.slice(0, 2))}</span></span><span class="person-card__arrow" aria-hidden="true">↗</span>
  </button>`;
}

function profilePanel(person) {
  const saved = state.saved.includes(person.id);
  return `<aside class="profile-panel" id="profile-panel" aria-label="Perfil de ${person.name}">
    <div class="profile-cover profile-cover--${person.tone}"><span>SoundBuddy / Em foco</span><span class="cover-orbit" aria-hidden="true">✳</span></div>
    <div class="profile-panel__body"><div class="profile-identity">${avatar(person, 'avatar--large')}<button type="button" class="icon-button" data-save="${person.id}" aria-label="${saved ? 'Remover dos salvos' : 'Salvar perfil de ' + person.name}" aria-pressed="${saved}" title="${saved ? 'Remover dos salvos' : 'Salvar perfil'}">${saved ? '♥' : '♡'}</button></div>
      <div class="eyebrow">PERFIL EM DESTAQUE</div><h2>${person.name}</h2><p class="profile-role">${person.role} <span>·</span> ${person.city}</p>
      <p class="profile-about">${person.about}</p><div class="profile-tags">${tagList(person.tags)}</div>
      <div class="availability"><span class="availability__dot"></span><span>${person.available}</span></div>
      <div class="profile-facts"><div><span>O QUE OFERECE</span><strong>${person.work}</strong><small>${person.detail}</small></div><div><span>EXPERIÊNCIA</span><strong>${person.experience}</strong></div></div>
      <button type="button" class="button button--dark button--wide" data-compose="${person.id}">Escrever proposta <span aria-hidden="true">↗</span></button>
      <p class="profile-note">Nesta demonstração, a proposta fica salva neste navegador.</p>
    </div>
  </aside>`;
}

function discoverView() {
  const matches = matchingPeople();
  return `<div class="content-heading"><div><p class="eyebrow">DESCUBRA GENTE PARA CRIAR</p><h1>Encontre seu próximo som.</h1><p>Uma seleção de músicos e produtores independentes no Nordeste.</p></div><span class="count-pill">${matches.length} perfis</span></div>
    <label class="search-box"><span aria-hidden="true">⌕</span><span class="sr-only">Buscar músicos</span><input id="search" type="search" placeholder="Busque por nome, instrumento, estilo ou cidade" value="${escapeHtml(state.query)}" autocomplete="off"></label>
    <div class="filter-row" role="group" aria-label="Filtrar por estilo">${['Todos','MPB','Jazz','Soul','Produção','Indie','Rock'].map(filter => `<button type="button" data-filter="${filter}" aria-pressed="${state.filter === filter}">${filter}</button>`).join('')}</div>
    <div class="section-head"><h2>Para conhecer</h2><span>Perfis selecionados para explorar a plataforma</span></div>
    <div class="person-list">${matches.length ? matches.map(personCard).join('') : '<div class="empty-state"><strong>Nenhum perfil encontrado.</strong><p>Tente outro nome, estilo ou cidade.</p></div>'}</div>`;
}

function activityView() {
  return `<div class="content-heading"><div><p class="eyebrow">CONVERSAS QUE COMEÇAM COM MÚSICA</p><h1>O que está acontecendo.</h1><p>Novidades da comunidade incluídas nesta demonstração.</p></div></div><div class="activity-list">${people.map(person => `<article class="activity-card"><div class="activity-card__header">${avatar(person)}<div><button type="button" data-person="${person.id}">${person.name}</button><span>${person.role} · ${person.time}</span></div></div><p>${person.post}</p><div class="activity-card__footer">${tagList(person.tags.slice(0, 2))}<button type="button" data-person="${person.id}">Ver perfil ↗</button></div></article>`).join('')}</div>`;
}

function opportunitiesView() {
  return `<div class="content-heading"><div><p class="eyebrow">ENCONTROS POSSÍVEIS</p><h1>Oportunidades.</h1><p>Briefings exemplares para mostrar como uma parceria começa.</p></div></div><div class="opportunity-list">${opportunities.map(item => `<article class="opportunity-card"><div class="opportunity-card__top"><span class="eyebrow">${item.by}</span><span>${item.when}</span></div><h2>${item.title}</h2><p class="opportunity-place">⌁ ${item.place}</p><p>${item.description}</p><div class="opportunity-card__footer">${tagList(item.tags)}<button type="button" data-opportunity="${item.id}">Encontrar músicos ↗</button></div></article>`).join('')}</div>`;
}

function savedView() {
  const matches = people.filter(person => state.saved.includes(person.id));
  return `<div class="content-heading"><div><p class="eyebrow">SUA SELEÇÃO</p><h1>Perfis salvos.</h1><p>Guarde músicos interessantes para voltar depois.</p></div></div><div class="person-list">${matches.length ? matches.map(personCard).join('') : '<div class="empty-state"><strong>Comece sua seleção.</strong><p>Abra um perfil e toque no coração para salvá-lo aqui.</p><button type="button" class="text-link" data-view="discover">Explorar músicos ↗</button></div>'}</div>`;
}

function draftsView() {
  return `<div class="content-heading"><div><p class="eyebrow">SEUS RASCUNHOS</p><h1>Propostas.</h1><p>Mensagens criadas nesta demonstração e guardadas neste navegador.</p></div></div><div class="draft-list">${state.drafts.length ? state.drafts.map(draft => `<article class="draft-card"><span class="eyebrow">RASCUNHO SALVO</span><h2>Para ${escapeHtml(draft.to)}</h2><p class="draft-subject">${escapeHtml(draft.subject)}</p><p>${escapeHtml(draft.message)}</p><small>${escapeHtml(draft.date)}</small></article>`).join('') : '<div class="empty-state"><strong>Você ainda não escreveu uma proposta.</strong><p>Escolha um perfil e conte o que gostaria de criar junto.</p><button type="button" class="text-link" data-view="discover">Explorar músicos ↗</button></div>'}</div>`;
}

function composeModal() {
  if (!state.compose) return '';
  const person = people.find(item => item.id === state.compose);
  return `<div class="modal-backdrop" data-close-backdrop><section class="modal" role="dialog" aria-modal="true" aria-labelledby="compose-title"><button type="button" class="modal-close" data-close aria-label="Fechar">×</button><p class="eyebrow">COMECE UMA COLABORAÇÃO</p><h2 id="compose-title">Escrever para ${person.name}</h2><p>Um bom primeiro contato inclui o formato, a data e o que você já tem em mente.</p><form id="compose-form"><label>Assunto<input name="subject" maxlength="80" required placeholder="Ex.: Duo acústico para evento em Recife"></label><label>Sua proposta<textarea name="message" minlength="20" maxlength="1000" required rows="6" placeholder="Conte sobre o projeto, o local, a data e a parceria que procura."></textarea></label><button type="submit" class="button button--dark button--wide">Salvar proposta <span aria-hidden="true">↗</span></button></form><small>Esta demonstração não envia mensagens. Seu texto ficará salvo apenas neste navegador.</small></section></div>`;
}

function render() {
  const current = people.find(person => person.id === state.selected) || people[0];
  const content = { discover: discoverView, activity: activityView, opportunities: opportunitiesView, saved: savedView, drafts: draftsView }[state.view]();
  app.innerHTML = `<div class="app-shell"><aside class="app-sidebar"><a class="brand" href="../" aria-label="SoundBuddy, início"><span class="brand-mark">♪</span>sound<span>buddy</span><i>.</i></a><p class="sidebar-label">SEU ESPAÇO</p><nav class="app-nav" aria-label="Navegação principal">${[['discover','⌕','Descobrir'],['activity','▦','Comunidade'],['opportunities','✳','Oportunidades'],['saved','♡','Salvos'],['drafts','✉','Propostas']].map(([id,icon,label]) => `<button type="button" data-view="${id}" ${state.view === id ? 'aria-current="page"' : ''}><span aria-hidden="true">${icon}</span>${label}${id === 'saved' && state.saved.length ? `<em>${state.saved.length}</em>` : ''}${id === 'drafts' && state.drafts.length ? `<em>${state.drafts.length}</em>` : ''}</button>`).join('')}</nav><div class="sidebar-bottom"><div class="sidebar-note"><span class="sidebar-note__icon">✳</span><strong>Uma vitrine para novas conexões.</strong><p>Explore perfis, salve referências e esboce uma proposta.</p></div><a href="../">← Voltar à apresentação</a></div></aside>
  <div class="app-main"><header class="app-topbar"><span>DEMONSTRAÇÃO INTERATIVA</span><span class="app-topbar__right">Dados de exemplo <span class="topbar-dot"></span></span></header><div class="app-columns"><main class="app-content">${content}</main>${profilePanel(current)}</div></div></div>${composeModal()}${state.notice ? `<div class="toast" role="status">${escapeHtml(state.notice)}</div>` : ''}`;
  if (state.compose) document.querySelector('[name="subject"]')?.focus();
}

app.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (event.target.matches('[data-close-backdrop]')) { state.compose = null; render(); return; }
  if (!target) return;
  if (target.dataset.view) { state.view = target.dataset.view; state.notice = ''; render(); scrollTo(0, 0); }
  else if (target.dataset.person) selectPerson(target.dataset.person);
  else if (target.dataset.filter) { state.filter = target.dataset.filter; selectFirstMatch(); render(); document.querySelector('#search')?.focus(); }
  else if (target.dataset.opportunity) { const item = opportunities.find(value => value.id === target.dataset.opportunity); state.view = 'discover'; state.query = ''; state.filter = item.match; selectFirstMatch(); render(); scrollTo(0, 0); }
  else if (target.dataset.save) { const id = target.dataset.save; state.saved = state.saved.includes(id) ? state.saved.filter(value => value !== id) : [...state.saved, id]; write(savedKey, state.saved); state.notice = state.saved.includes(id) ? 'Perfil salvo na sua seleção.' : 'Perfil removido dos salvos.'; render(); }
  else if (target.dataset.compose) { state.compose = target.dataset.compose; render(); }
  else if ('close' in target.dataset) { state.compose = null; render(); }
});

app.addEventListener('input', event => {
  if (event.target.id !== 'search') return;
  const start = event.target.selectionStart;
  state.query = event.target.value;
  selectFirstMatch();
  render();
  const input = document.querySelector('#search');
  input.focus(); input.setSelectionRange(start, start);
});

app.addEventListener('submit', event => {
  if (event.target.id !== 'compose-form') return;
  event.preventDefault();
  const form = new FormData(event.target);
  const person = people.find(item => item.id === state.compose);
  state.drafts.unshift({ to: person.name, subject: String(form.get('subject')).trim(), message: String(form.get('message')).trim(), date: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date()) });
  write(draftKey, state.drafts);
  state.compose = null; state.view = 'drafts'; state.notice = 'Proposta salva neste navegador.'; render();
});

document.addEventListener('keydown', event => { if (event.key === 'Escape' && state.compose) { state.compose = null; render(); } });
render();
