import { EventData, Page, Frame, Observable, Application } from '@nativescript/core';
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

  const floatingNumbers: FloatingNumber[] = [];
  for (let i = 0; i < 20; i++) {
    floatingNumbers.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      fontSize: Math.floor(Math.random() * 20) + 16,
      text: String(Math.floor(Math.random() * 31) + 1),
      alpha: Math.random() * 0.3 + 0.05
    });
  }

  function render() {
    if (!isAnimating) return;

    ctx.clearRect(0, 0, width, height);

    // Dynamic background based on light/dark mode
    const isDark = Application.systemAppearance() === 'dark';
    
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    if (isDark) {
      grad.addColorStop(0, '#09090b'); // zinc-950
      grad.addColorStop(1, '#18181b'); // zinc-900
    } else {
      grad.addColorStop(0, '#ffffff'); // white
      grad.addColorStop(1, '#f4f4f5'); // zinc-100
    }
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

      // Color changes according to theme
      const colorPrefix = isDark ? 'rgba(255, 255, 255, ' : 'rgba(9, 9, 11, ';
      ctx.fillStyle = colorPrefix + num.alpha + ')';
      ctx.font = `bold ${num.fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num.text, num.x, num.y);
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}
