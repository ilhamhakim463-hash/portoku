/* ============================================================
   intro.js — Portfolio v9 Ultra Epic
   - Cinematic skip-able intro
   - ASCII Art Mode
   - GitHub Stats (live + simulated)
   - WebGL-inspired 3D desk scene
============================================================ */
(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════════
     1. CINEMATIC INTRO (skip-able)
  ══════════════════════════════════════════════════════════ */
  function initCinematicIntro() {
    // Only show once per session
    if (sessionStorage.getItem("introShown")) return;

    const intro = document.createElement("div");
    intro.id = "cinematicIntro";
    intro.innerHTML = `
      <div class="intro-letterbox intro-letterbox-top"></div>
      <div class="intro-letterbox intro-letterbox-bottom"></div>

      <div class="intro-content">
        <div class="intro-studio">A Portfolio by</div>
        <div class="intro-logo-wrap">
          <div class="intro-logo">IH.</div>
          <div class="intro-logo-fill">IH.</div>
        </div>
        <div class="intro-tagline">
          <span>Full-Stack Developer</span> — Surabaya, Indonesia
        </div>
        <div class="intro-progress-wrap">
          <div class="intro-progress-bar"></div>
        </div>
      </div>

      <button class="intro-skip" id="introSkip">
        Skip <span class="intro-skip-key">Space</span>
      </button>

      <div class="intro-scene">
        <canvas id="introSceneCanvas"></canvas>
      </div>`;

    document.body.appendChild(intro);
    document.body.style.overflow = "hidden";

    // Draw minimal starfield on intro scene canvas
    const sceneCanvas = document.getElementById("introSceneCanvas");
    if (sceneCanvas) {
      const sCtx = sceneCanvas.getContext("2d");
      sceneCanvas.width  = window.innerWidth;
      sceneCanvas.height = window.innerHeight * 0.35;
      const stars = Array.from({length:80}, () => ({
        x: Math.random() * sceneCanvas.width,
        y: Math.random() * sceneCanvas.height,
        r: Math.random() * 1.5, o: Math.random()
      }));
      function drawStars() {
        sCtx.clearRect(0,0,sceneCanvas.width,sceneCanvas.height);
        stars.forEach(s => {
          s.o += (Math.random()-.5)*.04;
          s.o = Math.max(.1, Math.min(.9, s.o));
          sCtx.beginPath();
          sCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
          sCtx.fillStyle = `rgba(201,168,76,${s.o})`;
          sCtx.fill();
        });
        requestAnimationFrame(drawStars);
      }
      drawStars();
    }

    function skipIntro() {
      sessionStorage.setItem("introShown","1");
      intro.classList.add("expanding");
      document.body.style.overflow = "";
      setTimeout(() => intro.remove(), 900);
    }

    // Auto skip after 4.8s
    const autoTimer = setTimeout(skipIntro, 4800);

    document.getElementById("introSkip").addEventListener("click", () => {
      clearTimeout(autoTimer); skipIntro();
    });
    document.addEventListener("keydown", function onKey(e) {
      if (e.code === "Space" || e.code === "Enter" || e.key === "Escape") {
        clearTimeout(autoTimer); skipIntro();
        document.removeEventListener("keydown", onKey);
      }
    });
    // Touch anywhere also skips
    intro.addEventListener("touchstart", () => {
      clearTimeout(autoTimer); skipIntro();
    }, {passive:true});
  }
  // Run immediately (before DOMContentLoaded for fastest display)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCinematicIntro);
  } else {
    initCinematicIntro();
  }

  document.addEventListener("DOMContentLoaded", () => {

    /* ══════════════════════════════════════════════════════
       2. ASCII ART MODE
    ══════════════════════════════════════════════════════ */
    function initASCIIMode() {
      const navRight = document.querySelector(".nav-right");
      if (!navRight || document.getElementById("asciiBtn")) return;

      // Transition overlay
      const overlay = document.createElement("div");
      overlay.id = "asciiTransition";
      document.body.appendChild(overlay);

      const btn = document.createElement("button");
      btn.id = "asciiBtn"; btn.className = "ascii-btn";
      btn.title = "Toggle ASCII Art Mode";
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 8h8M8 16h5"/></svg> ASCII`;

      let asciiOn = false;
      const asciiFrames = [
        `> INITIALIZING ASCII MODE...\n> LOADING MATRIX...\n> DECODING PIXELS...\n> ████████████ 100%\n> READY`,
        `> SWITCHING TO RETRO MODE...\n> ░░▒▒▓▓██▓▓▒▒░░\n> FONT: MONOSPACE\n> COLORS: PHOSPHOR\n> DONE ✓`,
        `> DISABLING ASCII MODE...\n> RESTORING COLORS...\n> ████████████ 100%\n> BACK TO NORMAL ✓`,
      ];

      btn.addEventListener("click", () => {
        const frame = asciiOn ? asciiFrames[2] : asciiFrames[Math.floor(Math.random() * 2)];
        overlay.textContent = frame;
        overlay.classList.add("show");
        setTimeout(() => {
          asciiOn = !asciiOn;
          document.body.classList.toggle("ascii-mode", asciiOn);
          btn.innerHTML = asciiOn
            ? `<span style="color:#44ff88">[ASCII ON]</span>`
            : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 8h8M8 16h5"/></svg> ASCII`;
          overlay.classList.remove("show");
        }, 800);
      });

      navRight.insertBefore(btn, navRight.querySelector("#hackerBtn") || navRight.firstChild);
    }
    initASCIIMode();

    /* ══════════════════════════════════════════════════════
       3. GITHUB STATS
    ══════════════════════════════════════════════════════ */
    function buildGithubStats() {
      if (document.getElementById("githubStats")) return;
      const contact = document.getElementById("contact");
      if (!contact) return;

      const sec = document.createElement("section");
      sec.id = "githubStats";
      sec.innerHTML = `
        <div class="section-header" data-reveal>
          <p class="section-label">// GitHub Activity</p>
          <h2 class="section-title">Code <em>Stats</em></h2>
          <div class="section-line"></div>
        </div>
        <div class="gh-grid">
          <div class="gh-card" data-reveal>
            <span class="gh-card-icon">⭐</span>
            <div class="gh-card-label">Public Repos</div>
            <div class="gh-card-value" id="ghRepos">—</div>
            <div class="gh-card-sub">on GitHub</div>
          </div>
          <div class="gh-card" data-reveal>
            <span class="gh-card-icon">🔥</span>
            <div class="gh-card-label">Commit Streak</div>
            <div class="gh-card-value" id="ghStreak">—</div>
            <div class="gh-card-sub">days active</div>
          </div>
          <div class="gh-card" data-reveal>
            <span class="gh-card-icon">📦</span>
            <div class="gh-card-label">Total Commits</div>
            <div class="gh-card-value" id="ghCommits">—</div>
            <div class="gh-card-sub">this year</div>
          </div>
          <div class="gh-card" data-reveal>
            <span class="gh-card-icon">🌿</span>
            <div class="gh-card-label">Followers</div>
            <div class="gh-card-value" id="ghFollowers">—</div>
            <div class="gh-card-sub">on GitHub</div>
          </div>
        </div>
        <div class="gh-contrib-wrap" data-reveal>
          <div class="gh-contrib-title">Contribution Graph — Last 6 Months</div>
          <div class="gh-contrib-grid" id="ghContribGrid"></div>
        </div>
        <div class="gh-langs-wrap">
          <div class="gh-lang-bar-section" data-reveal>
            <div class="gh-contrib-title">Top Languages</div>
            <div id="ghLangs"></div>
          </div>
          <div class="gh-streak-section" data-reveal>
            <span class="gh-streak-fire">🔥</span>
            <div class="gh-streak-num" id="ghStreakBig">—</div>
            <div class="gh-streak-label">Day Streak</div>
          </div>
        </div>`;
      contact.parentNode.insertBefore(sec, contact);

      // Fetch real GitHub data
      async function fetchGitHub() {
        const username = "ilhamhakim463-hash";
        try {
          const res = await fetch(`https://api.github.com/users/${username}`);
          if (res.ok) {
            const data = await res.json();
            animateNum("ghRepos",     data.public_repos || 0);
            animateNum("ghFollowers", data.followers || 0);
          }
        } catch(e) {}

        // Try repos for commit approximation
        try {
          const res2 = await fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=updated`);
          if (res2.ok) {
            const repos = await res2.json();
            // Simulate commit count from repo data
            const total = repos.reduce((acc, r) => acc + (r.forks_count * 3 + r.watchers_count * 5 + 12), 0);
            animateNum("ghCommits", Math.max(total, 47));
          }
        } catch(e) {}

        // Simulated streak (realistic)
        const streak = 12 + Math.floor(Math.random() * 20);
        animateNum("ghStreak",    streak);
        animateNum("ghStreakBig", streak);
      }
      fetchGitHub();

      function animateNum(id, target) {
        const el = document.getElementById(id);
        if (!el) return;
        let cur = 0;
        const inc = Math.ceil(target / 40);
        const ti = setInterval(() => {
          cur = Math.min(cur + inc, target);
          el.textContent = cur + (target >= 100 ? "+" : "");
          if (cur >= target) clearInterval(ti);
        }, 35);
      }

      // Contribution grid (simulated realistic pattern)
      function buildContribGrid() {
        const grid = document.getElementById("ghContribGrid");
        if (!grid) return;
        const weeks = 26;
        const today = new Date();

        for (let w = 0; w < weeks; w++) {
          const week = document.createElement("div");
          week.className = "gh-contrib-week";
          for (let d = 0; d < 7; d++) {
            const dayEl = document.createElement("div");
            dayEl.className = "gh-contrib-day";
            const daysAgo = (weeks - 1 - w) * 7 + (6 - d);
            const date = new Date(today);
            date.setDate(date.getDate() - daysAgo);
            const isFuture = date > today;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            if (!isFuture) {
              // Generate realistic pattern
              const seed = date.getDate() * (date.getMonth() + 1);
              const r = ((seed * 1103515245 + 12345) & 0x7fffffff) % 100;
              let level = 0;
              if (r > 30) level = isWeekend ? (r > 70 ? 1 : 0) : (r > 80 ? 3 : r > 60 ? 2 : r > 40 ? 1 : 0);
              if (level > 0) dayEl.classList.add(`l${level}`);
              const dateStr = date.toLocaleDateString("id-ID", {day:"numeric",month:"short",year:"numeric"});
              dayEl.title = `${dateStr}: ${level > 0 ? level * 2 + " commits" : "No commits"}`;
            }
            week.appendChild(dayEl);
          }
          grid.appendChild(week);
        }
      }
      buildContribGrid();

      // Language bars
      function buildLangBars() {
        const container = document.getElementById("ghLangs");
        if (!container) return;
        const langs = [
          { name:"PHP / Laravel",  pct:45, color:"#8892BF" },
          { name:"JavaScript",     pct:30, color:"#F7DF1E" },
          { name:"TypeScript",     pct:12, color:"#3178C6" },
          { name:"HTML/CSS",       pct:8,  color:"#E34F26" },
          { name:"Python",         pct:5,  color:"#3776AB" },
        ];
        langs.forEach((l, i) => {
          const item = document.createElement("div");
          item.className = "gh-lang-item";
          item.innerHTML = `
            <div class="gh-lang-header">
              <span class="gh-lang-name">${l.name}</span>
              <span class="gh-lang-pct">${l.pct}%</span>
            </div>
            <div class="gh-lang-bar">
              <div class="gh-lang-fill" style="background:${l.color}" data-width="${l.pct}"></div>
            </div>`;
          container.appendChild(item);
        });

        // Animate lang bars on scroll
        const obs = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            container.querySelectorAll(".gh-lang-fill").forEach(bar => {
              bar.style.width = bar.getAttribute("data-width") + "%";
            });
            obs.unobserve(container);
          }
        }, { threshold:.3 });
        obs.observe(container);
      }
      buildLangBars();

      // Re-init scroll reveal for new elements
      setTimeout(() => {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add("revealed"); obs.unobserve(e.target); } });
        }, { threshold:.1 });
        sec.querySelectorAll("[data-reveal]").forEach(el => obs.observe(el));
      }, 200);
    }
    buildGithubStats();

    /* ══════════════════════════════════════════════════════
       4. WEBGL-INSPIRED 3D DESK SCENE (Canvas 2D faux-3D)
    ══════════════════════════════════════════════════════ */
    function buildDeskScene() {
      // Add to hero as decorative background element
      const hero = document.getElementById("hero");
      if (!hero || document.getElementById("deskScene")) return;

      const deskDiv = document.createElement("div");
      deskDiv.id = "deskScene";
      deskDiv.style.cssText = "position:absolute;bottom:0;right:0;width:420px;height:320px;z-index:1;pointer-events:none;opacity:0;transition:opacity 1s;";
      hero.appendChild(deskDiv);

      const canvas = document.createElement("canvas");
      canvas.width = 420; canvas.height = 320;
      canvas.style.width = "100%"; canvas.style.height = "100%";
      deskDiv.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      // Fade in after hero animation
      setTimeout(() => { deskDiv.style.opacity = "0.6"; }, 3000);

      let t = 0;
      function drawDesk() {
        ctx.clearRect(0, 0, 420, 320);
        const dark = document.body.getAttribute("data-theme") !== "light";
        const alpha = dark ? .5 : .3;

        // Desk surface (perspective)
        ctx.beginPath();
        ctx.moveTo(60,200); ctx.lineTo(360,200); ctx.lineTo(390,270); ctx.lineTo(30,270);
        ctx.closePath();
        ctx.fillStyle = dark ? `rgba(24,24,36,${alpha})` : `rgba(220,215,205,${alpha})`;
        ctx.fill();
        ctx.strokeStyle = dark ? `rgba(201,168,76,.15)` : `rgba(160,120,40,.15)`;
        ctx.lineWidth = 1; ctx.stroke();

        // Monitor (back)
        const monX = 160, monY = 60, monW = 160, monH = 110;
        // Monitor body
        roundRect(ctx, monX, monY, monW, monH, 6,
          dark ? `rgba(30,30,46,${alpha+.1})` : `rgba(200,195,185,${alpha+.1})`,
          dark ? `rgba(201,168,76,.2)` : `rgba(160,120,40,.2)`);
        // Screen glow
        const screenGrad = ctx.createLinearGradient(monX+8, monY+8, monX+monW-8, monY+monH-8);
        screenGrad.addColorStop(0, `rgba(124,111,255,${0.3+Math.sin(t*.02)*.1})`);
        screenGrad.addColorStop(1, `rgba(201,168,76,${0.2+Math.cos(t*.015)*.1})`);
        roundRect(ctx, monX+8, monY+8, monW-16, monH-20, 3, screenGrad, "transparent");
        // Code lines on screen
        for (let i = 0; i < 5; i++) {
          const lineW = 30 + ((i*37+t)%2 === 0 ? 40 : 20) + Math.sin(t*.03+i)*15;
          const lineY = monY+18+i*16;
          ctx.beginPath();
          ctx.moveTo(monX+14, lineY);
          ctx.lineTo(monX+14+lineW, lineY);
          ctx.strokeStyle = i===2 ? `rgba(201,168,76,.8)` : `rgba(255,255,255,.4)`;
          ctx.lineWidth = i===2 ? 2 : 1;
          ctx.stroke();
        }
        // Cursor blink
        if (Math.floor(t/30)%2===0) {
          ctx.fillStyle = `rgba(201,168,76,.9)`;
          ctx.fillRect(monX+14, monY+82, 8, 12);
        }
        // Monitor stand
        ctx.beginPath();
        ctx.moveTo(monX+monW/2-10, monY+monH);
        ctx.lineTo(monX+monW/2+10, monY+monH);
        ctx.lineTo(monX+monW/2+15, monY+monH+20);
        ctx.lineTo(monX+monW/2-15, monY+monH+20);
        ctx.closePath();
        ctx.fillStyle = dark ? `rgba(30,30,46,${alpha})` : `rgba(180,175,165,${alpha})`;
        ctx.fill();

        // Keyboard
        roundRect(ctx, 140, 185, 160, 12, 3,
          dark ? `rgba(40,40,60,${alpha})` : `rgba(210,205,195,${alpha})`,
          dark ? `rgba(201,168,76,.1)` : `rgba(160,120,40,.1)`);
        for (let k = 0; k < 12; k++) {
          roundRect(ctx, 144+k*12, 187, 10, 7, 1,
            dark ? `rgba(60,60,90,.8)` : `rgba(180,175,165,.8)`,
            dark ? `rgba(255,255,255,.05)` : `rgba(0,0,0,.05)`);
        }

        // Coffee cup
        ctx.beginPath();
        ctx.ellipse(90, 196, 14, 6, 0, 0, Math.PI*2);
        ctx.fillStyle = dark ? `rgba(60,40,20,.8)` : `rgba(140,100,60,.8)`;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(76,186); ctx.lineTo(76,196); ctx.lineTo(104,196); ctx.lineTo(104,186);
        ctx.strokeStyle = dark ? `rgba(201,168,76,.4)` : `rgba(160,120,40,.4)`;
        ctx.lineWidth = 2; ctx.stroke();
        // Steam
        for (let s = 0; s < 3; s++) {
          ctx.beginPath();
          const sy = 185 - ((t+s*20)%40);
          const sx = 83 + s*8 + Math.sin(t*.05+s)*3;
          ctx.moveTo(sx, sy);
          ctx.bezierCurveTo(sx+5, sy-8, sx-5, sy-16, sx+3, sy-24);
          ctx.strokeStyle = `rgba(255,255,255,${0.15-sy*.001})`;
          ctx.lineWidth = 1.5; ctx.stroke();
        }

        // Floating particles near monitor
        for (let p = 0; p < 5; p++) {
          const px = monX + 20 + Math.sin(t*.02+p*1.3)*60;
          const py = monY - 5 - ((t*.3+p*15)%30);
          const pAlpha = (1 - ((t*.3+p*15)%30)/30) * .5;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI*2);
          ctx.fillStyle = p%2===0 ? `rgba(201,168,76,${pAlpha})` : `rgba(124,111,255,${pAlpha})`;
          ctx.fill();
        }

        t++;
        requestAnimationFrame(drawDesk);
      }
      drawDesk();

      // Responsive hide on small screens
      function checkSize() {
        deskDiv.style.display = window.innerWidth < 900 ? "none" : "block";
      }
      checkSize();
      window.addEventListener("resize", checkSize);
    }
    buildDeskScene();

    /* ══════════════════════════════════════════════════════
       HELPER: roundRect
    ══════════════════════════════════════════════════════ */
    function roundRect(ctx, x, y, w, h, r, fill, stroke) {
      ctx.beginPath();
      ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
      ctx.quadraticCurveTo(x+w,y,x+w,y+r);
      ctx.lineTo(x+w,y+h-r);
      ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      ctx.lineTo(x+r,y+h);
      ctx.quadraticCurveTo(x,y+h,x,y+h-r);
      ctx.lineTo(x,y+r);
      ctx.quadraticCurveTo(x,y,x+r,y);
      ctx.closePath();
      if (fill && fill !== "transparent") { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke && stroke !== "transparent") { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
    }
    window._roundRect = roundRect;

    /* ══════════════════════════════════════════════════════
       5. UPDATE NAV + SECTIONS
    ══════════════════════════════════════════════════════ */
    function updateNavSections() {
      // Add GitHub Stats and new sections to nav active tracking
      const newSections = ["githubStats", "story"];
      // Extend main.js sections array if accessible
      if (window._extraSections) {
        newSections.forEach(s => {
          if (!window._extraSections.includes(s)) window._extraSections.push(s);
        });
      }
    }
    updateNavSections();

    console.log("%c🎬 Portfolio v9 — Cinematic Edition", "color:#c9a84c;font-size:1.2rem;font-weight:bold;font-family:serif;");
    console.log("%c🎮 Features: Intro · ASCII Mode · GitHub Stats · 3D Desk · AI Chat · Globe · Guestbook · Command Palette", "color:#7c6fff;font-size:.8rem;");

  }); // end DOMContentLoaded
})();
