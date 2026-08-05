/* ============================================================
   premium-effects.js — Full Visual Upgrade v6
   All effects: cursor trail, floating bg, radar chart,
   timeline alternating, carousel, hacker mode,
   confetti easter egg, visitor counter, music player,
   scroll progress bar
============================================================ */

(function () {
  "use strict";

  /* ══ WAIT FOR DOM ══ */
  document.addEventListener("DOMContentLoaded", () => {

    /* ══════════════════════════════════════════════════════
       1. SCROLL PROGRESS BAR
    ══════════════════════════════════════════════════════ */
    const progressBar = document.createElement("div");
    progressBar.id = "scrollProgress";
    document.body.prepend(progressBar);

    window.addEventListener("scroll", () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = ((window.scrollY / total) * 100) + "%";
    }, { passive: true });

    /* ══════════════════════════════════════════════════════
       2. CURSOR TRAIL PARTICLES
    ══════════════════════════════════════════════════════ */
    if (window.matchMedia("(hover:hover)").matches) {
      const colors = ["#c9a84c","#e8c97e","#7c6fff","#4ecdc4","#f5e4b0"];
      let lastTrail = 0;
      document.addEventListener("mousemove", e => {
        const now = Date.now();
        if (now - lastTrail < 40) return; // throttle
        lastTrail = now;
        const trail = document.createElement("div");
        trail.className = "cursor-trail";
        trail.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${colors[Math.floor(Math.random()*colors.length)]};width:${4+Math.random()*5}px;height:${4+Math.random()*5}px;`;
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 900);
      });
    }

    /* ══════════════════════════════════════════════════════
       3. FLOATING BACKGROUND ELEMENTS
    ══════════════════════════════════════════════════════ */
    const floatingBg = document.createElement("div");
    floatingBg.className = "floating-bg";
    floatingBg.setAttribute("aria-hidden","true");

    const orbConfigs = [
      { w:500,h:500, x:10,  y:20,  color:"rgba(201,168,76,.05)",  dur:22, del:0  },
      { w:400,h:400, x:70,  y:60,  color:"rgba(124,111,255,.05)", dur:28, del:5  },
      { w:350,h:350, x:40,  y:80,  color:"rgba(78,205,196,.04)",  dur:18, del:8  },
      { w:600,h:600, x:85,  y:10,  color:"rgba(201,168,76,.03)",  dur:32, del:3  },
    ];
    orbConfigs.forEach(o => {
      const orb = document.createElement("div");
      orb.className = "float-orb";
      orb.style.cssText = `width:${o.w}px;height:${o.h}px;left:${o.x}%;top:${o.y}%;--orb-color:${o.color};--orb-dur:${o.dur}s;--orb-del:${o.del}s;`;
      floatingBg.appendChild(orb);
    });
    for (let i = 0; i < 5; i++) {
      const line = document.createElement("div");
      line.className = "float-line";
      line.style.cssText = `left:${10+i*18}%;top:0;height:${30+Math.random()*40}vh;--line-dur:${12+i*4}s;--line-del:${i*2}s;`;
      floatingBg.appendChild(line);
    }
    document.body.insertBefore(floatingBg, document.body.firstChild);

    /* ══════════════════════════════════════════════════════
       4. TIMELINE — ALTERNATING (replaces old)
    ══════════════════════════════════════════════════════ */
    function renderTimelineAlt() {
      const container = document.getElementById("timeline");
      if (!container || typeof TIMELINE === "undefined") return;
      container.innerHTML = "";
      container.className = "timeline-alt";

      TIMELINE.forEach((item, i) => {
        const el = document.createElement("div");
        el.className = `tl-item ${item.type}`;

        const cardHTML = `
          <span class="tl-badge ${item.type === "work" ? "work" : "edu"}">${item.type === "work" ? "💼 Work" : "🎓 Education"}</span>
          <div class="tl-date">${item.date}</div>
          <div class="tl-role">${item.role}</div>
          <div class="tl-company">${item.company}</div>
          <p class="tl-desc">${item.desc}</p>`;

        if (i % 2 === 0) {
          el.innerHTML = `
            <div class="tl-left"><div class="tl-card">${cardHTML}</div></div>
            <div class="tl-center"><div class="tl-dot"></div></div>
            <div class="tl-right"></div>`;
        } else {
          el.innerHTML = `
            <div class="tl-left"></div>
            <div class="tl-center"><div class="tl-dot"></div></div>
            <div class="tl-right"><div class="tl-card">${cardHTML}</div></div>`;
        }
        container.appendChild(el);

        // Observe reveal
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); } });
        }, { threshold: .15 });
        obs.observe(el);
      });
    }
    // Override global renderTimeline
    window.renderTimeline = renderTimelineAlt;
    renderTimelineAlt();

    /* ══════════════════════════════════════════════════════
       5. SKILLS RADAR CHART
    ══════════════════════════════════════════════════════ */
    function buildRadarSection() {
      const aboutRight = document.querySelector(".about-right");
      if (!aboutRight) return;

      const skills = [
        { name:"React/Next.js", val:90, color:"#61DAFB" },
        { name:"Node.js",       val:85, color:"#68A063" },
        { name:"TypeScript",    val:82, color:"#3178C6" },
        { name:"PostgreSQL",    val:80, color:"#336791" },
        { name:"Laravel/PHP",   val:78, color:"#FF2D20" },
        { name:"Docker",        val:72, color:"#2496ED" },
        { name:"AWS/GCP",       val:70, color:"#FF9900" },
        { name:"GraphQL",       val:75, color:"#E535AB" },
      ];

      // Replace skills grid with radar
      const oldGrid = aboutRight.querySelector(".skills-grid");
      if (oldGrid) oldGrid.style.display = "none";

      const wrap = document.createElement("div");
      wrap.className = "skills-radar-wrap";
      wrap.setAttribute("data-reveal","");

      const canvas = document.createElement("canvas");
      canvas.id = "skillsRadarCanvas";
      canvas.width = 320; canvas.height = 320;

      const legend = document.createElement("div");
      legend.className = "skills-legend";
      skills.forEach((s, i) => {
        const item = document.createElement("div");
        item.className = "skill-legend-item";
        item.style.transitionDelay = (i * 60) + "ms";
        item.setAttribute("data-reveal","");
        item.innerHTML = `<div class="skill-legend-dot" style="background:${s.color}"></div><span class="skill-legend-name">${s.name}</span><span class="skill-legend-val">${s.val}%</span>`;
        legend.appendChild(item);
      });

      wrap.appendChild(canvas);
      wrap.appendChild(legend);
      aboutRight.appendChild(wrap);

      // Draw radar
      let animated = false;
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !animated) {
          animated = true;
          animateRadar(canvas, skills);
          obs.unobserve(canvas);
        }
      }, { threshold: .3 });
      obs.observe(canvas);
    }

    function animateRadar(canvas, skills) {
      const ctx = canvas.getContext("2d");
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const r = cx - 30;
      const N = skills.length;
      const dark = document.body.getAttribute("data-theme") !== "light";
      const gridColor  = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";
      const labelColor = dark ? "rgba(238,234,228,.6)"  : "rgba(24,21,14,.6)";
      let prog = 0;

      function drawFrame(p) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid rings
        for (let ring = 1; ring <= 5; ring++) {
          ctx.beginPath();
          for (let i = 0; i <= N; i++) {
            const a = (i / N) * Math.PI * 2 - Math.PI / 2;
            const rr = (ring / 5) * r;
            const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = gridColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Axis lines
        for (let i = 0; i < N; i++) {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
          ctx.strokeStyle = gridColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Data polygon
        ctx.beginPath();
        skills.forEach((s, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          const rr = (s.val / 100) * r * p;
          const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(201,168,76,.12)";
        ctx.fill();
        ctx.strokeStyle = "#c9a84c";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Data points
        skills.forEach((s, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          const rr = (s.val / 100) * r * p;
          const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.fill();
          ctx.strokeStyle = dark ? "#09090f" : "#f2efe9";
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Labels
        skills.forEach((s, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          const lx = cx + (r + 20) * Math.cos(a);
          const ly = cy + (r + 20) * Math.sin(a);
          ctx.font = "bold 11px 'JetBrains Mono', monospace";
          ctx.fillStyle = labelColor;
          ctx.textAlign = lx < cx - 5 ? "right" : lx > cx + 5 ? "left" : "center";
          ctx.textBaseline = ly < cy - 5 ? "bottom" : ly > cy + 5 ? "top" : "middle";
          ctx.fillText(s.name.split("/")[0], lx, ly);
        });
      }

      // Animate entrance
      function animate() {
        prog = Math.min(prog + 0.03, 1);
        drawFrame(prog);
        if (prog < 1) requestAnimationFrame(animate);
      }
      animate();
    }

    buildRadarSection();

    /* ══════════════════════════════════════════════════════
       6. TESTIMONIALS CAROUSEL
    ══════════════════════════════════════════════════════ */
    function buildCarousel() {
      const section = document.getElementById("testimonials");
      if (!section || typeof TESTIMONIALS === "undefined" || !TESTIMONIALS.length) return;

      // Remove old grid
      const old = document.getElementById("testiGrid");
      if (old) old.remove();

      const carousel = document.createElement("div");
      carousel.className = "testi-carousel";
      carousel.style.marginTop = "3rem";

      // Split into slides of 2 cards each
      const perPage = window.innerWidth < 768 ? 1 : 2;
      const slides = [];
      for (let i = 0; i < TESTIMONIALS.length; i += perPage) {
        slides.push(TESTIMONIALS.slice(i, i + perPage));
      }

      const track = document.createElement("div");
      track.className = "testi-track";

      slides.forEach(slideItems => {
        const slide = document.createElement("div");
        slide.className = "testi-slide";
        slideItems.forEach(t => {
          slide.innerHTML += `
            <div class="testi-card revealed">
              <span class="testi-quote">"</span>
              <p class="testi-text">"${t.text}"</p>
              <div class="testi-author">
                <div class="testi-avatar">${t.initials}</div>
                <div><div class="testi-name">${t.name}</div><div class="testi-role">${t.role}</div></div>
              </div>
            </div>`;
        });
        track.appendChild(slide);
      });

      // Prev/Next
      const prev = document.createElement("button");
      prev.className = "testi-nav testi-prev"; prev.innerHTML = "‹"; prev.setAttribute("aria-label","Previous");
      const next = document.createElement("button");
      next.className = "testi-nav testi-next"; next.innerHTML = "›"; next.setAttribute("aria-label","Next");

      // Dots
      const dots = document.createElement("div"); dots.className = "testi-dots";
      slides.forEach((_, i) => {
        const d = document.createElement("button");
        d.className = "testi-dot" + (i === 0 ? " active" : "");
        d.setAttribute("aria-label", `Slide ${i+1}`);
        dots.appendChild(d);
      });

      carousel.appendChild(prev);
      carousel.appendChild(track);
      carousel.appendChild(next);
      carousel.appendChild(dots);
      section.appendChild(carousel);

      let current = 0;
      function go(n) {
        current = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.querySelectorAll(".testi-dot").forEach((d, i) => d.classList.toggle("active", i === current));
      }

      prev.addEventListener("click", () => go(current - 1));
      next.addEventListener("click", () => go(current + 1));
      dots.querySelectorAll(".testi-dot").forEach((d, i) => d.addEventListener("click", () => go(i)));

      // Auto-play
      let autoPlay = setInterval(() => go(current + 1), 4500);
      carousel.addEventListener("mouseenter", () => clearInterval(autoPlay));
      carousel.addEventListener("mouseleave", () => { clearInterval(autoPlay); autoPlay = setInterval(() => go(current + 1), 4500); });

      // Touch swipe
      let tx = 0;
      track.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive:true });
      track.addEventListener("touchend",   e => {
        const dx = tx - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) go(current + (dx > 0 ? 1 : -1));
      });
    }
    buildCarousel();

    // Override renderTestimonials to rebuild carousel
    window.renderTestimonials = function() {
      const old = document.querySelector(".testi-carousel");
      if (old) old.remove();
      const oldGrid = document.getElementById("testiGrid");
      if (oldGrid) oldGrid.remove();
      buildCarousel();
    };

    /* ══════════════════════════════════════════════════════
       7. VISITOR COUNTER (localStorage based)
    ══════════════════════════════════════════════════════ */
    function initVisitorCounter() {
      const KEY = "ih_visit_count";
      let count = parseInt(localStorage.getItem(KEY) || "0");
      count++;
      localStorage.setItem(KEY, count);

      // Add to hero stats
      const statsEl = document.getElementById("h-stats");
      if (!statsEl) return;
      const vc = document.createElement("div");
      vc.className = "stat";
      vc.innerHTML = `<span class="num" id="vcNum">0</span><span class="lbl">Visits</span>`;
      statsEl.appendChild(vc);

      // Animate counter
      let c = 0;
      const target = Math.max(count, 1);
      const ti = setInterval(() => {
        c += Math.ceil(target / 40);
        if (c >= target) { c = target; clearInterval(ti); }
        const el = document.getElementById("vcNum");
        if (el) el.textContent = c + "+";
      }, 40);
    }
    initVisitorCounter();

    /* ══════════════════════════════════════════════════════
       8. HACKER MODE
    ══════════════════════════════════════════════════════ */
    function initHackerMode() {
      const navRight = document.querySelector(".nav-right");
      if (!navRight || document.getElementById("hackerBtn")) return;

      const btn = document.createElement("button");
      btn.id = "hackerBtn"; btn.className = "hacker-btn";
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Hacker`;
      btn.title = "Toggle Hacker Mode";

      btn.addEventListener("click", () => {
        const body = document.body;
        const isHacker = body.getAttribute("data-theme") === "hacker";
        if (isHacker) {
          const saved = localStorage.getItem("theme") || "dark";
          body.setAttribute("data-theme", saved);
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Hacker`;
        } else {
          body.setAttribute("data-theme", "hacker");
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00ff41" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> <span style="color:#00ff41">EXIT</span>`;
          showHackerIntro();
        }
      });
      navRight.insertBefore(btn, navRight.firstChild);
    }

    function showHackerIntro() {
      const div = document.createElement("div");
      div.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#000;border:1px solid #00ff41;color:#00ff41;font-family:'JetBrains Mono',monospace;font-size:.85rem;padding:2rem 2.5rem;z-index:99998;text-align:left;min-width:300px;animation:aSlideUp .4s ease;";
      const lines = ["> Initializing hacker mode...", "> Access granted.", "> Welcome, Ilham.", "> Portfolio v5 loaded.", "> Status: ONLINE ██████████ 100%"];
      div.innerHTML = lines.map((l,i) => `<div style="opacity:0;animation:aFadeIn .3s ease ${i*.3}s forwards">${l}</div>`).join("");
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 2800);
    }
    initHackerMode();

    /* ══════════════════════════════════════════════════════
       9. EASTER EGG — Type "ilham" for confetti
    ══════════════════════════════════════════════════════ */
    let typed = "";
    const secret = "ilham";
    let hintShown = false;

    document.addEventListener("keydown", e => {
      // Don't trigger in input fields
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      typed += e.key.toLowerCase();
      if (typed.length > secret.length) typed = typed.slice(-secret.length);

      if (typed === secret) {
        typed = "";
        fireConfetti();
      }
    });

    function fireConfetti() {
      const colors = ["#c9a84c","#7c6fff","#4ecdc4","#e8c97e","#ff6b6b","#43d9ad","#fff"];
      const shapes = [2, 50, 0]; // border-radius: square, circle, rect
      for (let i = 0; i < 80; i++) {
        const p = document.createElement("div");
        p.className = "confetti-piece";
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const w = 6 + Math.random() * 10;
        const h = 6 + Math.random() * 10;
        p.style.cssText = `
          left:${Math.random()*100}vw;
          top:-20px;
          width:${w}px; height:${h}px;
          background:${color};
          border-radius:${shape}%;
          --cf-dur:${2+Math.random()*2}s;
          --cf-del:${Math.random()*1.5}s;
          --cf-r:${shape}%;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 4000);
      }

      // Show message
      const msg = document.createElement("div");
      msg.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Cormorant Garamond',serif;font-size:2.5rem;color:var(--gold);z-index:99999;pointer-events:none;text-align:center;animation:logoPulse 2s ease forwards;text-shadow:0 0 30px rgba(201,168,76,.8);";
      msg.innerHTML = "🎉 Halo, Ilham! 🎉<br><span style='font-size:1rem;font-family:var(--font-m);letter-spacing:2px;color:var(--accent2)'>easter egg found!</span>";
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2500);

      if (!hintShown) {
        hintShown = true;
        const hint = document.createElement("div");
        hint.className = "easter-hint";
        hint.textContent = "✓ Ketik 'ilham' kapan saja untuk confetti!";
        document.body.appendChild(hint);
        setTimeout(() => hint.remove(), 3500);
      }
    }

    // Show hint after 10 seconds
    setTimeout(() => {
      if (!hintShown) {
        hintShown = true;
        const hint = document.createElement("div");
        hint.className = "easter-hint";
        hint.textContent = "💡 Psst... coba ketik sesuatu di keyboard";
        document.body.appendChild(hint);
        setTimeout(() => hint.remove(), 4000);
      }
    }, 10000);

    /* ══════════════════════════════════════════════════════
       10. MUSIC PLAYER (Web Audio API ambient)
    ══════════════════════════════════════════════════════ */
    function initMusicPlayer() {
      const btn = document.createElement("button");
      btn.className = "music-btn";
      btn.id = "musicBtn";
      btn.title = "Ambient Music";
      btn.setAttribute("aria-label", "Toggle ambient music");
      btn.innerHTML = `<div class="music-bars">
        <div class="music-bar" style="height:4px"></div>
        <div class="music-bar" style="height:10px"></div>
        <div class="music-bar" style="height:6px"></div>
        <div class="music-bar" style="height:12px"></div>
      </div>`;
      document.body.appendChild(btn);

      let ctx = null, oscillators = [], gainNodes = [], isPlaying = false;

      function startAmbient() {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        // Create ambient drone with 3 oscillators
        const notes = [220, 330, 440]; // A chord
        oscillators = []; gainNodes = [];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          lfo.type = "sine";
          lfo.frequency.setValueAtTime(0.15 + i * 0.1, ctx.currentTime);
          lfoGain.gain.setValueAtTime(freq * 0.008, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.04 - i * 0.01, ctx.currentTime + 2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          lfo.start();

          oscillators.push(osc);
          gainNodes.push(gain);
        });
        isPlaying = true;
        btn.classList.add("playing");
      }

      function stopAmbient() {
        gainNodes.forEach(g => {
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        });
        setTimeout(() => {
          oscillators.forEach(o => { try { o.stop(); } catch(e){} });
          oscillators = []; gainNodes = [];
        }, 1600);
        isPlaying = false;
        btn.classList.remove("playing");
      }

      btn.addEventListener("click", () => {
        if (isPlaying) stopAmbient();
        else startAmbient();
      });
    }
    initMusicPlayer();

    /* ══════════════════════════════════════════════════════
       11. ABOUT STATS STRIP
    ══════════════════════════════════════════════════════ */
    function buildAboutStats() {
      const aboutLeft = document.querySelector(".about-left");
      if (!aboutLeft || document.querySelector(".about-stats-strip")) return;
      const strip = document.createElement("div");
      strip.className = "about-stats-strip";
      strip.setAttribute("data-reveal","");
      const stats = [
        { num:"4+",  lbl:"Projects" },
        { num:"2+",  lbl:"Years Exp" },
        { num:"3",   lbl:"Certs" },
        { num:"∞",   lbl:"Learning" },
      ];
      stats.forEach(s => {
        strip.innerHTML += `<div class="about-stat-item"><span class="about-stat-num">${s.num}</span><span class="about-stat-lbl">${s.lbl}</span></div>`;
      });
      aboutLeft.appendChild(strip);
    }
    buildAboutStats();

    /* ══════════════════════════════════════════════════════
       12. PROJECT CARDS ENHANCEMENT
    ══════════════════════════════════════════════════════ */
    function enhanceProjectCards() {
      document.querySelectorAll(".project-card").forEach(card => {
        // Add live bar if not exists
        const imgEl = card.querySelector(".project-img");
        if (imgEl && !imgEl.querySelector(".project-live-bar")) {
          const bar = document.createElement("div");
          bar.className = "project-live-bar";
          bar.innerHTML = `<div class="live-dot"></div><span>LIVE DEMO</span>`;
          imgEl.appendChild(bar);
        }
        // Add tech badges
        const tags = card.querySelectorAll(".tag");
        if (imgEl && tags.length && !imgEl.querySelector(".project-tech-strip")) {
          const strip = document.createElement("div");
          strip.className = "project-tech-strip";
          Array.from(tags).slice(0,2).forEach(t => {
            strip.innerHTML += `<span class="project-tech-badge">${t.textContent}</span>`;
          });
          imgEl.appendChild(strip);
        }
      });
    }

    // Re-enhance after renderProjects
    const origRenderProjects = window.renderProjects;
    window.renderProjects = function(cat) {
      if (origRenderProjects) origRenderProjects(cat);
      setTimeout(enhanceProjectCards, 100);
    };
    setTimeout(enhanceProjectCards, 500);

    /* ══════════════════════════════════════════════════════
       13. SECTION NUMBERS DECORATION
    ══════════════════════════════════════════════════════ */
    const sectionNums = { "about":"01", "stack":"02", "experience":"03", "projects":"04", "certificates":"05", "testimonials":"06", "contact":"07" };
    Object.entries(sectionNums).forEach(([id, num]) => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const header = sec.querySelector(".section-header");
      if (!header) return;
      header.style.position = "relative";
      const numEl = document.createElement("span");
      numEl.className = "section-num";
      numEl.textContent = num;
      header.appendChild(numEl);
    });

    console.log("%c🚀 Portfolio v6 — Premium Edition", "color:#c9a84c;font-size:1.2rem;font-weight:bold;");
    console.log("%c💡 Tip: Ketik 'ilham' untuk easter egg!", "color:#7c6fff;font-size:.9rem;");

  }); // end DOMContentLoaded
})();
