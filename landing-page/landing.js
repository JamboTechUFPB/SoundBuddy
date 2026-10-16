const buttons = [...document.querySelectorAll('[data-step]')];
const screens = [...document.querySelectorAll('[data-preview-screen]')];
const navItems = [...document.querySelectorAll('[data-preview-nav]')];
const preview = document.querySelector('.preview-frame');
const progress = document.querySelector('#preview-progress');
let step = 0;
let timer;

function show(index) {
  step = index;
  screens.forEach((screen, screenIndex) => { screen.hidden = screenIndex !== step; });
  navItems.forEach((item, navIndex) => {
    if (navIndex === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  buttons.forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(buttonIndex === step)));
  progress.style.transform = `translateX(${step * 100}%)`;
  preview.dataset.step = String(step);
}

function start() {
  clearInterval(timer);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  timer = setInterval(() => {
    if (document.visibilityState === 'visible') show((step + 1) % screens.length);
  }, 3500);
}

buttons.forEach(button => button.addEventListener('click', () => {
  show(Number(button.dataset.step));
  start();
}));
preview.addEventListener('pointerenter', () => clearInterval(timer));
preview.addEventListener('pointerleave', start);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') start();
  else clearInterval(timer);
});

show(0);
start();
