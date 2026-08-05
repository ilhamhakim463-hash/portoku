/* ============================================================
   main.js — Portfolio Premium v3.0
   Profile card + Matrix effect + All fixes
============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  /* ══ THEME ══ */
  window.toggleTheme = function () {
    const dark = document.body.getAttribute("data-theme") === "dark";
    document.body.setAttribute("data-theme", dark ? "light" : "dark");
    document.getElementById("themeIcon").textContent = dark ? "🌙" : "☀";
    document.getElementById("themeText").textContent = dark ? "Dark" : "Light";
    localStorage.setItem("theme", dark ? "light" : "dark");
  };
  const sv = localStorage.getItem("theme") || "dark";
  document.body.setAttribute("data-theme", sv);
  if (sv === "light") {
    document.getElementById("themeIcon").textContent = "🌙";
    document.getElementById("themeText").textContent = "Dark";
  }

  /* ══ LOADER ══ */
  let heroStarted = false;
  function hideLoader() {
    if (heroStarted) return; heroStarted = true;
    document.getElementById("loader").classList.add("hidden");
    startHero();
  }
  window.addEventListener("load", () => setTimeout(hideLoader, 2000));
  setTimeout(hideLoader, 3500);

  /* ══ LOGO (custom or text) ══ */
  function initLogo() {
    const img = new Image();
    img.onload = () => {
      ["loaderLogoImg","navLogoImg","footerLogoImg"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "block";
      });
      ["loaderLogoText","navLogoText","footerLogoText"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });
    };
    img.onerror = () => {};
    img.src = "assets/logo.png?" + Date.now();
  }
  initLogo();

  /* ══ AURORA CANVAS ══ */
  const cv = document.getElementById("aurora-canvas");
  if (cv) {
    const ctx = cv.getContext("2d");
    let W, H, t = 0;
    function rsz() { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; }
    rsz(); window.addEventListener("resize", rsz);
    const orbs = [
      { x:.2,y:.3,r:.35,c:[124,111,255] },
      { x:.8,y:.2,r:.3, c:[201,168,76]  },
      { x:.5,y:.8,r:.4, c:[78,205,196]  },
      { x:.9,y:.7,r:.25,c:[124,111,255] },
    ];
    function drawAurora() {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach((o, i) => {
        const x = (o.x + Math.sin(t*.0005+i)*.1)*W;
        const y = (o.y + Math.cos(t*.0004+i*1.3)*.1)*H;
        const r = o.r * Math.max(W, H);
        const g = ctx.createRadialGradient(x,y,0,x,y,r);
        g.addColorStop(0,`rgba(${o.c},.18)`);
        g.addColorStop(1,`rgba(${o.c},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      });
      t++; requestAnimationFrame(drawAurora);
    }
    drawAurora();
  }

  /* ══ CUSTOM CURSOR ══ */
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (dot && ring && window.matchMedia("(hover:hover)").matches) {
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener("mousemove", e => { mx=e.clientX; my=e.clientY; });
    (function animC() {
      dot.style.left=mx+"px"; dot.style.top=my+"px";
      rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
      ring.style.left=rx+"px"; ring.style.top=ry+"px";
      requestAnimationFrame(animC);
    })();
    document.addEventListener("mousedown", () => { dot.style.transform="translate(-50%,-50%) scale(2.2)"; });
    document.addEventListener("mouseup",   () => { dot.style.transform="translate(-50%,-50%) scale(1)"; });
  }

  /* ══ MAGNETIC BUTTONS ══ */
  document.querySelectorAll("[data-magnetic]").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.22}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform=""; });
  });

  /* ══ NAVBAR + ACTIVE SECTION ══ */
const sections = ["hero","about","stack","projects","certificates","contact"];

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = "hero";
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });
    // Desktop nav
    document.querySelectorAll(".nav-links a").forEach(a => {
      const href = a.getAttribute("href")?.replace("#","");
      a.classList.toggle("active-section", href === current);
    });
    // Mobile nav
    document.querySelectorAll(".mobile-nav-link").forEach(a => {
      const href = a.getAttribute("href")?.replace("#","");
      a.classList.toggle("active-section", href === current);
    });
  }

  window.addEventListener("scroll", () => {
    document.getElementById("navbar").classList.toggle("scrolled", window.scrollY>50);
    updateBTT();
    updateActiveNav();
  });

  // Run once on load
  setTimeout(updateActiveNav, 500);

  /* ══ HAMBURGER + MOBILE MENU ══ */
  const hamburgerBtn      = document.getElementById("hamburgerBtn");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileMenuClose   = document.getElementById("mobileMenuClose");

  function openMobileMenu() {
    mobileMenuOverlay.classList.add("open");
    hamburgerBtn.classList.add("open");
    hamburgerBtn.setAttribute("aria-expanded","true");
    document.body.style.overflow = "hidden";
  }
  function closeMobileMenu() {
    mobileMenuOverlay.classList.remove("open");
    hamburgerBtn.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded","false");
    document.body.style.overflow = "";
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (mobileMenuOverlay.classList.contains("open")) closeMobileMenu();
      else openMobileMenu();
    });
  }
  if (mobileMenuClose) mobileMenuClose.addEventListener("click", closeMobileMenu);
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", e => {
      if (e.target === mobileMenuOverlay) closeMobileMenu();
    });
  }
  // Close on Escape
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMobileMenu(); });

  /* ══ SMOOTH SCROLL ══ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        closeMobileMenu(); // close mobile menu if open
        setTimeout(() => target.scrollIntoView({behavior:"smooth"}), 50);
      }
    });
  });

  /* ══ TYPEWRITER ══ */
  const phrases_id = ["aplikasi web.","REST API.","pengalaman pengguna.","aplikasi mobile.","sistem scalable.","antarmuka indah."];
  const phrases_en = ["web apps.","REST APIs.","user experiences.","mobile apps.","scalable systems.","beautiful UIs."];
  let pi=0, ci=0, del=false;
  const tgt = document.getElementById("typeTarget");
  function type() {
    if (!tgt) return;
    const lang = (typeof Admin !== "undefined") ? Admin.getLang() : "id";
    const phrases = lang === "en" ? phrases_en : phrases_id;
    const cur = phrases[pi % phrases.length];
    tgt.textContent = del ? cur.substring(0,ci--) : cur.substring(0,ci++);
    let d = del ? 50 : 100;
    if (!del && ci === cur.length+1) { d=2000; del=true; }
    if (del && ci<0) { del=false; pi=(pi+1)%phrases.length; ci=0; d=400; }
    setTimeout(type, d);
  }
  setTimeout(type, 2600);

  /* ══ PARTICLES ══ */
  function mkParticles() {
    const c = document.getElementById("particles"); if (!c) return;
    for (let i=0; i<18; i++) {
      const p = document.createElement("div"); p.className="particle";
      const a=Math.random()*360, r=80+Math.random()*90;
      const x=Math.cos(a*Math.PI/180)*r+190, y=Math.sin(a*Math.PI/180)*r+230;
      const s=2+Math.random()*4;
      p.style.cssText=`left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${Math.random()>.5?"#c9a84c":"#7c6fff"};--dur:${3+Math.random()*4}s;--del:${Math.random()*4}s`;
      c.appendChild(p);
    }
  }

  /* ══ COUNTER ══ */
  function animCounters() {
    document.querySelectorAll("[data-count]").forEach(el => {
      const target = parseInt(el.getAttribute("data-count"));
      let cur = 0;
      const ti = setInterval(() => {
        cur += target/50;
        if (cur>=target) { cur=target; clearInterval(ti); }
        el.textContent = Math.floor(cur)+"+";
      }, 35);
    });
  }

  /* ══════════════════════════════════════════════════════════
     PROFILE CARD — 3D TILT + MATRIX CLICK EFFECT
  ══════════════════════════════════════════════════════════ */
  function initProfileCard() {
    const card = document.getElementById("profileCard");
    const matCanvas = document.getElementById("matrixCanvas");
    const hint = document.getElementById("clickHint");
    if (!card || !matCanvas) return;

    // ── 3D TILT on mouse move ──
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x*18}deg) rotateX(${-y*14}deg) scale(1.04)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)";
    });

    // ── MATRIX EFFECT on click ──
    let matrixActive = false;
    let matrixRAF = null;
    const ctx = matCanvas.getContext("2d");

    function startMatrix() {
      matCanvas.width  = card.offsetWidth;
      matCanvas.height = card.offsetHeight;
      matCanvas.classList.add("active");
      if (hint) hint.classList.add("hidden");
      matrixActive = true;

      const cols = Math.floor(matCanvas.width / 14);
      const drops = Array(cols).fill(1);
      const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/\\|";

      function drawMatrix() {
        if (!matrixActive) return;
        ctx.fillStyle = "rgba(0,0,0,0.06)";
        ctx.fillRect(0, 0, matCanvas.width, matCanvas.height);
        ctx.fillStyle = "#00ff41";
        ctx.font = "13px 'JetBrains Mono', monospace";
        drops.forEach((y, i) => {
          const char = chars[Math.floor(Math.random()*chars.length)];
          ctx.fillText(char, i*14, y*14);
          if (y*14 > matCanvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        });
        matrixRAF = requestAnimationFrame(drawMatrix);
      }
      drawMatrix();
    }

    function stopMatrix() {
      matrixActive = false;
      if (matrixRAF) cancelAnimationFrame(matrixRAF);
      matCanvas.classList.remove("active");
      ctx.clearRect(0, 0, matCanvas.width, matCanvas.height);
      if (hint) hint.classList.remove("hidden");
    }

    card.addEventListener("click", () => {
      if (matrixActive) { stopMatrix(); }
      else { startMatrix(); setTimeout(stopMatrix, 5000); }
    });

    // Touch support
    card.addEventListener("touchstart", e => {
      e.preventDefault();
      if (matrixActive) { stopMatrix(); }
      else { startMatrix(); setTimeout(stopMatrix, 5000); }
    }, {passive:false});
  }

  /* ══ HERO ANIMATIONS ══ */
  function startHero() {
    mkParticles();
    initProfileCard();

    if (typeof gsap !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      const tl = gsap.timeline({ delay:.1, onComplete:() => { animCounters(); initReveal(); } });
      tl.to("#h-eyebrow",         { opacity:1,x:0,    duration:.6,ease:"power3.out" })
        .to("#h-name",            { opacity:1,y:0,    duration:.7,ease:"power3.out" }, "-=.3")
        .to("#h-sub",             { opacity:1,y:0,    duration:.5,ease:"power3.out" }, "-=.3")
        .to(".bio",               { opacity:1,y:0,    duration:.5,ease:"power3.out" }, "-=.2")
        .to("#h-current",         { opacity:1,y:0,    duration:.5,ease:"back.out(2)" }, "-=.2")
        .to("#h-btns",            { opacity:1,y:0,    duration:.5,ease:"power3.out" }, "-=.2")
        .to("#h-stats",           { opacity:1,y:0,    duration:.5,ease:"power3.out" }, "-=.1")
        .to("#profileCardWrap",   { opacity:1,scale:1,duration:.9,ease:"back.out(1.4)" }, "-=.8");

      ScrollTrigger.create({
        trigger:"#about", start:"top 65%",
        onEnter:() => document.querySelectorAll(".skill-fill").forEach(b => {
          b.style.width = b.getAttribute("data-width")+"%";
        })
      });
    } else {
      ["#h-eyebrow","#h-name","#h-sub",".bio","#h-current","#h-btns","#h-stats","#profileCardWrap"].forEach(s => {
        const el = document.querySelector(s);
        if (el) { el.style.opacity="1"; el.style.transform="none"; }
      });
      animCounters(); initReveal();
    }
  }

  /* ══ SCROLL REVEAL ══ */
  function initReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e,i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("revealed"), i*70);
          obs.unobserve(e.target);
        }
      });
    }, { threshold:.1 });
    document.querySelectorAll("[data-reveal]").forEach(el => obs.observe(el));
  }

  /* ══════════════════════════════════════════════════════════
     TECH STACK
  ══════════════════════════════════════════════════════════ */
  const catColor = { "Frontend":"#61DAFB","Backend":"#68A063","Database":"#336791","Mobile":"#7F52FF","DevOps":"#F05032","Cloud":"#FF9900","Design":"#F24E1E" };

  function hexToRgba(hex, a) {
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function renderStack(filter="all") {
    const grid = document.getElementById("stackGrid"); if (!grid) return;
    grid.innerHTML = "";
    const filterBar = document.getElementById("stackFilter");
    if (filterBar && filterBar.children.length === 0) {
      const cats = ["all", ...new Set(STACK.map(s=>s.category))];
      cats.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "filter-btn" + (cat==="all"?" active":"");
        btn.textContent = cat==="all" ? "All" : cat;
        btn.addEventListener("click", () => {
          filterBar.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
          btn.classList.add("active"); renderStack(cat);
        });
        filterBar.appendChild(btn);
      });
    }
    const list = filter==="all" ? STACK : STACK.filter(s=>s.category===filter);
    list.forEach((s,i) => {
      const el = document.createElement("div");
      el.className="stack-item"; el.setAttribute("data-reveal","");
      el.style.transitionDelay=(i*35)+"ms";
      el.style.setProperty("--item-color", s.color);
      el.innerHTML=`<div class="stack-svg">${s.svg}</div><span class="stack-name">${s.name}</span><span class="stack-cat" style="color:${catColor[s.category]||"#c9a84c"}">${s.category}</span>`;
      el.addEventListener("click", () => openStackModal(s, el));
      grid.appendChild(el);
      const obs = new IntersectionObserver(e => { e.forEach(en => { if(en.isIntersecting){en.target.classList.add("revealed");obs.unobserve(en.target);} }); },{threshold:.1});
      obs.observe(el);
    });
  }

  function openStackModal(s, originEl) {
    const overlay = document.getElementById("stackModalOverlay");
    const modal   = document.getElementById("stackModal");
    document.getElementById("sm-svg").innerHTML = s.svg;
    document.getElementById("sm-name").textContent    = s.name;
    document.getElementById("sm-tagline").textContent = s.tagline;
    document.getElementById("sm-year").textContent    = "Created "+s.year;
    document.getElementById("sm-creator").textContent = "by "+s.creator;
    document.getElementById("sm-desc").textContent    = s.desc;
    document.getElementById("sm-usage").textContent   = s.usage;
    const cat = document.getElementById("sm-category");
    cat.textContent = s.category;
    cat.style.background = hexToRgba(catColor[s.category]||"#c9a84c",.15);
    cat.style.color = catColor[s.category]||"#c9a84c";
    cat.style.borderColor = hexToRgba(catColor[s.category]||"#c9a84c",.35);

    if (originEl && typeof gsap !== "undefined") {
      const r=originEl.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      for(let i=0;i<10;i++){
        const burst=document.createElement("div");
        burst.style.cssText=`position:fixed;width:6px;height:6px;border-radius:50%;background:${s.color};left:${cx}px;top:${cy}px;pointer-events:none;z-index:9000`;
        document.body.appendChild(burst);
        const angle=(i/10)*Math.PI*2, dist=60+Math.random()*40;
        gsap.to(burst,{x:Math.cos(angle)*dist,y:Math.sin(angle)*dist,opacity:0,scale:0,duration:.6+Math.random()*.3,ease:"power2.out",onComplete:()=>burst.remove()});
      }
      gsap.fromTo(modal,
        {x:cx-window.innerWidth/2,y:cy-window.innerHeight/2,scale:.15,opacity:0},
        {x:0,y:0,scale:1,opacity:1,duration:.55,ease:"back.out(1.6)"}
      );
    }
    overlay.classList.add("open");
    document.body.style.overflow="hidden";
  }

  function closeStackModal() {
    const overlay=document.getElementById("stackModalOverlay");
    if(typeof gsap!=="undefined"){
      gsap.to(document.getElementById("stackModal"),{scale:.9,opacity:0,y:30,duration:.3,ease:"power2.in",
        onComplete:()=>{overlay.classList.remove("open");document.body.style.overflow="";}
      });
    } else { overlay.classList.remove("open"); document.body.style.overflow=""; }
  }
  document.getElementById("closeStackModal").addEventListener("click", closeStackModal);
  document.getElementById("stackModalOverlay").addEventListener("click", e=>{ if(e.target.id==="stackModalOverlay") closeStackModal(); });

  /* ══ TIMELINE ══ */
  function renderTimeline() {
    const tlEl = document.getElementById("timeline"); if(!tlEl) return;
    tlEl.innerHTML="";
    (typeof TIMELINE!=="undefined"?TIMELINE:[]).forEach(item=>{
      const el=document.createElement("div");
      el.className=`timeline-item ${item.type}`;
      el.setAttribute("data-reveal","");
      el.innerHTML=`<div class="timeline-dot"></div><div class="timeline-date">${item.date}</div><div class="timeline-card"><div class="timeline-top"><span class="timeline-role">${item.role}</span><span class="timeline-badge ${item.type==="work"?"badge-work":"badge-edu"}">${item.type==="work"?"Work":"Education"}</span></div><div class="timeline-company">${item.company}</div><p class="timeline-desc">${item.desc}</p></div>`;
      tlEl.appendChild(el);
    });
  }

  /* ══ PROJECTS ══ */
  function renderProjects(cat="all") {
    const grid=document.getElementById("projectsGrid"); if(!grid) return;
    grid.innerHTML="";
    const lang=(typeof Admin!=="undefined")?Admin.getLang():"id";
    const isEN=lang==="en";
    const list=cat==="all"?PROJECTS:PROJECTS.filter(p=>p.category===cat);
    list.forEach((p,i)=>{
      const card=document.createElement("div");
      card.className="project-card";
      card.style.transitionDelay=(i*80)+"ms";
      const desc=isEN?(p.desc_en||p.desc_id||p.desc||""):(p.desc_id||p.desc||"");
      card.innerHTML=`<div class="project-img">${p.screenshot?`<img src="${p.screenshot}" alt="${p.title}" loading="lazy">`:`<div class="project-img-placeholder"><span class="proj-icon-big">${p.icon}</span><span class="proj-icon-label">${p.title}</span></div>`}<div class="project-overlay"><span class="overlay-text">View Details →</span></div></div><div class="project-body"><div class="project-tags">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("")}</div><h3 class="project-title">${p.title}</h3><p class="project-desc">${desc}</p><span class="project-year">${p.year}</span></div>`;
      card.addEventListener("click",()=>openProjectModal(p));
      grid.appendChild(card);
      const obs=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting){en.target.classList.add("revealed");obs.unobserve(en.target);}});},{threshold:.1});
      obs.observe(card);
    });
  }

  function openProjectModal(p) {
    const lang=(typeof Admin!=="undefined")?Admin.getLang():"id";
    const isEN=lang==="en";
    const desc=isEN?(p.desc_en||p.desc_id||p.desc||""):(p.desc_id||p.desc||"");
    const features=isEN?(p.features_en&&p.features_en.length?p.features_en:p.features_id||p.features||[]):(p.features_id||p.features||[]);
    const mi=document.getElementById("modalImg");
    mi.innerHTML=p.screenshot?`<img src="${p.screenshot}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">`:`<div class="modal-img-icon-wrap"><span style="font-size:5rem;filter:drop-shadow(0 0 20px rgba(99,102,241,.5))">${p.icon}</span><span style="font-size:.75rem;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:.5rem">${p.title}</span></div>`;
    document.getElementById("modalTitle").textContent=p.title;
    document.getElementById("modalDesc").textContent=desc;
    document.getElementById("modalTags").innerHTML=(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("");
    document.getElementById("modalFeatures").innerHTML=features.map(f=>`<li>${f}</li>`).join("");
    const demoBtn=document.getElementById("modalDemo");
    const ghBtn=document.getElementById("modalGithub");
    if(p.demo&&p.demo!=="#"&&p.demo!==""){demoBtn.href=p.demo;demoBtn.style.display="";}
    else{demoBtn.style.display="none";}
    ghBtn.href=p.github||"#";
    document.getElementById("projectModal").classList.add("open");
    document.body.style.overflow="hidden";
  }
  function closeProjectModal(){document.getElementById("projectModal").classList.remove("open");document.body.style.overflow="";}
  document.getElementById("closeProjectModal").addEventListener("click",closeProjectModal);
  document.getElementById("projectModal").addEventListener("click",e=>{if(e.target.id==="projectModal")closeProjectModal();});
  document.querySelectorAll(".filter-btn[data-filter]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".filter-btn[data-filter]").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active"); renderProjects(btn.getAttribute("data-filter"));
    });
  });

  /* ══ CERTIFICATES ══ */
  function renderCerts() {
    const grid=document.getElementById("certGrid"); if(!grid) return;
    grid.innerHTML="";
    (typeof CERTIFICATES!=="undefined"?CERTIFICATES:[]).forEach((c,i)=>{
      const ds=c.date?new Date(c.date+"-01").toLocaleDateString("id-ID",{year:"numeric",month:"long"}):"";
      const isDico=c.issuer&&c.issuer.toLowerCase().includes("dicoding");
      const hasDemo=c.demoUrl&&c.demoUrl.trim()!=="";
      const hasImg=c.imageUrl&&c.imageUrl.trim()!=="";
      const card=document.createElement("div");
      card.className="cert-card";
      card.setAttribute("data-reveal","");
      card.style.transitionDelay=(i*100)+"ms";
      // Certificate image shown LARGE as main visual on front
      const frontContent = hasImg
        ? `<div class="cert-img-full"><img src="${c.imageUrl}" alt="${c.name}" loading="lazy"></div>`
        : `<span class="cert-icon">${c.icon||"🏆"}</span>`;
      card.innerHTML=`<div class="cert-inner-flip">
        <div class="cert-front">
          ${isDico?`<div class="cert-issuer-badge"><svg viewBox="0 0 120 24" height="18"><rect width="120" height="24" rx="4" fill="#5a67d8"/><text x="60" y="17" text-anchor="middle" fill="white" font-family="sans-serif" font-size="11" font-weight="bold">Dicoding</text></svg></div>`:""}
          ${frontContent}
          <div class="cert-front-info">
            <div class="cert-name">${c.name}</div>
            <div class="cert-issuer">${c.issuer}</div>
            <div class="cert-date">${ds}</div>
          </div>
        </div>
        <div class="cert-back">
          <div class="cert-back-id">ID: ${c.credId||"N/A"}</div>
          <p class="cert-back-desc">${c.desc||""}</p>
          <div class="cert-back-actions">
            ${c.credId?`<button class="cert-verify" onclick="window.open('https://www.dicoding.com/certificates/${encodeURIComponent(c.credId)}','_blank')">Verify →</button>`:""}
            ${hasDemo?`<a class="cert-demo-link" href="${c.demoUrl}" target="_blank" rel="noopener">🔗 Demo</a>`:""}
          </div>
        </div>
      </div>`;
      grid.appendChild(card);
    });
    // Use initReveal for cert cards too
    setTimeout(() => {
      document.querySelectorAll("#certGrid .cert-card[data-reveal]").forEach(el => {
        const obs=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting){en.target.classList.add("revealed");obs.unobserve(en.target);}});},{threshold:.1});
        obs.observe(el);
      });
    }, 100);
  }

  const _addCertBtn=document.getElementById("addCertBtn"); _addCertBtn && _addCertBtn.addEventListener("click",()=>{document.getElementById("addCertModal").classList.add("open");document.body.style.overflow="hidden";});
  function closeAddCert(){document.getElementById("addCertModal").classList.remove("open");document.body.style.overflow="";}
  document.getElementById("closeAddCert").addEventListener("click",closeAddCert);
  document.getElementById("cancelCertBtn").addEventListener("click",closeAddCert);
  document.getElementById("addCertModal").addEventListener("click",e=>{if(e.target.id==="addCertModal")closeAddCert();});
  document.getElementById("saveCertBtn").addEventListener("click",()=>{
    const name=document.getElementById("certName").value.trim();
    const issuer=document.getElementById("certIssuer").value.trim();
    if(!name||!issuer){alert("Isi Nama dan Issuer terlebih dahulu.");return;}
    CERTIFICATES.push({id:"c"+Date.now(),name,issuer,date:document.getElementById("certDate").value,credId:document.getElementById("certId").value.trim(),desc:document.getElementById("certDesc").value.trim(),icon:"🏆"});
    closeAddCert();
    ["certName","certIssuer","certDate","certId","certDesc"].forEach(id=>{document.getElementById(id).value="";});
    renderCerts();
  });

  /* ══ TESTIMONIALS ══ */
  window.renderTestimonials = function() {
    const tg=document.getElementById("testiGrid"); if(!tg) return;
    tg.innerHTML="";
    (typeof TESTIMONIALS!=="undefined"?TESTIMONIALS:[]).forEach((t,i)=>{
      const card=document.createElement("div");
      card.className="testi-card"; card.setAttribute("data-reveal","");
      card.style.transitionDelay=(i*120)+"ms";
      card.innerHTML=`<span class="testi-quote">"</span><p class="testi-text">"${t.text}"</p><div class="testi-author"><div class="testi-avatar">${t.initials}</div><div><div class="testi-name">${t.name}</div><div class="testi-role">${t.role}</div></div></div>`;
      tg.appendChild(card);
    });
    initReveal();
  };

  /* ══ BACK TO TOP ══ */
  const btt=document.getElementById("backToTop");
  const rf=document.getElementById("ringFill");
  const circ=2*Math.PI*18;
  function updateBTT(){
    const s=window.scrollY,tot=document.documentElement.scrollHeight-window.innerHeight;
    btt.classList.toggle("visible",s>300);
    if(rf) rf.style.strokeDashoffset=circ*(1-s/tot);
  }
  btt.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

  /* ══ EXPOSE GLOBALS for Admin ══ */
  window.renderProjects   = renderProjects;
  window.renderCerts      = renderCerts;
  window.renderTimeline   = renderTimeline;
  window.renderStack      = renderStack;

  /* ══ INIT ══ */
  renderStack("all");
  renderTimeline();
  renderProjects("all");
  renderCerts();
  window.renderTestimonials();

  if (typeof Admin !== "undefined") {
    Admin.init();
    // Re-render AFTER Admin merges localStorage data (stack, certs, etc.)
    setTimeout(() => {
      renderStack("all");
      renderCerts();
      renderProjects("all");
      window.renderTestimonials();
      // Re-run skill bar animation after re-render
      document.querySelectorAll(".skill-fill").forEach(b => {
        b.style.width = b.getAttribute("data-width")+"%";
      });
    }, 100);
  }
});
