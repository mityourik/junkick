const NIGHT_START = 19;
const NIGHT_END = 7;

function isNight(date = new Date()): boolean {
  const h = date.getHours();
  return h >= NIGHT_START || h < NIGHT_END;
}

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
}

function scheduleNextCheck() {
  return window.setTimeout(initTimeTheme, 5 * 60 * 1000);
}

let timer: number | undefined;

export function initTimeTheme() {
  if (timer) window.clearTimeout(timer);
  const theme: 'light' | 'dark' = isNight() ? 'dark' : 'light';
  applyTheme(theme);
  timer = scheduleNextCheck();
}
