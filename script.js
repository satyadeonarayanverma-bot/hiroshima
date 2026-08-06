/* ========================================
   ROMANTIC ANIMATED WEBSITE - SCRIPT
   ======================================== */

(function () {
  'use strict';

  // ---- Utility ----
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  // ---- Resize helper ----
  function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // ============================================
  //  1. STARFIELD (twinkling background stars)
  // ============================================
  const starCanvas = document.getElementById('starfield');
  const starCtx = starCanvas.getContext('2d');
  resizeCanvas(starCanvas);

  const stars = [];
  const STAR_COUNT = 180;

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: rand(0, starCanvas.width),
      y: rand(0, starCanvas.height),
      r: rand(0.5, 2),
      alpha: rand(0.2, 1),
      speed: rand(0.003, 0.015),
      phase: rand(0, Math.PI * 2),
      hue: randInt(330, 360), // pinks and reds
    });
  }

  function drawStars(time) {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    for (const s of stars) {
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(time * s.speed + s.phase));
      starCtx.beginPath();
      starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      starCtx.fillStyle = `hsla(${s.hue}, 80%, 80%, ${alpha})`;
      starCtx.fill();

      // subtle glow
      starCtx.beginPath();
      starCtx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      starCtx.fillStyle = `hsla(${s.hue}, 80%, 80%, ${alpha * 0.15})`;
      starCtx.fill();
    }
  }

  // ============================================
  //  2. FIREFLIES (warm floating particles)
  // ============================================
  const ffCanvas = document.getElementById('fireflies');
  const ffCtx = ffCanvas.getContext('2d');
  resizeCanvas(ffCanvas);

  const fireflies = [];
  const FF_COUNT = 60;

  for (let i = 0; i < FF_COUNT; i++) {
    fireflies.push({
      x: rand(0, ffCanvas.width),
      y: rand(0, ffCanvas.height),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      r: rand(1.5, 4),
      hue: rand(340, 370) % 360,
      phase: rand(0, Math.PI * 2),
      speed: rand(0.01, 0.03),
    });
  }

  function drawFireflies(time) {
    ffCtx.clearRect(0, 0, ffCanvas.width, ffCanvas.height);
    for (const f of fireflies) {
      f.x += f.vx + Math.sin(time * 0.001 + f.phase) * 0.3;
      f.y += f.vy + Math.cos(time * 0.001 + f.phase) * 0.3;

      // wrap around
      if (f.x < -10) f.x = ffCanvas.width + 10;
      if (f.x > ffCanvas.width + 10) f.x = -10;
      if (f.y < -10) f.y = ffCanvas.height + 10;
      if (f.y > ffCanvas.height + 10) f.y = -10;

      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(time * f.speed + f.phase));

      // outer glow
      const gradient = ffCtx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
      gradient.addColorStop(0, `hsla(${f.hue}, 90%, 75%, ${alpha * 0.5})`);
      gradient.addColorStop(1, `hsla(${f.hue}, 90%, 75%, 0)`);
      ffCtx.beginPath();
      ffCtx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2);
      ffCtx.fillStyle = gradient;
      ffCtx.fill();

      // core
      ffCtx.beginPath();
      ffCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ffCtx.fillStyle = `hsla(${f.hue}, 90%, 85%, ${alpha})`;
      ffCtx.fill();
    }
  }

  // ============================================
  //  3. RIBBON TRAILS (flowing curves)
  // ============================================
  const ribCanvas = document.getElementById('ribbons');
  const ribCtx = ribCanvas.getContext('2d');
  resizeCanvas(ribCanvas);

  const ribbons = [];
  const RIB_COUNT = 5;

  for (let i = 0; i < RIB_COUNT; i++) {
    ribbons.push({
      yBase: rand(ribCanvas.height * 0.2, ribCanvas.height * 0.8),
      amplitude: rand(40, 100),
      frequency: rand(0.002, 0.005),
      speed: rand(0.0005, 0.002),
      phase: rand(0, Math.PI * 2),
      hue: rand(335, 355),
      width: rand(1, 2.5),
      alpha: rand(0.05, 0.12),
    });
  }

  function drawRibbons(time) {
    ribCtx.clearRect(0, 0, ribCanvas.width, ribCanvas.height);
    for (const r of ribbons) {
      ribCtx.beginPath();
      ribCtx.strokeStyle = `hsla(${r.hue}, 70%, 60%, ${r.alpha})`;
      ribCtx.lineWidth = r.width;
      for (let x = 0; x < ribCanvas.width; x += 3) {
        const y = r.yBase +
          Math.sin(x * r.frequency + time * r.speed + r.phase) * r.amplitude +
          Math.sin(x * r.frequency * 2.3 + time * r.speed * 1.5) * r.amplitude * 0.3;
        if (x === 0) {
          ribCtx.moveTo(x, y);
        } else {
          ribCtx.lineTo(x, y);
        }
      }
      ribCtx.stroke();
    }
  }

  // ============================================
  //  4. ROSE PETALS (DOM-based falling petals)
  // ============================================
  const petalsContainer = document.getElementById('petals-container');
  const petalColors = [
    'linear-gradient(135deg, #ff4d6d, #c9184a)',
    'linear-gradient(135deg, #ff758f, #ff4d6d)',
    'linear-gradient(135deg, #ffb3c1, #ff758f)',
    'linear-gradient(135deg, #e8567d, #b5274e)',
    'linear-gradient(135deg, #ff8fa3, #ff4d6d)',
    'linear-gradient(135deg, #d4526e, #a4133c)',
  ];

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = rand(12, 26);
    const duration = rand(8, 16);
    petal.style.width = size + 'px';
    petal.style.height = size * 1.2 + 'px';
    petal.style.left = rand(-5, 105) + '%';
    petal.style.top = '-30px';
    petal.style.background = petalColors[randInt(0, petalColors.length - 1)];
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = rand(0, 2) + 's';
    petal.style.transform = `rotate(${rand(0, 360)}deg)`;
    petal.style.opacity = '0';
    petalsContainer.appendChild(petal);
    setTimeout(() => petal.remove(), (duration + 3) * 1000);
  }

  setInterval(createPetal, 400);
  // initial burst
  for (let i = 0; i < 15; i++) {
    setTimeout(createPetal, i * 100);
  }

  // ============================================
  //  5. FLOATING HEARTS (DOM-based rising hearts)
  // ============================================
  const heartsContainer = document.getElementById('hearts-container');
  const heartSymbols = ['♥', '♡', '❤', '💕', '💗', '💖'];

  function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    const size = rand(14, 36);
    const duration = rand(8, 15);
    heart.textContent = heartSymbols[randInt(0, heartSymbols.length - 1)];
    heart.style.fontSize = size + 'px';
    heart.style.left = rand(5, 95) + '%';
    heart.style.bottom = '-30px';
    heart.style.animationDuration = duration + 's';
    heart.style.color = `hsla(${randInt(335, 360)}, ${randInt(70, 100)}%, ${randInt(55, 75)}%, ${rand(0.4, 0.8)})`;
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), (duration + 1) * 1000);
  }

  setInterval(createFloatingHeart, 700);
  for (let i = 0; i < 10; i++) {
    setTimeout(createFloatingHeart, i * 200);
  }

  // ============================================
  //  6. CLICK INTERACTIONS (hearts + ripple on click)
  // ============================================
  const rippleLayer = document.getElementById('ripple-layer');

  document.addEventListener('click', function (e) {
    // Ripple
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    rippleLayer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);

    // Burst of hearts
    const burstCount = randInt(5, 10);
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'click-heart';
        heart.textContent = heartSymbols[randInt(0, heartSymbols.length - 1)];
        heart.style.left = (e.clientX + rand(-30, 30)) + 'px';
        heart.style.top = (e.clientY + rand(-20, 20)) + 'px';
        heart.style.fontSize = rand(16, 32) + 'px';
        heart.style.color = `hsla(${randInt(335, 360)}, ${randInt(70, 100)}%, ${randInt(55, 75)}%, 0.9)`;
        rippleLayer.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
      }, i * 50);
    }
  });

  // ============================================
  //  7. MOUSE TRAIL (sparkle particles following cursor)
  // ============================================
  const trailParticles = [];

  document.addEventListener('mousemove', function (e) {
    for (let i = 0; i < 2; i++) {
      trailParticles.push({
        x: e.clientX + rand(-5, 5),
        y: e.clientY + rand(-5, 5),
        r: rand(1.5, 4),
        alpha: 1,
        decay: rand(0.015, 0.035),
        vx: rand(-1, 1),
        vy: rand(-2, -0.5),
        hue: randInt(335, 365) % 360,
      });
    }
  });

  function drawTrail() {
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const p = trailParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        trailParticles.splice(i, 1);
        continue;
      }

      // Draw on the fireflies canvas (same z-index)
      ffCtx.beginPath();
      ffCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ffCtx.fillStyle = `hsla(${p.hue}, 90%, 80%, ${p.alpha})`;
      ffCtx.fill();

      // glow
      const g = ffCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `hsla(${p.hue}, 90%, 80%, ${p.alpha * 0.3})`);
      g.addColorStop(1, `hsla(${p.hue}, 90%, 80%, 0)`);
      ffCtx.beginPath();
      ffCtx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ffCtx.fillStyle = g;
      ffCtx.fill();
    }
  }

  // ============================================
  //  8. SHOOTING STARS (occasional streaks)
  // ============================================
  const shootingStars = [];

  function spawnShootingStar() {
    shootingStars.push({
      x: rand(0, starCanvas.width * 0.7),
      y: rand(0, starCanvas.height * 0.4),
      length: rand(80, 180),
      speed: rand(6, 12),
      angle: rand(0.3, 0.8),
      alpha: 1,
      life: 0,
      maxLife: rand(40, 80),
      hue: randInt(340, 370) % 360,
    });
    setTimeout(spawnShootingStar, rand(3000, 8000));
  }

  setTimeout(spawnShootingStar, 2000);

  function drawShootingStars() {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life++;

      const progress = s.life / s.maxLife;
      s.alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

      if (s.life >= s.maxLife) {
        shootingStars.splice(i, 1);
        continue;
      }

      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;

      const grad = starCtx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, `hsla(${s.hue}, 80%, 80%, 0)`);
      grad.addColorStop(1, `hsla(${s.hue}, 80%, 90%, ${s.alpha})`);

      starCtx.beginPath();
      starCtx.moveTo(tailX, tailY);
      starCtx.lineTo(s.x, s.y);
      starCtx.strokeStyle = grad;
      starCtx.lineWidth = 2;
      starCtx.stroke();

      // head glow
      starCtx.beginPath();
      starCtx.arc(s.x, s.y, 3, 0, Math.PI * 2);
      starCtx.fillStyle = `hsla(${s.hue}, 80%, 95%, ${s.alpha})`;
      starCtx.fill();
    }
  }

  // ============================================
  //  9. MAIN ANIMATION LOOP
  // ============================================
  function animate(time) {
    drawStars(time);
    drawShootingStars();
    drawFireflies(time);
    drawTrail();
    drawRibbons(time);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // ============================================
  //  10. WINDOW RESIZE
  // ============================================
  window.addEventListener('resize', function () {
    resizeCanvas(starCanvas);
    resizeCanvas(ffCanvas);
    resizeCanvas(ribCanvas);

    // redistribute stars
    for (const s of stars) {
      s.x = rand(0, starCanvas.width);
      s.y = rand(0, starCanvas.height);
    }

    // redistribute fireflies
    for (const f of fireflies) {
      f.x = rand(0, ffCanvas.width);
      f.y = rand(0, ffCanvas.height);
    }

    // redistribute ribbons
    for (const r of ribbons) {
      r.yBase = rand(ribCanvas.height * 0.2, ribCanvas.height * 0.8);
    }
  });

})();
