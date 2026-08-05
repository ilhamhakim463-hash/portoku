/* ============================================================
   extras.js — Portfolio v7
   3D Globe, Guestbook, Availability Calendar,
   Command Palette, Morphing Text, Day/Night Auto Theme,
   Before/After - all premium features
============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {

    /* ══════════════════════════════════════════════════════
       1. DAY/NIGHT AUTO THEME
    ══════════════════════════════════════════════════════ */
    function initAutoTheme() {
      const navRight = document.querySelector(".nav-right");
      if (!navRight || document.getElementById("autoThemeBtn")) return;

      function getAutoTheme() {
        const h = new Date().getHours();
        return (h >= 6 && h < 18) ? "light" : "dark";
      }

      const btn = document.createElement("button");
      btn.id = "autoThemeBtn";
      btn.className = "auto-theme-badge";
      btn.title = "Toggle auto day/night theme";

      function updateBtnLabel() {
        const h = new Date().getHours();
        const icon = (h >= 6 && h < 18) ? "☀" : "🌙";
        btn.innerHTML = `<span class="atb-dot"></span>${icon} Auto`;
      }
      updateBtnLabel();

      let autoEnabled = false;
      btn.addEventListener("click", () => {
        autoEnabled = !autoEnabled;
        if (autoEnabled) {
          const t = getAutoTheme();
          document.body.setAttribute("data-theme", t);
          document.getElementById("themeIcon").textContent = t === "light" ? "🌙" : "☀";
          document.getElementById("themeText").textContent = t === "light" ? "Dark" : "Light";
          btn.style.background = "rgba(201,168,76,.2)";
          btn.title = "Auto theme ON — klik untuk matikan";
        } else {
          btn.style.background = "";
          btn.title = "Auto theme OFF — klik untuk aktifkan";
        }
      });

      // Auto-update every minute
      setInterval(() => {
        if (!autoEnabled) return;
        const t = getAutoTheme();
        document.body.setAttribute("data-theme", t);
      }, 60000);

      navRight.insertBefore(btn, navRight.querySelector(".hacker-btn") || navRight.firstChild);
    }
    initAutoTheme();

    /* ══════════════════════════════════════════════════════
       2. MORPHING HERO TEXT (gradient animated name)
    ══════════════════════════════════════════════════════ */
    function initMorphText() {
      const nameEl = document.getElementById("h-name");
      if (!nameEl) return;
      // Wrap the italic gold span with morph class
      const italic = nameEl.querySelector(".gold-italic");
      if (italic) italic.classList.add("morph-text");
    }
    setTimeout(initMorphText, 2500); // after hero entrance

    /* ══════════════════════════════════════════════════════
       3. 3D GLOBE (Canvas-based, no external lib)
    ══════════════════════════════════════════════════════ */
    function buildGlobeSection() {
      // Insert before contact section
      const contactSection = document.getElementById("contact");
      if (!contactSection || document.getElementById("globe-section")) return;

      const sec = document.createElement("div");
      sec.id = "globe-section";
      sec.innerHTML = `
        <div class="section-header centered" data-reveal>
          <p class="section-label">// 08 — Location</p>
          <h2 class="section-title">Where I <em>Work</em></h2>
          <div class="section-line" style="margin:1rem auto 0"></div>
        </div>
        <div class="globe-wrap">
          <canvas id="globeCanvas" width="360" height="360"></canvas>
          <div class="globe-info">
            <div class="globe-location">
              <div class="glob-loc-icon" style="font-size:1.8rem">📍</div>
              <div>
                <div class="globe-loc-name">Surabaya, Indonesia</div>
                <div class="globe-loc-sub">East Java · UTC+7</div>
              </div>
            </div>
            <div class="globe-clients">
              <div class="globe-clients-title">🌏 Projects & Clients</div>
              <div class="globe-client-item"><div class="globe-client-dot active"></div><span>Pesantren Petik Jombang, ID</span></div>
              <div class="globe-client-item"><div class="globe-client-dot active"></div><span>Dinas Perhubungan Jombang, ID</span></div>
              <div class="globe-client-item"><div class="globe-client-dot"></div><span>Open for remote worldwide 🌍</span></div>
            </div>
          </div>
        </div>`;
      contactSection.parentNode.insertBefore(sec, contactSection);
      renderGlobe();
    }

    function renderGlobe() {
      const canvas = document.getElementById("globeCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const W = canvas.width, H = canvas.height;
      const R = Math.min(W, H) / 2 - 10;
      const cx = W / 2, cy = H / 2;

      // Surabaya coords: lat=-7.25, lon=112.75
      // Jombang: lat=-7.55, lon=112.23
      const locations = [
        { lat: -7.25,  lon: 112.75, label: "Surabaya",  color: "#c9a84c", r: 5, pulse: true  },
        { lat: -7.55,  lon: 112.23, label: "Jombang",   color: "#43d9ad", r: 4, pulse: true  },
        { lat:  51.5,  lon: -0.12,  label: "London",    color: "#7c6fff", r: 3, pulse: false },
        { lat:  40.71, lon: -74.0,  label: "New York",  color: "#7c6fff", r: 3, pulse: false },
        { lat: -33.87, lon: 151.2,  label: "Sydney",    color: "#7c6fff", r: 3, pulse: false },
        { lat:  1.35,  lon: 103.8,  label: "Singapore", color: "#4ecdc4", r: 3, pulse: false },
      ];

      let rotY = 1.96; // start centered on Indonesia
      let rotX = 0.12;
      let dragging = false, lastMX = 0, lastMY = 0;
      let velX = 0.003, velY = 0;
      let pulseT = 0;

      // Lat/lon to 3D sphere point
      function latLonTo3D(lat, lon, r) {
        const phi   = (90 - lat) * Math.PI / 180;
        const theta = (lon + 180) * Math.PI / 180;
        return {
          x: -r * Math.sin(phi) * Math.cos(theta),
          y:  r * Math.cos(phi),
          z:  r * Math.sin(phi) * Math.sin(theta),
        };
      }

      // Rotate point by Y then X
      function rotate(p) {
        let x = p.x * Math.cos(rotY) + p.z * Math.sin(rotY);
        let z = -p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
        let y = p.y * Math.cos(rotX) - z * Math.sin(rotX);
        let z2 = p.y * Math.sin(rotX) + z * Math.cos(rotX);
        return { x, y, z: z2 };
      }

      // Project 3D to 2D
      function project(p) {
        const scale = (R * 2.2) / (R * 2.2 + p.z * 0.5);
        return { x: cx + p.x * scale, y: cy - p.y * scale, vis: p.z > -R * 0.2 };
      }

      function isDark() {
        return document.body.getAttribute("data-theme") !== "light";
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        const dark = isDark();

        // Glow
        const grd = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 1.2);
        grd.addColorStop(0, dark ? "rgba(124,111,255,.06)" : "rgba(124,111,255,.04)");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // Globe base
        const globeGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
        globeGrad.addColorStop(0, dark ? "#1a1a2e" : "#e8f4f8");
        globeGrad.addColorStop(1, dark ? "#0a0a14" : "#c8dce8");
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = globeGrad;
        ctx.fill();
        ctx.strokeStyle = dark ? "rgba(201,168,76,.2)" : "rgba(201,168,76,.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Grid lines
        ctx.strokeStyle = dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.06)";
        ctx.lineWidth = .8;
        for (let lat = -80; lat <= 80; lat += 20) {
          ctx.beginPath(); let first = true;
          for (let lon = -180; lon <= 180; lon += 5) {
            const p3 = latLonTo3D(lat, lon, R);
            const pr = rotate(p3);
            const p2 = project(pr);
            if (p2.vis) { first ? ctx.moveTo(p2.x, p2.y) : ctx.lineTo(p2.x, p2.y); first = false; }
            else { first = true; }
          }
          ctx.stroke();
        }
        for (let lon = -180; lon < 180; lon += 30) {
          ctx.beginPath(); let first = true;
          for (let lat = -90; lat <= 90; lat += 5) {
            const p3 = latLonTo3D(lat, lon, R);
            const pr = rotate(p3);
            const p2 = project(pr);
            if (p2.vis) { first ? ctx.moveTo(p2.x, p2.y) : ctx.lineTo(p2.x, p2.y); first = false; }
            else { first = true; }
          }
          ctx.stroke();
        }

        // Equator highlight
        ctx.strokeStyle = dark ? "rgba(201,168,76,.15)" : "rgba(201,168,76,.25)";
        ctx.lineWidth = 1.2;
        ctx.beginPath(); let firstEq = true;
        for (let lon = -180; lon <= 180; lon += 3) {
          const p3 = latLonTo3D(0, lon, R);
          const pr = rotate(p3);
          const p2 = project(pr);
          if (p2.vis) { firstEq ? ctx.moveTo(p2.x, p2.y) : ctx.lineTo(p2.x, p2.y); firstEq = false; }
          else { firstEq = true; }
        }
        ctx.stroke();

        // Locations
        pulseT += 0.06;
        locations.forEach(loc => {
          const p3 = latLonTo3D(loc.lat, loc.lon, R);
          const pr = rotate(p3);
          const p2 = project(pr);
          if (!p2.vis) return;

          // Pulse ring for active
          if (loc.pulse) {
            const pulse = (Math.sin(pulseT) + 1) / 2;
            ctx.beginPath();
            ctx.arc(p2.x, p2.y, loc.r + 5 + pulse * 8, 0, Math.PI * 2);
            ctx.strokeStyle = loc.color + "55";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Dot
          ctx.beginPath();
          ctx.arc(p2.x, p2.y, loc.r, 0, Math.PI * 2);
          ctx.fillStyle = loc.color;
          ctx.fill();
          ctx.strokeStyle = dark ? "#09090f" : "#f2efe9";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Label
          if (p2.vis && pr.z > 0) {
            ctx.font = `bold 10px 'JetBrains Mono', monospace`;
            ctx.fillStyle = dark ? "rgba(238,234,228,.8)" : "rgba(24,21,14,.8)";
            ctx.textAlign = "center";
            ctx.fillText(loc.label, p2.x, p2.y - loc.r - 5);
          }
        });

        // Atmosphere edge
        const atmGrad = ctx.createRadialGradient(cx, cy, R - 8, cx, cy, R + 15);
        atmGrad.addColorStop(0, "transparent");
        atmGrad.addColorStop(1, dark ? "rgba(124,111,255,.08)" : "rgba(78,205,196,.06)");
        ctx.beginPath();
        ctx.arc(cx, cy, R + 15, 0, Math.PI * 2);
        ctx.fillStyle = atmGrad;
        ctx.fill();
      }

      function animate() {
        if (!dragging) {
          rotY += velX;
          velX *= 0.999; // very slow deceleration
          if (Math.abs(velX) < 0.001) velX = 0.003; // minimum spin
        }
        draw();
        requestAnimationFrame(animate);
      }
      animate();

      // Mouse drag
      canvas.addEventListener("mousedown", e => { dragging = true; lastMX = e.clientX; lastMY = e.clientY; velX = 0; });
      canvas.addEventListener("mousemove", e => {
        if (!dragging) return;
        const dx = e.clientX - lastMX, dy = e.clientY - lastMY;
        rotY += dx * 0.008; rotX += dy * 0.005;
        rotX = Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, rotX));
        lastMX = e.clientX; lastMY = e.clientY;
        velX = dx * 0.008;
      });
      canvas.addEventListener("mouseup",   () => { dragging = false; });
      canvas.addEventListener("mouseleave",() => { dragging = false; });

      // Touch
      canvas.addEventListener("touchstart", e => { dragging = true; lastMX = e.touches[0].clientX; lastMY = e.touches[0].clientY; velX = 0; }, { passive:true });
      canvas.addEventListener("touchmove",  e => {
        if (!dragging) return;
        const dx = e.touches[0].clientX - lastMX, dy = e.touches[0].clientY - lastMY;
        rotY += dx * 0.008; rotX += dy * 0.005;
        rotX = Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, rotX));
        lastMX = e.touches[0].clientX; lastMY = e.touches[0].clientY;
        velX = dx * 0.006;
      }, { passive:true });
      canvas.addEventListener("touchend", () => { dragging = false; });
    }
    buildGlobeSection();

    /* ══════════════════════════════════════════════════════
       4. GUESTBOOK
    ══════════════════════════════════════════════════════ */
    function buildGuestbook() {
      const contact = document.getElementById("contact");
      if (!contact || document.getElementById("guestbook")) return;
      const GKEY = "ih_guestbook";

      const sec = document.createElement("div");
      sec.id = "guestbook";
      sec.innerHTML = `
        <div class="guestbook-inner">
          <div class="section-header" data-reveal>
            <p class="section-label">// 09 — Guestbook</p>
            <h2 class="section-title">Leave a <em>Message</em></h2>
            <div class="section-line"></div>
          </div>
          <div class="guestbook-form">
            <div class="guestbook-form-row">
              <input class="guestbook-input" id="gbName" placeholder="Nama kamu *" maxlength="50"/>
              <input class="guestbook-input" id="gbFrom" placeholder="Asal / Kota" maxlength="50"/>
            </div>
            <textarea class="guestbook-textarea" id="gbMsg" placeholder="Tulis pesan untuk Ilham... *" maxlength="300"></textarea>
            <button class="guestbook-submit" id="gbSubmit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Kirim Pesan
            </button>
          </div>
          <div class="guestbook-messages" id="gbMessages"></div>
        </div>`;
      contact.parentNode.insertBefore(sec, contact);

      function loadMessages() {
        try { return JSON.parse(localStorage.getItem(GKEY)) || []; } catch { return []; }
      }
      function saveMessages(msgs) { localStorage.setItem(GKEY, JSON.stringify(msgs)); }

      function renderMessages() {
        const container = document.getElementById("gbMessages");
        if (!container) return;
        const msgs = loadMessages();
        if (!msgs.length) {
          container.innerHTML = `<div class="guestbook-empty">💬 Belum ada pesan. Jadilah yang pertama!</div>`;
          return;
        }
        container.innerHTML = msgs.slice().reverse().map((m, i) => `
          <div class="guestbook-msg" style="animation-delay:${i*0.07}s">
            <div class="guestbook-msg-header">
              <div>
                <div class="guestbook-msg-name">${escapeHtml(m.name)}</div>
                ${m.from ? `<div class="guestbook-msg-from">📍 ${escapeHtml(m.from)}</div>` : ""}
              </div>
              <div class="guestbook-msg-date">${m.date}</div>
            </div>
            <div class="guestbook-msg-text">${escapeHtml(m.msg)}</div>
          </div>`).join("");
      }

      function escapeHtml(s) {
        return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
      }

      document.getElementById("gbSubmit").addEventListener("click", () => {
        const name = document.getElementById("gbName").value.trim();
        const from = document.getElementById("gbFrom").value.trim();
        const msg  = document.getElementById("gbMsg").value.trim();
        if (!name || !msg) { alert("Nama dan pesan wajib diisi!"); return; }
        const msgs = loadMessages();
        msgs.push({
          name, from, msg,
          date: new Date().toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" })
        });
        saveMessages(msgs);
        document.getElementById("gbName").value = "";
        document.getElementById("gbFrom").value = "";
        document.getElementById("gbMsg").value  = "";
        renderMessages();
      });
      renderMessages();
    }
    buildGuestbook();

    /* ══════════════════════════════════════════════════════
       5. AVAILABILITY CALENDAR
    ══════════════════════════════════════════════════════ */
    function buildAvailability() {
      const contact = document.getElementById("contact");
      if (!contact || document.getElementById("availability")) return;

      const sec = document.createElement("section");
      sec.id = "availability";
      sec.innerHTML = `
        <div class="section-header" data-reveal>
          <p class="section-label">// 10 — Availability</p>
          <h2 class="section-title">When I'm <em>Free</em></h2>
          <div class="section-line"></div>
        </div>
        <div class="avail-wrap">
          <div class="avail-status">
            <div class="avail-status-header">
              <div class="avail-status-icon">📅</div>
              <div>
                <div class="avail-status-title">Status Saat Ini</div>
                <div class="avail-status-sub">Updated automatically</div>
              </div>
            </div>
            <div class="avail-indicator open">
              <div class="avail-ind-dot"></div>
              <div>
                <div class="avail-ind-label">Tersedia untuk Project Baru</div>
                <div class="avail-ind-desc">Terbuka untuk freelance, kolaborasi, dan full-time opportunities.</div>
              </div>
            </div>
            <div class="avail-indicator partial">
              <div class="avail-ind-dot"></div>
              <div>
                <div class="avail-ind-label">Jadwal Fleksibel</div>
                <div class="avail-ind-desc">Bisa diskusi timeline sesuai kebutuhan project kamu.</div>
              </div>
            </div>
            <div style="margin-top:1.2rem;padding:1rem;background:var(--bg3);border-radius:8px;font-family:var(--font-m);font-size:.75rem;color:var(--text2);line-height:1.7;">
              <strong style="color:var(--gold);display:block;margin-bottom:.4rem;">📩 Cara menghubungi:</strong>
              Email atau WhatsApp untuk diskusi project.<br>
              Response time: <strong style="color:var(--green)">< 24 jam</strong> hari kerja.
            </div>
          </div>
          <div class="avail-calendar">
            <div class="cal-header">
              <button class="cal-nav" id="calPrev">‹</button>
              <span class="cal-month" id="calMonth">Juni 2025</span>
              <button class="cal-nav" id="calNext">›</button>
            </div>
            <div class="cal-grid" id="calGrid"></div>
          </div>
        </div>`;
      contact.parentNode.insertBefore(sec, contact);

      let viewDate = new Date();

      function renderCalendar() {
        const grid = document.getElementById("calGrid");
        const monthEl = document.getElementById("calMonth");
        if (!grid || !monthEl) return;

        const y = viewDate.getFullYear(), m = viewDate.getMonth();
        monthEl.textContent = new Date(y, m, 1).toLocaleDateString("id-ID", { month:"long", year:"numeric" });

        const days = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
        const today = new Date();
        const firstDay = new Date(y, m, 1).getDay();
        const daysInMonth = new Date(y, m + 1, 0).getDate();

        grid.innerHTML = days.map(d => `<div class="cal-day-label">${d}</div>`).join("");

        for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="cal-day empty"></div>`;
        for (let d = 1; d <= daysInMonth; d++) {
          const date = new Date(y, m, d);
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          let cls = "cal-day";
          if (isPast) cls += " past";
          else if (isToday) cls += " today";
          else if (isWeekend) cls += " available";
          else cls += " available";
          grid.innerHTML += `<div class="${cls}">${d}</div>`;
        }
      }

      document.getElementById("calPrev").addEventListener("click", () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); });
      document.getElementById("calNext").addEventListener("click", () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); });
      renderCalendar();
    }
    buildAvailability();

    /* ══════════════════════════════════════════════════════
       6. COMMAND PALETTE (Ctrl+K / Cmd+K)
    ══════════════════════════════════════════════════════ */
    function initCommandPalette() {
      if (document.getElementById("cmdPalette")) return;

      const commands = [
        // Navigation
        { group:"Navigation", icon:"🏠", label:"Home", sub:"Go to hero section",          action:()=>scrollTo("#hero") },
        { group:"Navigation", icon:"👤", label:"About", sub:"About me section",            action:()=>scrollTo("#about") },
        { group:"Navigation", icon:"⚡", label:"Tech Stack", sub:"Tools & technologies",   action:()=>scrollTo("#stack") },
        { group:"Navigation", icon:"📅", label:"Experience", sub:"Work & education",        action:()=>scrollTo("#experience") },
        { group:"Navigation", icon:"🗂", label:"Projects", sub:"Selected work",             action:()=>scrollTo("#projects") },
        { group:"Navigation", icon:"🏆", label:"Certificates", sub:"My credentials",        action:()=>scrollTo("#certificates") },
        { group:"Navigation", icon:"💬", label:"Testimonials", sub:"What people say",       action:()=>scrollTo("#testimonials") },
        { group:"Navigation", icon:"📞", label:"Contact", sub:"Get in touch",               action:()=>scrollTo("#contact") },
        { group:"Navigation", icon:"📖", label:"Guestbook", sub:"Leave a message",          action:()=>scrollTo("#guestbook") },
        { group:"Navigation", icon:"🌍", label:"Globe", sub:"Location & clients",           action:()=>scrollTo("#globe-section") },
        // Actions
        { group:"Actions", icon:"🌙", label:"Toggle Theme", sub:"Switch dark/light mode",   action:()=>window.toggleTheme?.() },
        { group:"Actions", icon:"🖥", label:"Hacker Mode", sub:"Toggle terminal look",      action:()=>document.getElementById("hackerBtn")?.click() },
        { group:"Actions", icon:"🎉", label:"Easter Egg", sub:"Surprise!",                  action:()=>{ const e = new KeyboardEvent("keydown",{key:"m"}); document.dispatchEvent(e); fireConfettiCmd(); } },
        { group:"Actions", icon:"📥", label:"Download Resume", sub:"Get my CV",             action:()=>{ const a=document.createElement("a");a.href="assets/Ilham_Hakim_CV.pdf";a.download="";a.click(); } },
        { group:"Contact", icon:"📧", label:"Email Me", sub:"ilhamhakim463@gmail.com",      action:()=>window.open("mailto:ilhamhakim463@gmail.com") },
        { group:"Contact", icon:"💬", label:"WhatsApp", sub:"+62 852-6796-7492",            action:()=>window.open("https://wa.me/6285267967492") },
        { group:"Contact", icon:"🐱", label:"GitHub", sub:"ilhamhakim463-hash",             action:()=>window.open("https://github.com/ilhamhakim463-hash","_blank") },
      ];

      function fireConfettiCmd() {
        const colors = ["#c9a84c","#7c6fff","#4ecdc4"];
        for(let i=0;i<60;i++){
          const p=document.createElement("div");p.className="confetti-piece";
          p.style.cssText=`left:${Math.random()*100}vw;top:-20px;width:8px;height:8px;background:${colors[Math.floor(Math.random()*3)]};border-radius:${Math.random()>0.5?50:2}%;--cf-dur:${2+Math.random()*2}s;--cf-del:${Math.random()}s`;
          document.body.appendChild(p);setTimeout(()=>p.remove(),4000);
        }
      }

      function scrollTo(id) { const el=document.querySelector(id); if(el) el.scrollIntoView({behavior:"smooth"}); }

      const overlay = document.createElement("div");
      overlay.id = "cmdPalette";
      overlay.innerHTML = `
        <div class="cmd-box">
          <div class="cmd-input-wrap">
            <span class="cmd-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
            <input class="cmd-input" id="cmdInput" placeholder="Ketik perintah atau cari..." autocomplete="off" spellcheck="false"/>
            <span class="cmd-shortcut-hint">ESC</span>
          </div>
          <div class="cmd-results" id="cmdResults"></div>
          <div class="cmd-footer">
            <div class="cmd-footer-hint"><span class="cmd-footer-key">↑↓</span>Navigate</div>
            <div class="cmd-footer-hint"><span class="cmd-footer-key">↵</span>Select</div>
            <div class="cmd-footer-hint"><span class="cmd-footer-key">ESC</span>Close</div>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      let selected = 0;
      let filtered = [...commands];

      function renderResults(q = "") {
        filtered = q ? commands.filter(c => c.label.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q)) : commands;
        selected = 0;

        const results = document.getElementById("cmdResults");
        if (!results) return;

        if (!filtered.length) {
          results.innerHTML = `<div style="padding:2rem;text-align:center;font-family:var(--font-m);font-size:.8rem;color:var(--text3)">Tidak ada hasil untuk "${q}"</div>`;
          return;
        }

        const groups = {};
        filtered.forEach(c => { if(!groups[c.group]) groups[c.group]=[]; groups[c.group].push(c); });

        results.innerHTML = Object.entries(groups).map(([group, items]) => `
          <span class="cmd-section-label">${group}</span>
          ${items.map((item, gi) => {
            const globalIdx = filtered.indexOf(item);
            return `<div class="cmd-item${globalIdx===0?" selected":""}" data-idx="${globalIdx}">
              <div class="cmd-item-icon">${item.icon}</div>
              <div style="flex:1"><div class="cmd-item-label">${item.label}</div><div class="cmd-item-sub">${item.sub}</div></div>
            </div>`;
          }).join("")}
        `).join("");

        results.querySelectorAll(".cmd-item").forEach(item => {
          item.addEventListener("click", () => { const idx = parseInt(item.dataset.idx); execute(idx); });
          item.addEventListener("mouseover", () => { selected = parseInt(item.dataset.idx); updateSelected(); });
        });
      }

      function updateSelected() {
        document.querySelectorAll(".cmd-item").forEach(item => {
          item.classList.toggle("selected", parseInt(item.dataset.idx) === selected);
        });
        const selEl = document.querySelector(`.cmd-item[data-idx="${selected}"]`);
        if (selEl) selEl.scrollIntoView({ block:"nearest" });
      }

      function execute(idx) {
        const cmd = filtered[idx];
        if (cmd) { close(); setTimeout(() => cmd.action(), 100); }
      }

      function open() { overlay.classList.add("open"); document.getElementById("cmdInput").focus(); renderResults(""); }
      function close() { overlay.classList.remove("open"); document.getElementById("cmdInput").value = ""; }

      document.getElementById("cmdInput").addEventListener("input", e => renderResults(e.target.value.toLowerCase()));
      document.getElementById("cmdInput").addEventListener("keydown", e => {
        if (e.key === "ArrowDown") { e.preventDefault(); selected = Math.min(selected+1, filtered.length-1); updateSelected(); }
        if (e.key === "ArrowUp")   { e.preventDefault(); selected = Math.max(selected-1, 0); updateSelected(); }
        if (e.key === "Enter")     { execute(selected); }
        if (e.key === "Escape")    { close(); }
      });
      overlay.addEventListener("click", e => { if(e.target===overlay) close(); });

      // Keyboard shortcut
      document.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); overlay.classList.contains("open") ? close() : open(); }
      });

      // Add hint to nav
      const navRight = document.querySelector(".nav-right");
      if (navRight) {
        const hint = document.createElement("button");
        hint.className = "theme-btn"; hint.title = "Command Palette (Ctrl+K)";
        hint.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> <span style="font-family:var(--font-m);font-size:.68rem">⌘K</span>`;
        hint.addEventListener("click", open);
        navRight.insertBefore(hint, navRight.querySelector("#hackerBtn") || navRight.firstChild);
      }
    }
    initCommandPalette();

    /* ══════════════════════════════════════════════════════
       7. UPDATE NAV with new sections
    ══════════════════════════════════════════════════════ */
    // Update sections array in main.js active tracking
    window._extraSections = ["globe-section","guestbook","availability"];

  }); // end DOMContentLoaded
})();
