/* ============================================================
   cinematic.js — Portfolio v8 Full Cinematic
   - Liquid blob background
   - Particle face on hover
   - Page transition
   - Project detail pages (SPA)
   - Parallax storytelling
   - Split screen theme wipe
   - AI Chat Bot (Claude API)
============================================================ */
(function () {
  "use strict";

  /* ══ WAIT FOR DOM + LOAD ══ */
  document.addEventListener("DOMContentLoaded", () => {

    /* ══════════════════════════════════════════════════════
       1. LIQUID BLOB BACKGROUND
    ══════════════════════════════════════════════════════ */
    function initLiquidBlob() {
      const canvas = document.createElement("canvas");
      canvas.id = "liquidCanvas";
      document.body.insertBefore(canvas, document.body.firstChild);
      const ctx = canvas.getContext("2d");
      let W, H, mx = 0.5, my = 0.5;
      let tx = 0.5, ty = 0.5;

      function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
      resize(); window.addEventListener("resize", resize);

      document.addEventListener("mousemove", e => { tx = e.clientX / W; ty = e.clientY / H; });

      const blobs = [
        { x:.3, y:.3, r:.28, vx:.0003, vy:.0002, c:[201,168,76] },
        { x:.7, y:.6, r:.32, vx:-.0002, vy:.0003, c:[124,111,255] },
        { x:.5, y:.8, r:.25, vx:.0004, vy:-.0002, c:[78,205,196]  },
        { x:.2, y:.7, r:.2,  vx:.0002, vy:.0004,  c:[201,168,76]  },
      ];
      let t = 0;

      function draw() {
        ctx.clearRect(0, 0, W, H);
        // Smooth mouse follow
        mx += (tx - mx) * 0.04;
        my += (ty - my) * 0.04;

        blobs.forEach((b, i) => {
          // Oscillate + follow mouse slightly
          const ox = Math.sin(t * b.vx * 1000 + i) * 0.08;
          const oy = Math.cos(t * b.vy * 1000 + i * 1.3) * 0.08;
          const bx = (b.x + ox + (mx - 0.5) * 0.03) * W;
          const by = (b.y + oy + (my - 0.5) * 0.03) * H;
          const br = b.r * Math.min(W, H);

          const isDark = document.body.getAttribute("data-theme") !== "light";
          const alpha = isDark ? 0.07 : 0.05;
          const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
          g.addColorStop(0, `rgba(${b.c},${alpha + 0.03})`);
          g.addColorStop(0.5, `rgba(${b.c},${alpha})`);
          g.addColorStop(1, `rgba(${b.c},0)`);

          ctx.beginPath();
          // Blob shape using bezier
          const points = 6;
          const step = (Math.PI * 2) / points;
          ctx.moveTo(bx + br * Math.cos(0), by + br * Math.sin(0));
          for (let p = 0; p < points; p++) {
            const a1 = p * step, a2 = (p + 1) * step;
            const r1 = br * (0.85 + 0.15 * Math.sin(t * 0.001 + p * 2.3 + i));
            const r2 = br * (0.85 + 0.15 * Math.sin(t * 0.001 + (p+1) * 2.3 + i));
            const cp1x = bx + r1 * 1.3 * Math.cos(a1 + step * 0.5);
            const cp1y = by + r1 * 1.3 * Math.sin(a1 + step * 0.5);
            ctx.quadraticCurveTo(cp1x, cp1y, bx + r2 * Math.cos(a2), by + r2 * Math.sin(a2));
          }
          ctx.closePath();
          ctx.fillStyle = g;
          ctx.fill();
        });
        t++;
        requestAnimationFrame(draw);
      }
      draw();
    }
    initLiquidBlob();

    /* ══════════════════════════════════════════════════════
       2. PARTICLE FACE (hover profile card)
    ══════════════════════════════════════════════════════ */
    function initParticleFace() {
      const wrap = document.getElementById("profileCardWrap");
      if (!wrap) return;

      const pfCanvas = document.createElement("canvas");
      pfCanvas.id = "particleFaceCanvas";
      pfCanvas.width = 320; pfCanvas.height = 400;
      pfCanvas.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:5;pointer-events:none;opacity:0;transition:opacity .5s;border-radius:20px;";
      wrap.appendChild(pfCanvas);

      const pfCtx = pfCanvas.getContext("2d");
      let particles = [];
      let animating = false;
      let raf = null;

      // Generate particles from text/dots pattern
      function generateParticles() {
        particles = [];
        const W = pfCanvas.width, H = pfCanvas.height;
        // Draw the photo to offscreen canvas to sample pixel colors
        const offscreen = document.createElement("canvas");
        offscreen.width = W; offscreen.height = H;
        const offCtx = offscreen.getContext("2d");
        const photoEl = document.getElementById("profilePhoto");
        if (photoEl && photoEl.complete && photoEl.naturalWidth > 0) {
          offCtx.drawImage(photoEl, 0, 0, W, H);
        } else {
          // Fallback: generate abstract face pattern
          offCtx.fillStyle = "#c9a84c22";
          offCtx.fillRect(0, 0, W, H);
          offCtx.beginPath();
          offCtx.arc(W/2, H/3, 80, 0, Math.PI*2);
          offCtx.fillStyle = "#c9a84c";
          offCtx.fill();
        }
        const imgData = offCtx.getImageData(0, 0, W, H).data;

        // Sample every Nth pixel
        const gap = 8;
        for (let y = 0; y < H; y += gap) {
          for (let x = 0; x < W; x += gap) {
            const i = (y * W + x) * 4;
            const r = imgData[i], g = imgData[i+1], b = imgData[i+2], a = imgData[i+3];
            if (a < 20) continue;
            const brightness = (r + g + b) / 3;
            if (brightness < 30) continue;
            particles.push({
              tx: x, ty: y,               // target
              x: Math.random() * W,        // start scattered
              y: Math.random() * H,
              r, g, b,
              size: 1 + Math.random() * 2,
              speed: 0.04 + Math.random() * 0.04,
            });
          }
        }
      }

      function drawParticles(forming) {
        pfCtx.clearRect(0, 0, pfCanvas.width, pfCanvas.height);
        let allArrived = true;
        particles.forEach(p => {
          if (forming) {
            p.x += (p.tx - p.x) * p.speed;
            p.y += (p.ty - p.y) * p.speed;
            const dist = Math.hypot(p.tx - p.x, p.ty - p.y);
            if (dist > 2) allArrived = false;
          } else {
            p.x += (Math.random() - 0.5) * 6;
            p.y -= 1.5 + Math.random() * 2;
          }
          pfCtx.beginPath();
          pfCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          pfCtx.fillStyle = `rgba(${p.r},${p.g},${p.b},0.85)`;
          pfCtx.fill();
        });
        return allArrived;
      }

      let forming = false;

      function startParticles() {
        if (animating) return;
        animating = true; forming = true;
        generateParticles();
        pfCanvas.style.opacity = "1";
        const card = document.getElementById("profileCard");
        if (card) card.style.opacity = "0.15";

        function loop() {
          if (!forming) { raf = null; return; }
          drawParticles(true);
          raf = requestAnimationFrame(loop);
        }
        loop();
      }

      function stopParticles() {
        if (!animating) return;
        forming = false;
        const card = document.getElementById("profileCard");
        if (card) card.style.opacity = "";

        let frames = 0;
        function disperse() {
          drawParticles(false);
          frames++;
          if (frames < 40) requestAnimationFrame(disperse);
          else {
            pfCanvas.style.opacity = "0";
            animating = false;
            pfCtx.clearRect(0, 0, pfCanvas.width, pfCanvas.height);
          }
        }
        disperse();
      }

      wrap.addEventListener("mouseenter", startParticles);
      wrap.addEventListener("mouseleave", stopParticles);
    }
    initParticleFace();

    /* ══════════════════════════════════════════════════════
       3. SPLIT SCREEN THEME WIPE
    ══════════════════════════════════════════════════════ */
    function initThemeWipe() {
      const wipe = document.createElement("div");
      wipe.id = "themeWipe";
      wipe.innerHTML = `<div class="wipe-half wipe-left"></div><div class="wipe-half wipe-right"></div>`;
      document.body.appendChild(wipe);

      const origToggle = window.toggleTheme;
      window.toggleTheme = function() {
        const isDark = document.body.getAttribute("data-theme") === "dark";
        const newColor = isDark ? "#f2efe9" : "#09090f";
        const wipeLeft  = wipe.querySelector(".wipe-left");
        const wipeRight = wipe.querySelector(".wipe-right");
        wipeLeft.style.background  = newColor;
        wipeRight.style.background = newColor;
        wipe.classList.add("animating");
        setTimeout(() => {
          if (origToggle) origToggle();
          else {
            const dark2 = document.body.getAttribute("data-theme") === "dark";
            document.body.setAttribute("data-theme", dark2 ? "light" : "dark");
          }
        }, 300);
        setTimeout(() => wipe.classList.remove("animating"), 700);
      };
    }
    initThemeWipe();

    /* ══════════════════════════════════════════════════════
       4. PAGE TRANSITION
    ══════════════════════════════════════════════════════ */
    const ptOverlay = document.createElement("div");
    ptOverlay.id = "pageTransition";
    ptOverlay.innerHTML = `<div class="pt-panel"></div><div class="pt-panel pt-panel-2"></div>`;
    document.body.appendChild(ptOverlay);

    window.pageTransitionIn = function(cb) {
      ptOverlay.classList.add("entering");
      ptOverlay.style.pointerEvents = "all";
      setTimeout(() => { if(cb) cb(); }, 400);
    };
    window.pageTransitionOut = function(cb) {
      ptOverlay.classList.remove("entering");
      ptOverlay.classList.add("leaving");
      setTimeout(() => {
        ptOverlay.classList.remove("leaving");
        ptOverlay.style.pointerEvents = "none";
        if(cb) cb();
      }, 700);
    };

    /* ══════════════════════════════════════════════════════
       5. PROJECT DETAIL PAGE (SPA)
    ══════════════════════════════════════════════════════ */
    function buildProjectDetailPage() {
      const page = document.createElement("div");
      page.id = "projectDetailPage";
      document.body.appendChild(page);

      function openProject(p) {
        const isEN = (typeof Admin !== "undefined") ? Admin.getLang() === "en" : false;
        const desc = isEN ? (p.desc_en || p.desc_id || p.desc || "") : (p.desc_id || p.desc || "");
        const features = isEN
          ? (p.features_en?.length ? p.features_en : p.features_id || p.features || [])
          : (p.features_id || p.features || []);

        const allProjects = typeof PROJECTS !== "undefined" ? PROJECTS : [];
        const idx = allProjects.findIndex(proj => proj.id === p.id);
        const next = allProjects[(idx + 1) % allProjects.length];

        page.innerHTML = `
          <div class="pd-back" id="pdBack">
            <span class="pd-back-arrow">←</span>
            <span class="pd-back-label">Back to Projects</span>
          </div>
          <div class="pd-hero">
            <div class="pd-text">
              <div class="pd-tags">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("")}</div>
              <h1 class="pd-title">${p.title.split(" ").map((w,i)=>i===Math.floor(p.title.split(" ").length/2)?`<em>${w}</em>`:w).join(" ")}</h1>
              <p class="pd-desc">${desc}</p>
              <div class="pd-actions">
                ${p.demo && p.demo !== "#" ? `<a href="${p.demo}" target="_blank" rel="noopener" class="btn-primary">Live Demo →</a>` : ""}
                <a href="${p.github||"#"}" target="_blank" rel="noopener" class="btn-outline">GitHub</a>
              </div>
            </div>
            <div class="pd-preview">
              ${p.screenshot ? `<img src="${p.screenshot}" alt="${p.title}">` : `<span style="opacity:.2;font-size:5rem">${p.icon}</span>`}
              <div class="pd-preview-shimmer"></div>
            </div>
          </div>
          <div class="pd-content">
            <div>
              <p class="pd-section-title">Key Features</p>
              <ul class="pd-features">
                ${features.map(f=>`<li class="pd-feature">${f}</li>`).join("")}
              </ul>
            </div>
            <div>
              <p class="pd-section-title">Tech Stack</p>
              <div class="pd-tech-grid">
                ${(p.tags||[]).map(t=>`<div class="pd-tech-item">${t}</div>`).join("")}
              </div>
              <div class="pd-stats">
                <div class="pd-stat-item"><span class="pd-stat-label">Year</span><span class="pd-stat-val">${p.year}</span></div>
                <div class="pd-stat-item"><span class="pd-stat-label">Category</span><span class="pd-stat-val">${p.category}</span></div>
                <div class="pd-stat-item"><span class="pd-stat-label">Status</span><span class="pd-stat-val" style="color:var(--green)">● Live</span></div>
              </div>
            </div>
          </div>
          ${next ? `<div class="pd-next" id="pdNext" data-id="${next.id}">
            <div>
              <div class="pd-next-label">Next Project</div>
              <div class="pd-next-title">${next.title}</div>
            </div>
            <span class="pd-next-arrow">→</span>
          </div>` : ""}`;

        // Animate open
        window.pageTransitionIn(() => {
          page.classList.add("open");
          document.body.style.overflow = "hidden";
          window.pageTransitionOut();
        });

        document.getElementById("pdBack")?.addEventListener("click", closeProject);
        document.getElementById("pdNext")?.addEventListener("click", () => {
          const nxt = (typeof PROJECTS !== "undefined" ? PROJECTS : []).find(pr => pr.id == next.id);
          if (nxt) { page.scrollTop = 0; openProject(nxt); }
        });
      }

      function closeProject() {
        window.pageTransitionIn(() => {
          page.classList.remove("open");
          document.body.style.overflow = "";
          window.pageTransitionOut();
        });
      }

      // Intercept project card clicks
      const origRenderProjects = window.renderProjects;
      window.renderProjects = function(cat) {
        if (origRenderProjects) origRenderProjects(cat);
        setTimeout(() => {
          document.querySelectorAll(".project-card").forEach(card => {
            // Remove existing listeners by cloning
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            const title = newCard.querySelector(".project-title")?.textContent;
            const proj = (typeof PROJECTS !== "undefined" ? PROJECTS : []).find(p => p.title === title);
            if (proj) {
              newCard.style.cursor = "pointer";
              newCard.addEventListener("click", () => openProject(proj));
            }
          });
        }, 200);
      };

      // Keyboard close
      document.addEventListener("keydown", e => {
        if (e.key === "Escape" && page.classList.contains("open")) closeProject();
      });
    }
    buildProjectDetailPage();

    /* ══════════════════════════════════════════════════════
       6. PARALLAX STORYTELLING
    ══════════════════════════════════════════════════════ */
    function buildStorytelling() {
      const exp = document.getElementById("experience");
      if (!exp || document.getElementById("story")) return;

      const stories = [
        { year:"2020", title:"The <em>Beginning</em>", desc:"Mulai belajar web development dari nol. HTML pertama, CSS yang berantakan, JavaScript yang membingungkan — tapi semangat tidak pernah padam.", tags:["HTML","CSS","JavaScript","Bootstrap"], icon:"🌱" },
        { year:"2022", title:"Going <em>Deeper</em>", desc:"Mengenal framework modern — Laravel untuk backend, Vue.js untuk frontend. Project pertama yang benar-benar dipakai orang lain. Perasaan yang tidak terlupakan.", tags:["Laravel","PHP","Vue.js","MySQL"], icon:"⚡" },
        { year:"2023", title:"Building <em>Real Things</em>", desc:"Mulai mengerjakan project untuk klien nyata. Sistem informasi untuk Pesantren, portal untuk Dinas Perhubungan. Kode yang berjalan di production, digunakan ribuan orang.", tags:["Fullstack","Production","Client Work"], icon:"🚀" },
        { year:"2024", title:"Growing <em>Forward</em>", desc:"Eksplorasi teknologi modern — React, Node.js, TypeScript. Belajar tentang arsitektur yang scalable, performa, dan user experience yang sesungguhnya.", tags:["React","Node.js","TypeScript","DevOps"], icon:"🔥" },
      ];

      const sec = document.createElement("div");
      sec.id = "story";
      sec.innerHTML = `
        <div class="story-inner">
          <div class="section-header" data-reveal style="text-align:center;margin-bottom:5rem">
            <p class="section-label">// The Journey</p>
            <h2 class="section-title">My <em>Story</em></h2>
            <div class="section-line" style="margin:1rem auto 0"></div>
          </div>
          <div class="story-line"></div>
          ${stories.map((s,i) => `
            <div class="story-block ${i%2===0?"":""}">
              <div class="story-text">
                <div class="story-year">${s.year}</div>
                <h3 class="story-title">${s.title}</h3>
                <p class="story-desc">${s.desc}</p>
                <div class="story-tags">${s.tags.map(t=>`<span class="story-tag">${t}</span>`).join("")}</div>
              </div>
              <div class="story-visual">${s.icon}</div>
            </div>`).join("")}
        </div>`;
      exp.parentNode.insertBefore(sec, exp);

      // Observe story blocks
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); } });
      }, { threshold: .2 });
      sec.querySelectorAll(".story-block").forEach(b => obs.observe(b));
    }
    buildStorytelling();

    /* ══════════════════════════════════════════════════════
       7. AI CHAT BOT — "Tanya Ilham" (Claude API)
    ══════════════════════════════════════════════════════ */
    function initAIChat() {
      if (document.getElementById("aiChatBtn")) return;

      // Chat button
      const btn = document.createElement("button");
      btn.id = "aiChatBtn";
      btn.innerHTML = `🤖<div class="chat-notif"></div>`;
      btn.setAttribute("aria-label", "Chat with AI");
      document.body.appendChild(btn);

      // Chat box
      const box = document.createElement("div");
      box.id = "aiChatBox";
      box.innerHTML = `
        <div class="chat-header">
          <div class="chat-avatar">🤖</div>
          <div class="chat-header-info">
            <div class="chat-name">Tanya Ilham AI</div>
            <div class="chat-status">Online — Powered by Claude</div>
          </div>
          <button class="chat-close" id="chatClose">✕</button>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="chat-msg bot">
            <div class="chat-msg-avatar">🤖</div>
            <div class="chat-bubble">Halo! Saya AI asisten Ilham. Tanya apa saja tentang skill, project, pengalaman, atau cara menghire Ilham! 👋</div>
          </div>
        </div>
        <div class="chat-suggestions" id="chatSuggestions">
          <button class="chat-suggest">Skill apa?</button>
          <button class="chat-suggest">Project terbaru?</button>
          <button class="chat-suggest">Cara hire?</button>
          <button class="chat-suggest">Pengalaman?</button>
        </div>
        <div class="chat-input-wrap">
          <input class="chat-input" id="chatInput" placeholder="Tanya sesuatu..." autocomplete="off"/>
          <button class="chat-send" id="chatSend">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>`;
      document.body.appendChild(box);

      let isOpen = false;
      let chatHistory = [];

      const systemPrompt = `Kamu adalah AI asisten untuk portofolio Ilham Hakim, seorang Full-Stack Developer dari Surabaya, Indonesia.

Informasi tentang Ilham:
- Nama: Ilham Hakim
- Profesi: Full-Stack Developer
- Lokasi: Surabaya, Indonesia
- Email: ilhamhakim463@gmail.com
- WhatsApp: +62 852-6796-7492
- GitHub: ilhamhakim463-hash
- Instagram: @ham39_kim

Skills utama: React/Next.js (90%), Node.js (85%), TypeScript (82%), PostgreSQL (80%), Laravel/PHP (78%), Docker (72%), AWS/GCP (70%), GraphQL (75%)

Projects:
1. DISHUB - Sistem informasi Dinas Perhubungan Jombang (dishub.petikjombang.com)
2. Approval Sosmed Petik Jombang (approvalsosmed.petikjombang.com)
3. SATYA - Sistem santri Pesantren Petik Jombang (satya.santripetikjombang.com)
4. SIKOKK - Sistem informasi kos (ilhamhakim463-hash.github.io/sikokk)

Sertifikat dari Dicoding Indonesia:
- Belajar Dasar Pemrograman Web
- Belajar Membuat Aplikasi Back-End
- Menjadi Front-End Web Developer Expert

Cara hire Ilham: Hubungi via email ilhamhakim463@gmail.com atau WhatsApp +62 852-6796-7492

Jawab dengan ramah, informatif, dan dalam bahasa yang sama dengan pertanyaan (Indonesia atau Inggris). Jawaban singkat dan padat, maksimal 3-4 kalimat. Gunakan emoji secukupnya. Jika ada pertanyaan di luar konteks Ilham, arahkan kembali ke topik portofolio.`;

      async function sendMessage(userMsg) {
        if (!userMsg.trim()) return;

        // Add user message
        addMsg("user", userMsg);
        chatHistory.push({ role: "user", content: userMsg });

        // Show typing
        const typingEl = addTyping();

        try {
          const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "claude-sonnet-4-6",
              max_tokens: 300,
              system: systemPrompt,
              messages: chatHistory.slice(-6), // keep last 6 turns
            })
          });

          const data = await response.json();
          typingEl.remove();

          const reply = data.content?.[0]?.text || "Maaf, ada gangguan teknis. Silakan hubungi Ilham langsung via WhatsApp! 😊";
          chatHistory.push({ role: "assistant", content: reply });
          addMsg("bot", reply);
        } catch (err) {
          typingEl.remove();
          // Fallback responses when API unavailable
          const fallbacks = {
            "skill": "Ilham menguasai React/Next.js, Node.js, Laravel, TypeScript, PostgreSQL, dan Docker. Spesialis Full-Stack development! 💻",
            "project": "Project terbaru: DISHUB Jombang, Approval Sosmed Petik Jombang, SATYA (sistem santri), dan SIKOKK. Semua live dan production! 🚀",
            "hire": "Untuk hire Ilham, hubungi via WhatsApp +62 852-6796-7492 atau email ilhamhakim463@gmail.com. Response < 24 jam! ⚡",
            "default": "Saya sementara offline. Untuk info lebih lanjut, hubungi Ilham di ilhamhakim463@gmail.com atau WhatsApp +62 852-6796-7492 😊"
          };
          const lower = userMsg.toLowerCase();
          let reply = fallbacks.default;
          if (lower.includes("skill") || lower.includes("bisa") || lower.includes("tech")) reply = fallbacks.skill;
          else if (lower.includes("project") || lower.includes("karya") || lower.includes("buat")) reply = fallbacks.project;
          else if (lower.includes("hire") || lower.includes("kerja") || lower.includes("hubungi") || lower.includes("contact")) reply = fallbacks.hire;
          addMsg("bot", reply);
        }

        // Scroll to bottom
        const msgs = document.getElementById("chatMessages");
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
      }

      function addMsg(role, text) {
        const msgs = document.getElementById("chatMessages");
        if (!msgs) return;
        const el = document.createElement("div");
        el.className = `chat-msg ${role}`;
        el.innerHTML = role === "bot"
          ? `<div class="chat-msg-avatar">🤖</div><div class="chat-bubble">${text}</div>`
          : `<div class="chat-bubble">${text}</div>`;
        msgs.appendChild(el);
        msgs.scrollTop = msgs.scrollHeight;
        return el;
      }

      function addTyping() {
        const msgs = document.getElementById("chatMessages");
        const el = document.createElement("div");
        el.className = "chat-msg bot";
        el.innerHTML = `<div class="chat-msg-avatar">🤖</div><div class="chat-typing"><span></span><span></span><span></span></div>`;
        msgs.appendChild(el);
        msgs.scrollTop = msgs.scrollHeight;
        return el;
      }

      // Toggle
      btn.addEventListener("click", () => {
        isOpen = !isOpen;
        box.classList.toggle("open", isOpen);
        if (isOpen) {
          btn.querySelector(".chat-notif")?.remove();
          document.getElementById("chatInput")?.focus();
        }
      });
      document.getElementById("chatClose")?.addEventListener("click", () => {
        isOpen = false; box.classList.remove("open");
      });

      // Send
      document.getElementById("chatSend")?.addEventListener("click", () => {
        const inp = document.getElementById("chatInput");
        if (inp) { sendMessage(inp.value); inp.value = ""; }
      });
      document.getElementById("chatInput")?.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          const inp = document.getElementById("chatInput");
          if (inp) { sendMessage(inp.value); inp.value = ""; }
        }
      });

      // Suggestions
      document.getElementById("chatSuggestions")?.querySelectorAll(".chat-suggest").forEach(s => {
        s.addEventListener("click", () => {
          sendMessage(s.textContent);
          document.getElementById("chatSuggestions").style.display = "none";
        });
      });
    }
    initAIChat();

    // Re-render projects with new detail page
    setTimeout(() => {
      if (typeof renderProjects === "function") renderProjects("all");
    }, 800);

  }); // end DOMContentLoaded
})();
