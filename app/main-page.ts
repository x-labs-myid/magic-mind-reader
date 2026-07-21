import { EventData, Page, Frame, Observable } from '@nativescript/core';
import { overrideLocale } from '@nativescript/localize';
import { AudioHelper } from './shared/audio-helper';

let animationFrameId: number | null = null;
let isAnimating = false;

interface FloatingNumber {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fontSize: number;
  text: string;
  color: string;
  alpha: number;
}

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  isAnimating = true;
  page.bindingContext = new Observable();
}

export function selectEnglish() {
  AudioHelper.playTap();
  overrideLocale('en');
  Frame.topmost().navigate({
    moduleName: 'main-page',
    clearHistory: true,
    animated: false
  });
}

export function selectIndonesian() {
  AudioHelper.playTap();
  overrideLocale('id');
  Frame.topmost().navigate({
    moduleName: 'main-page',
    clearHistory: true,
    animated: false
  });
}

export function startPlay() {
  AudioHelper.playTap();
  isAnimating = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  Frame.topmost().navigate({
    moduleName: 'pages/game-page',
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

  // Colorful numbers to float in background
  const colors = [
    'rgba(236, 72, 153, ',  // Pink-500
    'rgba(99, 102, 241, ',  // Indigo-500
    'rgba(168, 85, 247, ',  // Purple-500
    'rgba(245, 158, 11, ',  // Amber-500
    'rgba(16, 185, 129, '   // Emerald-500
  ];

  const floatingNumbers: FloatingNumber[] = [];
  for (let i = 0; i < 20; i++) {
    floatingNumbers.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      fontSize: Math.floor(Math.random() * 20) + 16,
      text: String(Math.floor(Math.random() * 31) + 1),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  function render() {
    if (!isAnimating) return;

    ctx.clearRect(0, 0, width, height);

    // Draw background subtle gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#0f172a'); // slate-900
    grad.addColorStop(1, '#1e1b4b'); // indigo-950
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Render floating numbers
    for (const num of floatingNumbers) {
      num.x += num.vx;
      num.y += num.vy;

      // Wrap around bounds
      if (num.x < -30) num.x = width + 30;
      if (num.x > width + 30) num.x = -30;
      if (num.y < -30) num.y = height + 30;
      if (num.y > height + 30) num.y = -30;

      ctx.fillStyle = num.color + num.alpha + ')';
      ctx.font = `bold ${num.fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num.text, num.x, num.y);
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}
