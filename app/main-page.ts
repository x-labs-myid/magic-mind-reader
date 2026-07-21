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

export function goAbout() {
  AudioHelper.playTap();
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

    // Deep Indigo Night sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#0f172a'); // slate-900
    grad.addColorStop(0.5, '#1e1b4b'); // indigo-950
    grad.addColorStop(1, '#311042'); // purple-950
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Playful neon colors for magic floating items
    const particleColors = ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'];

    // Render floating numbers and magical glowing bubbles
    for (let i = 0; i < floatingNumbers.length; i++) {
      const num = floatingNumbers[i];
      num.x += num.vx;
      num.y += num.vy;

      // Wrap around bounds
      if (num.x < -30) num.x = width + 30;
      if (num.x > width + 30) num.x = -30;
      if (num.y < -30) num.y = height + 30;
      if (num.y > height + 30) num.y = -30;

      const color = particleColors[i % particleColors.length];

      // Draw soft ambient glow circle
      ctx.beginPath();
      ctx.arc(num.x, num.y, num.fontSize * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.12;
      ctx.fill();

      // Draw floating number
      ctx.globalAlpha = num.alpha + 0.3;
      ctx.fillStyle = color;
      ctx.font = `900 ${num.fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num.text, num.x, num.y);

      ctx.globalAlpha = 1.0;
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}
