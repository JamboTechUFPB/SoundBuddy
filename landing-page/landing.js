const frames = [
  { label: 'DESCUBRA GENTE PARA CRIAR', title: 'Encontre seu próximo som.', subtitle: 'Busque por música, cidade ou instrumento.', search: '⌕  voz e violão', person: 'Lia Nascimento', role: 'Voz & violão · Recife, PE', detailLabel: 'PERFIL EM DESTAQUE', detailTitle: 'Uma voz para sua próxima ideia.', detailText: 'MPB, bossa nova e formato acústico para encontros intimistas.', cta: 'Ver perfil' },
  { label: 'CONHEÇA O TRABALHO', title: 'Pessoas com contexto.', subtitle: 'Repertório, experiência e disponibilidade.', search: '⌕  Lia Nascimento', person: 'Lia Nascimento', role: 'Voz & violão · Recife, PE', detailLabel: 'AGENDA ABERTA EM NOVEMBRO', detailTitle: 'Voz e violão · 90 min', detailText: 'Repertório de Gal Costa, Djavan, Céu e autorais. Solo ou duo com percussão.', cta: 'Escrever proposta' },
  { label: 'COMECE UMA COLABORAÇÃO', title: 'Uma ideia pode ganhar forma.', subtitle: 'Escreva uma proposta com os detalhes do projeto.', search: '⌕  evento cultural', person: 'Lia Nascimento', role: 'Voz & violão · Recife, PE', detailLabel: 'PROPOSTA PARA LIA', detailTitle: 'Duo acústico em Recife', detailText: 'Evento cultural · sexta à noite · apresentação de 90 minutos.', cta: 'Salvar proposta' }
];
const buttons = [...document.querySelectorAll('[data-step]')];
const nodes = Object.fromEntries(['label','title','subtitle','search','person','role','detail-label','detail-title','detail-text','cta'].map(name => [name, document.querySelector(`#preview-${name}`)]));
let step = 0;
let timer;
function show(index) {
  step = index;
  const frame = frames[step];
  Object.entries({ label: frame.label, title: frame.title, subtitle: frame.subtitle, person: frame.person, role: frame.role, 'detail-label': frame.detailLabel, 'detail-title': frame.detailTitle, 'detail-text': frame.detailText }).forEach(([key,value]) => { nodes[key].textContent = value; });
  nodes.search.innerHTML = `${frame.search} <span>↵</span>`;
  nodes.cta.innerHTML = `${frame.cta} <span>↗</span>`;
  buttons.forEach((button,i) => button.setAttribute('aria-pressed', String(i === step)));
  document.querySelector('#preview-progress').style.transform = `translateX(${step * 100}%)`;
  document.querySelector('.preview-frame').dataset.step = String(step);
}
function start() { clearInterval(timer); if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; timer = setInterval(() => { if (document.visibilityState === 'visible') show((step + 1) % frames.length); }, 3400); }
buttons.forEach(button => button.addEventListener('click', () => { show(Number(button.dataset.step)); start(); }));
document.querySelector('.preview-frame').addEventListener('pointerenter', () => clearInterval(timer));
document.querySelector('.preview-frame').addEventListener('pointerleave', start);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') start(); else clearInterval(timer); });
show(0); start();
