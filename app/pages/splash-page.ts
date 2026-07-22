import { EventData, Page, Frame, Observable, ApplicationSettings } from '@nativescript/core';
import { overrideLocale } from '@nativescript/localize';

let animationFrameId: number | null = null;
let isAnimating = false;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  isAnimating = true;
  page.bindingContext = new Observable();

  const savedLang = ApplicationSettings.getString('app_language', '');
  if (savedLang) {
    overrideLocale(savedLang);
  }

  setTimeout(() => {
    isAnimating = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    const hasSelectedLanguage = ApplicationSettings.getBoolean('has_selected_language', false);
    if (!hasSelectedLanguage) {
      Frame.topmost().navigate({
        moduleName: 'pages/select-language-page',
        clearHistory: true,
        transition: {
          name: 'fade',
          duration: 400
        }
      });
    } else {
      Frame.topmost().navigate({
        moduleName: 'main-page',
        clearHistory: true,
        transition: {
          name: 'fade',
          duration: 400
        }
      });
    }
  }, 1800);
}

export function onCanvasReady(args: any) {
  const canvas = args.object;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const particles: Particle[] = [];
  const colors = ['#ffee00', '#ff4081', '#00e5ff', '#2ecc71', '#ff9800', '#a855f7'];

  for (let i = 0; i < 25; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 8 + 4,
      color: colors[i % colors.length]
    });
  }

  function render() {
    if (!isAnimating) return;

    // Pure White Canvas Background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Black stroke outline for Neo-Brutalism
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}
