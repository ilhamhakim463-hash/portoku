/* ============================================================
   enterprise.js — Portfolio v10 Enterprise Edition
============================================================ */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);

  document.addEventListener("DOMContentLoaded", () => {

    /* ══ 1. HIRING SECTION ══ */
    function buildHiring() {
      if ($("hiring")) return;
      const contact = $("contact"); if (!contact) return;
      const sec = document.createElement("section"); sec.id = "hiring";
      sec.innerHTML = `<div class="hiring-inner">
        <div class="hiring-badge"><span class="hiring-badge-dot"></span>Open for Opportunities</div>
        <div class="section-header" data-reveal>
          <p class="section-label">// For Recruiters & Clients</p>
          <h2 class="section-title">Hire <em>Me</em></h2>
          <div class="section-line"></div>
        </div>
        <div class="hiring-grid">
          <div class="rate-card" data-reveal>
            <div class="rate-card-header">
              <div class="rate-card-title">Service Rates</div>
              <div class="rate-card-sub">TRANSPARENT PRICING · NEGOTIABLE</div>
            </div>
            <div class="rate-card-body">
              <div class="rate-item"><div class="rate-label">Freelance Project<span>Per project basis</span></div><div class="rate-price">Rp 1–5jt<small>per project</small></div></div>
              <div class="rate-item"><div class="rate-label">Full-Stack Web App<span>Complete solution</span></div><div class="rate-price">Rp 3–15jt<small>per project</small></div></div>
              <div class="rate-item"><div class="rate-label">Part-time Retainer<span>Ongoing support</span></div><div class="rate-price">Rp 2jt<small>per month</small></div></div>
              <div class="rate-item"><div class="rate-label">Full-time Position<span>Open to discuss</span></div><div class="rate-price">Negotiable<small>contact me</small></div></div>
            </div>
          </div>
          <div class="hiring-info-grid">
            <div class="hiring-info-card" data-reveal><div class="hiring-info-header"><span class="hiring-info-icon">⚡</span><span class="hiring-info-title">Response Time</span></div><div class="hiring-info-body">Membalas dalam <strong style="color:var(--green)">&lt; 24 jam</strong> hari kerja. WhatsApp untuk urgent.</div></div>
            <div class="hiring-info-card" data-reveal><div class="hiring-info-header"><span class="hiring-info-icon">🌏</span><span class="hiring-info-title">Work Setup</span></div><div class="hiring-info-body">Remote, hybrid, atau on-site di Jawa Timur. Zona waktu WIB (UTC+7).</div><div class="hiring-info-tags"><span class="hiring-tag">Remote</span><span class="hiring-tag">Hybrid</span><span class="hiring-tag">On-site Jatim</span></div></div>
            <div class="hiring-info-card" data-reveal><div class="hiring-info-header"><span class="hiring-info-icon">✅</span><span class="hiring-info-title">What I Bring</span></div><div class="hiring-info-body">Full-stack expertise, clean code, deadline-oriented, komunikasi yang baik.</div><div class="hiring-info-tags"><span class="hiring-tag">Laravel</span><span class="hiring-tag">React</span><span class="hiring-tag">Node.js</span><span class="hiring-tag">MySQL</span></div></div>
          </div>
        </div>
        <div class="hiring-cta">
          <a href="https://wa.me/6285267967492?text=Halo%20Ilham%2C%20saya%20ingin%20mendiskusikan%20peluang%20kerja%20sama%20%F0%9F%91%8B" target="_blank" class="btn-hire">💬 Hire Me via WhatsApp</a>
          <a href="mailto:ilhamhakim463@gmail.com?subject=Peluang%20Kerja%20Sama" class="btn-outline">📧 Send Email</a>
          <button class="btn-outline" onclick="window.print()">🖨 Print Resume</button>
        </div>
      </div>`;
      contact.parentNode.insertBefore(sec, contact);
      setTimeout(() => {
        const obs = new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting){en.target.classList.add("revealed");obs.unobserve(en.target);}});},{threshold:.1});
        sec.querySelectorAll("[data-reveal]").forEach(el=>obs.observe(el));
      }, 100);
    }
    buildHiring();

    /* ══ 2. ANALYTICS ══ */
    function buildAnalytics() {
      if ($("analyticsPanel")) return;
      const AKEY = "ih_analytics";
      let data; try { data = JSON.parse(localStorage.getItem(AKEY))||{}; } catch { data={}; }
      const today = new Date().toISOString().split("T")[0];
      data.totalViews = (data.totalViews||0)+1;
      data.todayViews = data.lastDate===today?(data.todayViews||0)+1:1;
      data.lastDate   = today;
      data.uniqueDays = data.uniqueDays||{}; data.uniqueDays[today]=(data.uniqueDays[today]||0)+1;
      data.sections   = data.sections||{};
      data.clicks     = data.clicks||{linkedin:0,github:0,email:0,instagram:0};
      localStorage.setItem(AKEY, JSON.stringify(data));

      ["about","stack","projects","certificates","contact","hiring"].forEach(id=>{
        const el=$( id); if(!el) return;
        const obs=new IntersectionObserver(e=>{if(e[0].isIntersecting){data.sections[id]=(data.sections[id]||0)+1;localStorage.setItem(AKEY,JSON.stringify(data));obs.unobserve(e[0].target);}},{threshold:.3});
        obs.observe(el);
      });
      const fab = document.createElement("button"); fab.className="analytics-fab"; fab.title="Analytics";
      fab.innerHTML=`<span class="analytics-fab-dot"></span><span>Analytics</span>`;
      document.body.appendChild(fab);

      const uniqueDays = Object.keys(data.uniqueDays||{}).length;
      const topSections = Object.entries(data.sections||{}).sort((a,b)=>b[1]-a[1]).slice(0,5);
      const clicksTotal = Object.values(data.clicks||{}).reduce((a,b)=>a+b,0);

      const panel = document.createElement("div"); panel.id="analyticsPanel";
      panel.innerHTML=`<div class="analytics-header"><div class="analytics-title">📊 Analytics</div><button class="analytics-close" id="analyticsClose">✕</button></div>
        <div class="analytics-live"><div><div class="analytics-live-num">1</div><div class="analytics-live-label">Viewing now</div></div><span class="analytics-live-dot"></span></div>
        <div class="analytics-section-title">Overview</div>
        <div class="analytics-stat"><span class="analytics-stat-label">TOTAL VIEWS</span><span class="analytics-stat-val" id="astat-totalViews">${data.totalViews}</span></div>
        <div class="analytics-stat"><span class="analytics-stat-label">TODAY</span><span class="analytics-stat-val" id="astat-todayViews">${data.todayViews}</span></div>
        <div class="analytics-stat"><span class="analytics-stat-label">UNIQUE DAYS</span><span class="analytics-stat-val" id="astat-uniqueDays">${uniqueDays}</span></div>
        <div class="analytics-stat"><span class="analytics-stat-label">TOTAL CLICKS</span><span class="analytics-stat-val" id="astat-totalClicks">${clicksTotal}</span></div>
        ${topSections.length?`<div class="analytics-section-title">Top Sections</div>${topSections.map(([n,v])=>`<div class="analytics-bar-item"><div class="analytics-bar-header"><span>${n}</span><span>${v}</span></div><div class="analytics-bar-bg"><div class="analytics-bar-fill" style="width:${Math.min((v/data.totalViews)*300,100)}%"></div></div></div>`).join("")}`:""}
        <div class="analytics-section-title">Contact Clicks</div>
        ${Object.entries(data.clicks||{}).map(([k,v])=>`<div class="analytics-stat"><span class="analytics-stat-label">${k.toUpperCase()}</span><span class="analytics-stat-val" id="astat-click-${k}">${v}</span></div>`).join("")}
        <div style="margin-top:1.5rem;padding:.8rem;background:var(--surface);border-radius:8px;font-family:var(--font-m);font-size:.65rem;color:var(--text3);text-align:center;letter-spacing:1px">Data stored locally</div>`;
      document.body.appendChild(panel);

      // ── REAL-TIME UPDATE: update panel numbers live when clicked ──
      function updateAnalyticsPanel() {
        const fresh = JSON.parse(localStorage.getItem(AKEY))||data;
        const totalClicks = Object.values(fresh.clicks||{}).reduce((a,b)=>a+b,0);
        const elViews = document.getElementById("astat-totalViews");
        const elToday = document.getElementById("astat-todayViews");
        const elUnique = document.getElementById("astat-uniqueDays");
        const elTotalClicks = document.getElementById("astat-totalClicks");
        if (elViews) elViews.textContent = fresh.totalViews;
        if (elToday) elToday.textContent = fresh.todayViews;
        if (elUnique) elUnique.textContent = Object.keys(fresh.uniqueDays||{}).length;
        if (elTotalClicks) elTotalClicks.textContent = totalClicks;
        // Update each contact stat
        Object.entries(fresh.clicks||{}).forEach(([k,v])=>{
          const el = document.getElementById("astat-click-"+k);
          if (el) el.textContent = v;
        });
      }

      // Patch click listeners to also trigger panel update
      [["contactLinkedin","linkedin"],["contactGithub","github"],["contactEmail","email"],["contactIg","instagram"]].forEach(([id,key])=>{
        const el=$(id); if(el) el.addEventListener("click",()=>{
          data.clicks[key]++; localStorage.setItem(AKEY,JSON.stringify(data));
          updateAnalyticsPanel();
        });
      });

      // Auto-refresh every 5 seconds when panel is open
      let refreshInterval = null;
      fab.addEventListener("click",()=>{
        panel.classList.toggle("open");
        if (panel.classList.contains("open")) {
          updateAnalyticsPanel();
          refreshInterval = setInterval(updateAnalyticsPanel, 5000);
        } else {
          if (refreshInterval) { clearInterval(refreshInterval); refreshInterval = null; }
        }
      });
      document.getElementById("analyticsClose")?.addEventListener("click",()=>{
        panel.classList.remove("open");
        if (refreshInterval) { clearInterval(refreshInterval); refreshInterval = null; }
      });
    }
    buildAnalytics();

    /* ══ 3. PERFORMANCE MODE ══ */
    function initPerfMode() {
      const navRight = document.querySelector(".nav-right"); if(!navRight||$("perfBtn")) return;
      const btn = document.createElement("button"); btn.className="perf-btn"; btn.id="perfBtn";
      btn.innerHTML=`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Perf`;
      let on = localStorage.getItem("perfMode")==="1";
      if(on){document.body.classList.add("perf-mode");btn.style.cssText="color:var(--teal);border-color:var(--teal)";}
      btn.addEventListener("click",()=>{
        on=!on; document.body.classList.toggle("perf-mode",on);
        localStorage.setItem("perfMode",on?"1":"0");
        btn.style.cssText=on?"color:var(--teal);border-color:var(--teal)":"";
      });
      navRight.insertBefore(btn, navRight.querySelector("#hackerBtn")||navRight.firstChild);
    }
    initPerfMode();

    /* ══ 4. 4-LANGUAGE SELECTOR ══ */
    function initLangSelector() {
      const old = $("langToggleBtn"); if(old) old.remove();
      const navRight = document.querySelector(".nav-right"); if(!navRight) return;
      const langs = [
        {code:"id",flag:"🇮🇩",name:"Indonesia",label:"ID"},
        {code:"en",flag:"🇬🇧",name:"English",  label:"EN"},
        {code:"ar",flag:"🇸🇦",name:"العربية", label:"AR"},
        {code:"jp",flag:"🇯🇵",name:"日本語",   label:"JP"},
      ];
      const extraI18n = {
        ar:{"nav.home":"الرئيسية","nav.about":"من أنا","nav.stack":"التقنيات","nav.experience":"الخبرة","nav.projects":"المشاريع","nav.certificates":"الشهادات","nav.contact":"التواصل","hero.role":"// مطور Full-Stack","hero.ibuilds":"أبني ","hero.available":"متاح للعمل","hero.viewProjects":"عرض المشاريع","hero.getInTouch":"تواصل معي"},
        jp:{"nav.home":"ホーム","nav.about":"自己紹介","nav.stack":"技術","nav.experience":"経歴","nav.projects":"作品","nav.certificates":"資格","nav.contact":"連絡","hero.role":"// フルスタック開発者","hero.ibuilds":"私が作るのは","hero.available":"仕事募集中","hero.viewProjects":"作品を見る","hero.getInTouch":"連絡する"},
      };
      const cur = localStorage.getItem("ih_lang")||"id";
      const wrap = document.createElement("div"); wrap.className="lang-selector"; wrap.id="langSelectorWrap";
      const btn  = document.createElement("button"); btn.className="lang-selector-btn"; btn.id="langSelectorBtn";
      const drop = document.createElement("div"); drop.className="lang-dropdown"; drop.id="langDropdown";
      function updBtn(code){const l=langs.find(x=>x.code===code)||langs[0];btn.innerHTML=`${l.flag} ${l.label} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;}
      updBtn(cur);
      langs.forEach(l=>{
        const opt=document.createElement("div"); opt.className="lang-option"+(l.code===cur?" active":"");
        opt.innerHTML=`<span class="lang-flag">${l.flag}</span><span class="lang-name">${l.name}</span><span class="lang-code">${l.code.toUpperCase()}</span>`;
        opt.addEventListener("click",()=>{
          localStorage.setItem("ih_lang",l.code); updBtn(l.code);
          drop.querySelectorAll(".lang-option").forEach(o=>o.classList.remove("active")); opt.classList.add("active"); drop.classList.remove("open");
          if(typeof Admin!=="undefined"&&(l.code==="id"||l.code==="en")){Admin.setLang(l.code);}
          else if(extraI18n[l.code]){document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.getAttribute("data-i18n");if(extraI18n[l.code][k])el.innerHTML=extraI18n[l.code][k];});document.documentElement.setAttribute("dir",l.code==="ar"?"rtl":"ltr");}
          else{if(typeof Admin!=="undefined")Admin.setLang("id");document.documentElement.setAttribute("dir","ltr");}
        });
        drop.appendChild(opt);
      });
      btn.addEventListener("click",e=>{e.stopPropagation();drop.classList.toggle("open");});
      document.addEventListener("click",()=>drop.classList.remove("open"));
      wrap.appendChild(btn); wrap.appendChild(drop);
      navRight.insertBefore(wrap, navRight.querySelector("#hackerBtn")||navRight.firstChild);
    }
    initLangSelector();

    /* ══ 5. PWA ══ */
    function initPWA() {
      const manifest={name:"Ilham Hakim — Portfolio",short_name:"IH Portfolio",description:"Full-Stack Developer Portfolio",start_url:"/",display:"standalone",background_color:"#09090f",theme_color:"#c9a84c",icons:[{src:"assets/photo.jpg",sizes:"192x192",type:"image/jpeg"}]};
      const blob=new Blob([JSON.stringify(manifest)],{type:"application/json"});
      const link=document.createElement("link"); link.rel="manifest"; link.href=URL.createObjectURL(blob); document.head.appendChild(link);
      let tm=document.querySelector('meta[name="theme-color"]');
      if(!tm){tm=document.createElement("meta");tm.name="theme-color";document.head.appendChild(tm);}tm.content="#c9a84c";
      let deferred=null;
      window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;if(!sessionStorage.getItem("pwaDismiss"))setTimeout(()=>showPWA(),6000);});
      function showPWA(){
        if($("pwaPrompt")) return;
        const p=document.createElement("div"); p.id="pwaPrompt";
        p.innerHTML=`<div class="pwa-icon">📱</div><div class="pwa-info"><div class="pwa-title">Install Portfolio App</div><div class="pwa-desc">Tambahkan ke layar utama HP kamu!</div><div class="pwa-btns"><button class="pwa-install" id="pwaInstall">Install</button><button class="pwa-dismiss" id="pwaDismiss">Nanti</button></div></div>`;
        document.body.appendChild(p); setTimeout(()=>p.classList.add("show"),100);
        document.getElementById("pwaInstall")?.addEventListener("click",async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;}p.remove();});
        document.getElementById("pwaDismiss")?.addEventListener("click",()=>{sessionStorage.setItem("pwaDismiss","1");p.remove();});
      }
      if("serviceWorker" in navigator){
        const sw=`const C='ih-v1';const A=['/','/index.html'];self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting();});self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});`;
        navigator.serviceWorker.register(URL.createObjectURL(new Blob([sw],{type:"application/javascript"}))).catch(()=>{});
      }
    }
    initPWA();

    /* ══ 6. SEO ══ */
    function injectSEO() {
      const m=(n,v,p)=>{let e=document.querySelector(p?`meta[property="${n}"]`:`meta[name="${n}"]`);if(!e){e=document.createElement("meta");if(p)e.setAttribute("property",n);else e.name=n;document.head.appendChild(e);}e.content=v;};
      m("description","Ilham Hakim — Full-Stack Developer dari Surabaya. React, Laravel, Node.js, PostgreSQL.");
      m("keywords","Ilham Hakim,Full Stack Developer,Surabaya,Laravel,React,Node.js,Web Developer Indonesia");
      m("author","Ilham Hakim"); m("robots","index, follow");
      m("og:title","Ilham Hakim — Full-Stack Developer",true); m("og:description","Portfolio Full-Stack Developer Surabaya",true);
      m("og:type","website",true); m("og:url",location.href,true);
      m("og:image",location.origin+"/assets/photo.jpg",true); m("og:locale","id_ID",true);
      m("twitter:card","summary_large_image"); m("twitter:title","Ilham Hakim — Full-Stack Developer");
      m("twitter:image",location.origin+"/assets/photo.jpg");
      if(!document.querySelector('script[type="application/ld+json"]')){
        const s=document.createElement("script"); s.type="application/ld+json";
        s.textContent=JSON.stringify({"@context":"https://schema.org","@type":"Person","name":"Ilham Hakim","jobTitle":"Full-Stack Developer","url":location.origin,"email":"ilhamhakim463@gmail.com","telephone":"+6285267967492","address":{"@type":"PostalAddress","addressLocality":"Surabaya","addressCountry":"ID"},"sameAs":["https://github.com/ilhamhakim463-hash","https://www.instagram.com/ham39_kim"],"knowsAbout":["React","Laravel","Node.js","TypeScript","PostgreSQL"]});
        document.head.appendChild(s);
      }
      if(!document.querySelector('link[rel="canonical"]')){const c=document.createElement("link");c.rel="canonical";c.href=location.origin;document.head.appendChild(c);}
    }
    injectSEO();

    /* ══ 7. PRINT ══ */
    window.addEventListener("beforeprint",()=>{
      document.title="Ilham Hakim — Resume";
      document.querySelectorAll("[data-reveal],.tl-item,.project-card,.cert-card,.testi-card,.stack-item").forEach(el=>{el.classList.add("revealed");el.style.opacity="1";el.style.transform="none";});
    });
    window.addEventListener("afterprint",()=>{document.title="Ilham Hakim — Full-Stack Developer";});

    console.log("%c🏢 Portfolio v10 — Enterprise Edition","color:#c9a84c;font-size:1.1rem;font-weight:bold;");
  });
})();
