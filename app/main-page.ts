import { EventData, Page, Frame, Observable } from '@nativescript/core';
import { AudioHelper } from './shared/audio-helper';
import { getAppLocale, setAppLocale } from './shared/locale-manager';

let animationFrameId: number | null = null;
let isAnimating = false;

interface FloatingBubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  numberText: string;
  fillColor: string;
}

let mainViewModel: Observable;

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  isAnimating = true;

  const currentLang = getAppLocale();
  const isMuted = AudioHelper.isMuted();

  mainViewModel = new Observable();
  mainViewModel.set('isSettingsOpen', false);
  mainViewModel.set('isHowItWorksOpen', false);
  mainViewModel.set('isMuted', isMuted);
  mainViewModel.set('currentLangBadge', currentLang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN');
  mainViewModel.set('soundIcon', isMuted ? '\uf026' : '\uf028');
  mainViewModel.set('accordionIcon', '▼');

  page.bindingContext = mainViewModel;

  // Start backsound on Home page
  AudioHelper.startBacksound();
}

export function onNavigatingFrom(args: EventData) {
  // Stop backsound when leaving Home page
  AudioHelper.stopBacksound();
}

export function toggleSettings() {
  AudioHelper.playTap();
  if (mainViewModel) {
    const current = mainViewModel.get('isSettingsOpen');
    mainViewModel.set('isSettingsOpen', !current);
  }
}

export function toggleHowItWorks() {
  AudioHelper.playTap();
  if (mainViewModel) {
    const current = mainViewModel.get('isHowItWorksOpen');
    mainViewModel.set('isHowItWorksOpen', !current);
    mainViewModel.set('accordionIcon', !current ? '▲' : '▼');
  }
}

export function toggleSound() {
  const isMuted = AudioHelper.toggleMute();
  if (mainViewModel) {
    mainViewModel.set('isMuted', isMuted);
    mainViewModel.set('soundIcon', isMuted ? '\uf026' : '\uf028');
  }
}

function changeLanguage(lang: string) {
  AudioHelper.playTap();
  setAppLocale(lang);

  if (mainViewModel) {
    mainViewModel.set('isSettingsOpen', false);
    mainViewModel.set('currentLangBadge', lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN');
  }

  Frame.topmost().navigate({
    moduleName: 'main-page',
    clearHistory: true,
    animated: false
  });
}

export function selectEnglish() {
  changeLanguage('en');
}

export function selectIndonesian() {
  changeLanguage('id');
}

export function goAbout() {
  AudioHelper.playTap();
  AudioHelper.stopBacksound();
  isAnimating = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  Frame.topmost().navigate({
    moduleName: 'pages/about-page',
    animated: true,
    transition: {
      name: 'slideTop',
      duration: 300,
      curve: 'easeInOut'
    }
  });
}

export function startPlay() {
  AudioHelper.playTap();
  AudioHelper.stopBacksound();
  isAnimating = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  Frame.topmost().navigate({
    moduleName: 'pages/select-topic-page',
    animated: true,
    transition: {
      name: 'slide',
      duration: 300,
      curve: 'easeInOut'
    }
  });
}

export function onCanvasReady(args: any) {
  const canvas = args.object;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const scale = width / 360;

  const bubbleColors = [
    '#00e5ff',
    '#ff4081',
    '#ffee00',
    '#2ecc71',
    '#ff9800',
    '#a855f7'
  ];

  const floatingBubbles: FloatingBubble[] = [];
  for (let i = 0; i < 16; i++) {
    const radius = (Math.floor(Math.random() * 10) + 20) * scale;
    floatingBubbles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2 * scale,
      vy: (Math.random() - 0.5) * 2 * scale,
      radius: radius,
      numberText: String(Math.floor(Math.random() * 31) + 1),
      fillColor: bubbleColors[i % bubbleColors.length]
    });
  }

  function render() {
    if (!isAnimating) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < floatingBubbles.length; i++) {
      const b = floatingBubbles[i];
      b.x += b.vx;
      b.y += b.vy;

      if (b.x < -b.radius * 2) b.x = width + b.radius * 2;
      if (b.x > width + b.radius * 2) b.x = -b.radius * 2;
      if (b.y < -b.radius * 2) b.y = height + b.radius * 2;
      if (b.y > height + b.radius * 2) b.y = -b.radius * 2;

      ctx.save();

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = b.fillColor;
      ctx.fill();

      ctx.lineWidth = Math.max(2, 3 * scale);
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = `900 ${Math.floor(b.radius * 0.9)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.numberText, b.x, b.y);

      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}
