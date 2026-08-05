/* ============================================================
   admin.js — Portfolio Admin Panel v3.0
   - Klik foto 5x untuk akses
   - Upload foto profil & logo
   - Edit loading screen
   - Sertifikat + link demo + foto
   - Bilingual ID/EN + auto-translate
   - localStorage persistence
============================================================ */
const Admin = (() => {

  const STORE_KEY = "ih_portfolio_data";
  const PASS_KEY  = "ih_admin_pass";
  const LANG_KEY  = "ih_lang";
  const DEFAULT_PASS = "admin123";

  let clickCount = 0, clickTimer = null;

  /* ── STORAGE ── */
  const save  = d  => localStorage.setItem(STORE_KEY, JSON.stringify(d));
  const load  = () => { try{ return JSON.parse(localStorage.getItem(STORE_KEY))||null; }catch{return null;} };
  const getPass = () => localStorage.getItem(PASS_KEY)||DEFAULT_PASS;
  const setPass = p => localStorage.setItem(PASS_KEY, p);
  const getLang = () => localStorage.getItem(LANG_KEY)||"id";
  const setLangStore = l => localStorage.setItem(LANG_KEY, l);

  /* ── I18N STRINGS ── */
  const i18n = {
    id: {
"nav.home":"Home","nav.about":"Tentang","nav.stack":"Stack",
      "nav.projects":"Projects","nav.certificates":"Sertifikat","nav.contact":"Kontak","nav.resume":"Resume",
      "hero.role":"// Full-Stack Developer","hero.ibuilds":"Saya membangun ",
      "hero.currentlyBuilding":"Sedang membangun","hero.available":"Tersedia untuk kerja",
      "hero.viewProjects":"Lihat Projects","hero.getInTouch":"Hubungi Saya",
      "hero.projectsDone":"Project Selesai","hero.yearsExp":"Tahun Pengalaman","hero.certificates":"Sertifikat",
      "about.title":"Siapa <em>Saya</em>","about.skillsTitle":"Keahlian <em>Teknis</em>",
      "about.perf":"Performa Utama","about.perfDesc":"Dioptimalkan untuk kecepatan di setiap lapisan",
      "about.design":"Berorientasi Desain","about.designDesc":"Antarmuka pixel-perfect dengan perhatian pada detail",
      "about.sec":"Fokus Keamanan","about.secDesc":"Praktik terbaik diterapkan di setiap project",
      "about.mobile":"Mobile-First","about.mobileDesc":"Desain responsif yang berfungsi di mana saja",
"stack.title":"Alat & <em>Teknologi</em>","stack.subtitle":"Klik teknologi untuk mengetahui lebih lanjut",
      "proj.title":"Karya <em>Terpilih</em>",
      "cert.title":"Sertifi<em>kat</em>","cert.add":"Tambah Sertifikat Baru",
      "testi.title":"Kata Orang <em>Lain</em>","contact.title":"Mari <em>Terhubung</em>",
      "contact.intro":"Terbuka untuk project dan kolaborasi yang menarik. Hubungi saya dan mari bangun sesuatu yang luar biasa bersama.",
      "contact.email":"Email","modal.features":"Fitur Utama","modal.demo":"Live Demo →",
    },
    en: {
"nav.home":"Home","nav.about":"About","nav.stack":"Stack",
      "nav.projects":"Projects","nav.certificates":"Certificates","nav.contact":"Contact","nav.resume":"Resume",
      "hero.role":"// Full-Stack Developer","hero.ibuilds":"I build ",
      "hero.currentlyBuilding":"Currently building","hero.available":"Available for work",
      "hero.viewProjects":"View Projects","hero.getInTouch":"Get In Touch",
      "hero.projectsDone":"Projects Done","hero.yearsExp":"Years Exp.","hero.certificates":"Certificates",
      "about.title":"Who I <em>Am</em>","about.skillsTitle":"Tech <em>Expertise</em>",
      "about.perf":"Performance First","about.perfDesc":"Optimized for speed and scalability at every layer",
      "about.design":"Design-Minded","about.designDesc":"Pixel-perfect interfaces with attention to detail",
      "about.sec":"Security-Focused","about.secDesc":"Best practices baked into every project",
      "about.mobile":"Mobile-First","about.mobileDesc":"Responsive designs that work everywhere",
"stack.title":"Tools & <em>Technologies</em>","stack.subtitle":"Click any technology to learn more",
      "proj.title":"Selected <em>Work</em>",
      "cert.title":"Certifi<em>cates</em>","cert.add":"Add New Certificate",
      "testi.title":"What People <em>Say</em>","contact.title":"Let's <em>Connect</em>",
      "contact.intro":"Open to exciting projects and collaborations. Reach out and let's build something remarkable together.",
      "contact.email":"Email","modal.features":"Key Features","modal.demo":"Live Demo →",
    }
  };

  /* ── APPLY LANG ── */
  function applyLang(lang) {
    const strings = i18n[lang] || i18n.id;
    const isEN = lang === "en";
    const data = load() || buildDefault();

    // i18n data-i18n attributes
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (strings[key]) el.innerHTML = strings[key];
    });

    // Dynamic content
    const heroBio = document.querySelector(".bio");
    if (heroBio) heroBio.textContent = isEN ? (data.hero.bio_en||data.hero.bio_id) : data.hero.bio_id;

    const cbVal = document.querySelector(".cb-value");
    if (cbVal) cbVal.textContent = isEN ? (data.hero.current_en||data.hero.current_id) : data.hero.current_id;

    const at1 = document.getElementById("aboutText1");
    if (at1) at1.textContent = isEN ? (data.about.text1_en||data.about.text1_id) : data.about.text1_id;
    const at2 = document.getElementById("aboutText2");
    if (at2) at2.textContent = isEN ? (data.about.text2_en||data.about.text2_id) : data.about.text2_id;

    // Stats
    const nums = document.querySelectorAll("[data-count]");
    if (nums[0]) nums[0].setAttribute("data-count", data.hero.stats?.projects||12);
    if (nums[1]) nums[1].setAttribute("data-count", data.hero.stats?.years||3);
    if (nums[2]) nums[2].setAttribute("data-count", data.hero.stats?.certs||3);

    // Hero name
    const hName = document.getElementById("h-name");
    if (hName) hName.innerHTML = `${data.hero.name}<br><span class="gold-italic">${data.hero.surname}</span>`;

    // Logo
    const navTxt = document.getElementById("navLogoText");
    const ftTxt  = document.getElementById("footerLogoText");
    const ldTxt  = document.getElementById("loaderLogoText");
    if (navTxt) navTxt.textContent = (data.hero.initials||"IH")+".";
    if (ftTxt)  ftTxt.textContent  = (data.hero.initials||"IH")+".";
    if (ldTxt)  ldTxt.textContent  = (data.hero.initials||"IH")+".";

    // Loading text
    const ldTxt2 = document.getElementById("loaderText");
    if (ldTxt2) ldTxt2.textContent = isEN ? (data.settings?.loaderText_en||"Loading experience...") : (data.settings?.loaderText_id||"Memuat pengalaman...");

    // Footer
    const ft = document.getElementById("footerText");
    if (ft) ft.textContent = `© ${new Date().getFullYear()} ${data.hero.name} ${data.hero.surname} — Crafted with precision & passion`;

    // Contact values
    updateContactDOM(data, lang);

    // Re-render dynamic sections that have bilingual content
    // Note: certificates don't have lang-specific text, skip re-render to avoid flicker
    if (typeof renderProjects   === "function") renderProjects("all");
    if (typeof renderTimeline   === "function") renderTimeline();
    if (typeof renderTestimonials === "function") renderTestimonials();
  }

  function updateContactDOM(data, lang) {
    const isEN = lang === "en";
    const c = data.contact;

    const emailEl = document.getElementById("contactEmail");
    if (emailEl) emailEl.href = `mailto:${c.email}`;
    const emailVal = document.getElementById("contactEmailVal");
    if (emailVal) emailVal.textContent = c.email;

    const ghEl = document.getElementById("contactGithub");
    if (ghEl) ghEl.href = c.github_url||`https://github.com/${c.github}`;
    const ghVal = document.getElementById("contactGithubVal");
    if (ghVal) ghVal.textContent = c.github;

    const liEl = document.getElementById("contactLinkedin");
    if (liEl) liEl.href = c.linkedin_url||"https://www.linkedin.com/in/ilham-hakim-dev/";
    const liVal = document.getElementById("contactLinkedinVal");
    if (liVal) liVal.textContent = c.linkedin||"Ilham Hakim";

    const igEl = document.getElementById("contactIg");
    if (igEl) igEl.href = c.ig_url||"https://www.instagram.com/"+c.instagram.replace("@","");
    const igVal = document.getElementById("contactIgVal");
    if (igVal) igVal.textContent = c.instagram;

    // ── Sync mobile menu social links ──
    const mobEmail = document.querySelector('.mobile-menu-socials a[title="Email"]');
    if (mobEmail) mobEmail.href = `mailto:${c.email}`;

    const mobGithub = document.querySelector('.mobile-menu-socials a[title="GitHub"]');
    if (mobGithub) mobGithub.href = c.github_url||`https://github.com/${c.github}`;

    const mobLinkedin = document.querySelector('.mobile-menu-socials a[title="LinkedIn"]');
    if (mobLinkedin) mobLinkedin.href = c.linkedin_url||"https://www.linkedin.com/in/ilham-hakim-dev/";

    const mobIg = document.querySelector('.mobile-menu-socials a[title="Instagram"]');
    if (mobIg) mobIg.href = c.ig_url||"https://www.instagram.com/"+c.instagram.replace("@","");
  }

  /* ── BUILD DEFAULT DATA ── */
  function buildDefault() {
    return {
      hero: {
        name:"Ilham", surname:"Hakim", initials:"IH",
        bio_id:"Membangun aplikasi web yang robust dan scalable dengan perhatian penuh pada detail. Menjembatani desain elegan dengan arsitektur backend yang powerful — berbasis di Surabaya, Indonesia.",
        bio_en:"Crafting robust, scalable web applications with meticulous attention to detail. Bridging elegant design with powerful backend architecture — based in Surabaya, Indonesia.",
        current_id:"Platform E-Commerce dengan rekomendasi AI",
        current_en:"E-Commerce Platform with AI recommendations",
        stats:{projects:4,years:2,certs:5}
      },
      about:{
        text1_id:"Saya adalah Full-Stack Developer yang bersemangat berbasis di Surabaya, Indonesia. Saya mengkhususkan diri dalam menciptakan pengalaman digital yang mulus — dari frontend yang pixel-perfect hingga sistem backend yang scalable.",
        text1_en:"I'm a passionate Full-Stack Developer based in Surabaya, Indonesia. I specialize in creating seamless digital experiences — from pixel-perfect frontends to scalable backend systems.",
        text2_id:"Pendekatan saya menggabungkan prinsip arsitektur bersih dengan sensibilitas desain modern, selalu mengutamakan performa dan pengalaman pengguna.",
        text2_en:"My approach combines clean architecture principles with modern design sensibilities, always with performance and user experience at the forefront.",
      },
contact:{
        email:"ilhamhakim463@gmail.com",
        linkedin:"Ilham Hakim",
        github:"ilhamhakim463-hash",
        instagram:"@ham39_kim",
        github_url:"https://github.com/ilhamhakim463-hash",
        linkedin_url:"https://www.linkedin.com/in/ilham-hakim-dev/",
        ig_url:"https://www.instagram.com/ham39_kim",
      },
      projects: typeof PROJECTS!=="undefined"?PROJECTS:[],
      certificates: typeof CERTIFICATES!=="undefined"?CERTIFICATES:[],
      testimonials: typeof TESTIMONIALS!=="undefined"?TESTIMONIALS:[],
      timeline: typeof TIMELINE!=="undefined"?TIMELINE:[],
      settings:{defaultLang:"id",loaderText_id:"Memuat pengalaman...",loaderText_en:"Loading experience..."}
    };
  }

  /* ── INIT DATA ── */
  function initData() {
    const stored = load();
    if (stored) {
      // Merge: use new data from data.js as base, then overlay any user customizations from localStorage
      // Projects: always use latest from data.js, keep user-added projects
      if (stored.projects?.length) {
        // Keep user-added projects (those with id > 10000 or that don't exist in PROJECTS)
        const freshIds = PROJECTS.map(p=>p.id);
        const userProjects = stored.projects.filter(p => !freshIds.includes(p.id));
        if (userProjects.length > 0) {
          userProjects.forEach(p => PROJECTS.push(p));
        }
      }
      // Certificates: same merge strategy
      if (stored.certificates?.length) {
        const freshIds = CERTIFICATES.map(c=>c.id);
        const userCerts = stored.certificates.filter(c => !freshIds.includes(c.id));
        if (userCerts.length > 0) {
          userCerts.forEach(c => CERTIFICATES.push(c));
        }
      }
      // Stack: keep user-added tools
      if (stored.stack?.length) {
        const freshNames = STACK.map(s=>s.name);
        const userStack = stored.stack.filter(s => !freshNames.includes(s.name));
        if (userStack.length > 0) {
          userStack.forEach(s => STACK.push(s));
        }
      }
      // Testimonials: keep user-added
      if (stored.testimonials?.length) {
        const testiTexts = TESTIMONIALS.map(t=>t.text);
        const userTesti = stored.testimonials.filter(t => !testiTexts.includes(t.text));
        if (userTesti.length > 0) {
          userTesti.forEach(t => TESTIMONIALS.push(t));
        }
      }
      // Timeline: keep user-added
      if (stored.timeline?.length) {
        const tlKeys = TIMELINE.map(t=>t.role+t.company);
        const userTl = stored.timeline.filter(t => !tlKeys.includes(t.role+t.company));
        if (userTl.length > 0) {
          userTl.forEach(t => TIMELINE.push(t));
        }
      }
    }
    // Always save the merged result back
    const merged = buildDefault();
    merged.projects = PROJECTS;
    merged.certificates = CERTIFICATES;
    merged.stack = STACK;
    merged.testimonials = TESTIMONIALS;
    merged.timeline = TIMELINE;
    save(merged);
  }

  /* ── AUTO TRANSLATE ── */
  async function autoTranslate(text, from="id", to="en") {
    if (!text?.trim()) return "";
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
      const json = await res.json();
      return json.responseStatus===200 ? json.responseData.translatedText : text;
    } catch { return text; }
  }

  /* ── FILE TO BASE64 ── */
  function fileToBase64(file) {
    return new Promise((res,rej)=>{
      const r=new FileReader();
      r.onload=()=>res(r.result);
      r.onerror=rej;
      r.readAsDataURL(file);
    });
  }

  /* ── PHOTO CLICK COUNTER ── */
  function initPhotoClick() {
    const card = document.querySelector(".profile-card") || document.querySelector(".hex-frame");
    if (!card) return;
    card.addEventListener("click", () => {
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(()=>{ clickCount=0; }, 3000);
      // Flash hint
      const hint = document.getElementById("clickHint");
      if (hint && clickCount>1) { hint.textContent=`${clickCount}/5 klik`; setTimeout(()=>{ if(!document.getElementById("adminPanel")) hint.textContent="Click for matrix"; },800); }
      if (clickCount >= 5) { clickCount=0; clearTimeout(clickTimer); showLogin(); }
    }, true); // capture phase so it runs before matrix
  }

  /* ── LOGIN ── */
  function showLogin() {
    document.getElementById("adminLoginModal")?.remove();
    const m = document.createElement("div"); m.id="adminLoginModal";
    m.innerHTML=`<div class="admin-login-overlay" id="adminLoginOverlay"><div class="admin-login-box"><div class="admin-login-header"><span class="admin-lock-icon">🔐</span><h3>Admin Panel</h3><p>Masukkan password untuk mengakses</p></div><div class="admin-login-body"><input type="password" id="adminPassInput" class="admin-input" placeholder="Password..." autocomplete="off"/><div class="admin-login-err" id="adminLoginErr" style="display:none">❌ Password salah!</div><button class="admin-login-btn" id="adminLoginSubmit">Masuk →</button><button class="admin-login-cancel" id="adminLoginCancel">Batal</button></div></div></div>`;
    document.body.appendChild(m);
    const inp=document.getElementById("adminPassInput");
    setTimeout(()=>inp.focus(),100);
    const tryLogin=()=>{
      if(inp.value===getPass()){m.remove();showPanel();}
      else{document.getElementById("adminLoginErr").style.display="block";inp.value="";inp.focus();setTimeout(()=>{document.getElementById("adminLoginErr").style.display="none";},2000);}
    };
    document.getElementById("adminLoginSubmit").addEventListener("click",tryLogin);
    inp.addEventListener("keydown",e=>{if(e.key==="Enter")tryLogin();});
    document.getElementById("adminLoginCancel").addEventListener("click",()=>m.remove());
    document.getElementById("adminLoginOverlay").addEventListener("click",e=>{if(e.target.id==="adminLoginOverlay")m.remove();});
  }

  /* ════════════════════════════════════════════════════════
     ADMIN PANEL
  ════════════════════════════════════════════════════════ */
  function showPanel() {
    document.getElementById("adminPanel")?.remove();
    const data = load()||buildDefault();
    const panel = document.createElement("div"); panel.id="adminPanel";
    panel.innerHTML=`
    <div class="admin-overlay">
      <div class="admin-panel">
        <div class="admin-header">
          <div class="admin-title"><span class="admin-logo">⚙</span><div><h2>Admin Panel</h2><p>Kelola semua konten portofolio</p></div></div>
          <div class="admin-header-right">
            <span class="admin-saved-badge" id="adminSavedBadge" style="display:none">✓ Tersimpan</span>
            <button class="admin-close-btn" id="adminCloseBtn">✕ Tutup</button>
          </div>
        </div>
        <div class="admin-tabs">
          <button class="admin-tab active" data-tab="hero">👤 Profil</button>
          <button class="admin-tab" data-tab="media">🖼 Media</button>
          <button class="admin-tab" data-tab="projects">🗂 Projects</button>
          <button class="admin-tab" data-tab="certs">🏆 Sertifikat</button>
          <button class="admin-tab" data-tab="timeline">📅 Riwayat</button>
          <button class="admin-tab" data-tab="testi">💬 Testimoni</button>
          <button class="admin-tab" data-tab="stack">🧰 Stack</button>
          <button class="admin-tab" data-tab="contact">📞 Kontak</button>
          <button class="admin-tab" data-tab="settings">⚙ Pengaturan</button>
        </div>
        <div class="admin-body">

          <!-- TAB: PROFIL -->
          <div class="admin-tab-content active" id="tab-hero">
            <div class="admin-section-title">Informasi Profil</div>
            <div class="admin-grid-2">
              <div class="admin-field"><label>Nama Depan</label><input class="admin-input" id="af-name" value="${data.hero.name}"/></div>
              <div class="admin-field"><label>Nama Belakang</label><input class="admin-input" id="af-surname" value="${data.hero.surname}"/></div>
              <div class="admin-field"><label>Inisial (untuk logo teks)</label><input class="admin-input" id="af-initials" value="${data.hero.initials}"/></div>
              <div class="admin-field"><label>Jumlah Projects</label><input class="admin-input" type="number" id="af-stat-proj" value="${data.hero.stats?.projects||12}"/></div>
              <div class="admin-field"><label>Tahun Pengalaman</label><input class="admin-input" type="number" id="af-stat-years" value="${data.hero.stats?.years||3}"/></div>
              <div class="admin-field"><label>Jumlah Sertifikat</label><input class="admin-input" type="number" id="af-stat-certs" value="${data.hero.stats?.certs||3}"/></div>
            </div>
            <div class="admin-section-title" style="margin-top:1.5rem">Bio & Status</div>
            <div class="admin-bilingual">
              <div class="admin-field"><label>Bio (Indonesia)</label><textarea class="admin-textarea" id="af-bio-id">${data.hero.bio_id}</textarea></div>
              <div class="admin-field"><label>Bio (English) <button class="btn-auto-translate" data-src="af-bio-id" data-dst="af-bio-en">🔄 Auto</button></label><textarea class="admin-textarea" id="af-bio-en">${data.hero.bio_en||""}</textarea></div>
              <div class="admin-field"><label>Sedang Membangun (Indonesia)</label><input class="admin-input" id="af-cur-id" value="${data.hero.current_id}"/></div>
              <div class="admin-field"><label>Currently Building (English) <button class="btn-auto-translate" data-src="af-cur-id" data-dst="af-cur-en">🔄 Auto</button></label><input class="admin-input" id="af-cur-en" value="${data.hero.current_en||""}"/></div>
            </div>
            <div class="admin-section-title" style="margin-top:1.5rem">Tentang Saya</div>
            <div class="admin-bilingual">
              <div class="admin-field"><label>Paragraf 1 (Indonesia)</label><textarea class="admin-textarea" id="af-ab1-id">${data.about.text1_id}</textarea></div>
              <div class="admin-field"><label>Paragraf 1 (English) <button class="btn-auto-translate" data-src="af-ab1-id" data-dst="af-ab1-en">🔄 Auto</button></label><textarea class="admin-textarea" id="af-ab1-en">${data.about.text1_en||""}</textarea></div>
              <div class="admin-field"><label>Paragraf 2 (Indonesia)</label><textarea class="admin-textarea" id="af-ab2-id">${data.about.text2_id}</textarea></div>
              <div class="admin-field"><label>Paragraf 2 (English) <button class="btn-auto-translate" data-src="af-ab2-id" data-dst="af-ab2-en">🔄 Auto</button></label><textarea class="admin-textarea" id="af-ab2-en">${data.about.text2_en||""}</textarea></div>
            </div>
            <button class="admin-save-btn" id="saveHeroBtn">💾 Simpan Profil</button>
          </div>

          <!-- TAB: MEDIA -->
          <div class="admin-tab-content" id="tab-media">
            <div class="admin-section-title">Foto Profil</div>
            <div class="admin-media-preview">
              <img id="previewPhoto" src="assets/photo.jpg" alt="Foto Profil" onerror="this.style.display='none'"/>
              <div class="admin-media-info">
                <p>Foto profil muncul di hexagon/card hero section.</p>
                <p style="margin-top:.5rem;font-size:.75rem;color:var(--text3)">Format: JPG, PNG, WEBP. Maks 2MB. Rasio ideal: 3:4 (portrait).</p>
                <label class="admin-upload-btn" for="uploadPhotoInput">📷 Pilih Foto Baru</label>
                <input type="file" id="uploadPhotoInput" accept="image/*" style="display:none"/>
                <div class="admin-upload-status" id="photoUploadStatus"></div>
              </div>
            </div>

            <div class="admin-section-title" style="margin-top:2rem">Logo / Inisial</div>
            <div class="admin-media-preview">
              <img id="previewLogo" src="assets/logo.png" alt="Logo" onerror="this.style.display='none'" style="max-width:100px;max-height:100px;object-fit:contain;border-radius:8px;background:var(--surface2);padding:.5rem;"/>
              <div class="admin-media-info">
                <p>Logo muncul di navbar, footer, dan loading screen. Jika tidak ada, akan menggunakan teks inisial.</p>
                <p style="margin-top:.5rem;font-size:.75rem;color:var(--text3)">Format: PNG transparan direkomendasikan. Maks 500KB.</p>
                <label class="admin-upload-btn" for="uploadLogoInput">🖼 Pilih Logo Baru</label>
                <input type="file" id="uploadLogoInput" accept="image/*" style="display:none"/>
                <div class="admin-upload-status" id="logoUploadStatus"></div>
              </div>
            </div>

            <div class="admin-section-title" style="margin-top:2rem">Loading Screen</div>
            <div class="admin-grid-2">
              <div class="admin-field"><label>Teks Loading (Indonesia)</label><input class="admin-input" id="as-loader-id" value="${data.settings?.loaderText_id||"Memuat pengalaman..."}"/></div>
              <div class="admin-field"><label>Loading Text (English) <button class="btn-auto-translate" data-src="as-loader-id" data-dst="as-loader-en">🔄 Auto</button></label><input class="admin-input" id="as-loader-en" value="${data.settings?.loaderText_en||"Loading experience..."}"/></div>
            </div>
            <button class="admin-save-btn" id="saveMediaBtn">💾 Simpan Pengaturan Media</button>
          </div>

          <!-- TAB: PROJECTS -->
          <div class="admin-tab-content" id="tab-projects">
            <div class="admin-section-title">Daftar Projects <button class="admin-add-btn" id="addProjectBtn">+ Tambah Project</button></div>
            <div id="projectAdminList"></div>
          </div>

          <!-- TAB: SERTIFIKAT -->
          <div class="admin-tab-content" id="tab-certs">
            <div class="admin-section-title">Daftar Sertifikat <button class="admin-add-btn" id="addCertAdminBtn">+ Tambah Sertifikat</button></div>
            <div id="certAdminList"></div>
          </div>

          <!-- TAB: RIWAYAT -->
          <div class="admin-tab-content" id="tab-timeline">
            <div class="admin-section-title">Pengalaman & Pendidikan <button class="admin-add-btn" id="addTimelineBtn">+ Tambah</button></div>
            <div id="timelineAdminList"></div>
          </div>

          <!-- TAB: TESTIMONI -->
          <div class="admin-tab-content" id="tab-testi">
            <div class="admin-section-title">Testimoni <button class="admin-add-btn" id="addTestiBtn">+ Tambah</button></div>
            <div id="testiAdminList"></div>
          </div>

          <!-- TAB: STACK -->
          <div class="admin-tab-content" id="tab-stack">
            <div class="admin-section-title">Tech Stack & Tools <button class="admin-add-btn" id="addStackBtn">+ Tambah Tool</button></div>
            <div class="stack-admin-filter" id="stackAdminFilter">
              <button class="stack-admin-filter-btn active" data-cat="all">Semua</button>
              <button class="stack-admin-filter-btn" data-cat="Frontend">Frontend</button>
              <button class="stack-admin-filter-btn" data-cat="Backend">Backend</button>
              <button class="stack-admin-filter-btn" data-cat="Database">Database</button>
              <button class="stack-admin-filter-btn" data-cat="DevOps">DevOps</button>
              <button class="stack-admin-filter-btn" data-cat="Design">Design</button>
              <button class="stack-admin-filter-btn" data-cat="Mobile">Mobile</button>
              <button class="stack-admin-filter-btn" data-cat="Cloud">Cloud</button>
            </div>
            <div id="stackAdminList"></div>
          </div>

<!-- TAB: KONTAK -->
          <div class="admin-tab-content" id="tab-contact">
            <div class="admin-section-title">Informasi Kontak</div>
            <div class="admin-grid-2">
              <div class="admin-field"><label>Email</label><input class="admin-input" id="ac-email" value="${data.contact.email}"/></div>
              <div class="admin-field"><label>LinkedIn URL</label><input class="admin-input" id="ac-linkedin-url" value="${data.contact.linkedin_url||"https://www.linkedin.com/in/ilham-hakim-dev/"}"/></div>
              <div class="admin-field"><label>GitHub Username</label><input class="admin-input" id="ac-gh" value="${data.contact.github}"/></div>
              <div class="admin-field"><label>Instagram URL</label><input class="admin-input" id="ac-ig-url" value="${data.contact.ig_url}"/></div>
            </div>
            <button class="admin-save-btn" id="saveContactBtn">💾 Simpan Kontak</button>
          </div>

          <!-- TAB: PENGATURAN -->
          <div class="admin-tab-content" id="tab-settings">
            <div class="admin-section-title">Bahasa Default</div>
            <div class="admin-grid-2">
              <div class="admin-field"><label>Bahasa Default Website</label>
                <select class="admin-input" id="as-lang">
                  <option value="id" ${(data.settings?.defaultLang||"id")==="id"?"selected":""}>🇮🇩 Bahasa Indonesia</option>
                  <option value="en" ${(data.settings?.defaultLang||"id")==="en"?"selected":""}>🇬🇧 English</option>
                </select>
              </div>
            </div>
            <div class="admin-section-title" style="margin-top:1.5rem">Ganti Password Admin</div>
            <div class="admin-grid-2">
              <div class="admin-field"><label>Password Lama</label><input type="password" class="admin-input" id="as-old-pass" placeholder="Password lama..."/></div>
              <div class="admin-field"><label>Password Baru (min 6 karakter)</label><input type="password" class="admin-input" id="as-new-pass" placeholder="Password baru..."/></div>
              <div class="admin-field"><label>Konfirmasi Password Baru</label><input type="password" class="admin-input" id="as-confirm-pass" placeholder="Ulangi password baru..."/></div>
            </div>
            <div class="admin-msg" id="settingsMsg"></div>
            <button class="admin-save-btn" id="saveSettingsBtn">💾 Simpan Pengaturan</button>
            <div class="admin-section-title" style="margin-top:2rem;color:#e53e3e">⚠ Danger Zone</div>
            <div class="admin-danger-box">
              <p>Reset semua konten ke pengaturan default. <strong>Tindakan ini tidak dapat dibatalkan!</strong></p>
              <button class="admin-danger-btn" id="resetAllBtn">🗑 Reset Semua Data</button>
            </div>
          </div>

        </div><!-- /admin-body -->
      </div><!-- /admin-panel -->
    </div>`;
    document.body.appendChild(panel);
    document.body.style.overflow="hidden";

    // Populate lists
    renderProjAdmin(data.projects||[]);
    renderCertAdmin(data.certificates||[]);
    renderTlAdmin(data.timeline||[]);
    renderTestiAdmin(data.testimonials||[]);
    renderStackAdmin(STACK||[]);

    // Tab switching
    panel.querySelectorAll(".admin-tab").forEach(tab=>{
      tab.addEventListener("click",()=>{
        panel.querySelectorAll(".admin-tab,.admin-tab-content").forEach(el=>el.classList.remove("active"));
        tab.classList.add("active");
        panel.querySelector(`#tab-${tab.dataset.tab}`).classList.add("active");
      });
    });

    // Auto-translate buttons
    function bindAutoTranslate(container) {
      container.querySelectorAll(".btn-auto-translate").forEach(btn=>{
        btn.onclick=async()=>{
          const s=document.getElementById(btn.dataset.src), d=document.getElementById(btn.dataset.dst);
          if(!s||!d) return;
          btn.textContent="⏳..."; btn.disabled=true;
          d.value=await autoTranslate(s.value,"id","en");
          btn.textContent="✓ Done"; setTimeout(()=>{btn.textContent="🔄 Auto";btn.disabled=false;},1500);
        };
      });
    }
    bindAutoTranslate(panel);

    // Close
    document.getElementById("adminCloseBtn").addEventListener("click",()=>{panel.remove();document.body.style.overflow="";});
    panel.querySelector(".admin-overlay").addEventListener("click",e=>{if(e.target===panel.querySelector(".admin-overlay")){panel.remove();document.body.style.overflow="";}});

    /* SAVE HERO */
    document.getElementById("saveHeroBtn").addEventListener("click",()=>{
      const d=load()||buildDefault();
      d.hero.name=document.getElementById("af-name").value.trim();
      d.hero.surname=document.getElementById("af-surname").value.trim();
      d.hero.initials=document.getElementById("af-initials").value.trim();
      d.hero.bio_id=document.getElementById("af-bio-id").value.trim();
      d.hero.bio_en=document.getElementById("af-bio-en").value.trim();
      d.hero.current_id=document.getElementById("af-cur-id").value.trim();
      d.hero.current_en=document.getElementById("af-cur-en").value.trim();
      d.about.text1_id=document.getElementById("af-ab1-id").value.trim();
      d.about.text1_en=document.getElementById("af-ab1-en").value.trim();
      d.about.text2_id=document.getElementById("af-ab2-id").value.trim();
      d.about.text2_en=document.getElementById("af-ab2-en").value.trim();
      d.hero.stats={
        projects:parseInt(document.getElementById("af-stat-proj").value)||12,
        years:parseInt(document.getElementById("af-stat-years").value)||3,
        certs:parseInt(document.getElementById("af-stat-certs").value)||3,
      };
      save(d); applyLang(getLang()); showSaved();
    });

    /* SAVE MEDIA — Photo */
    document.getElementById("uploadPhotoInput").addEventListener("change", async e=>{
      const file=e.target.files[0]; if(!file) return;
      if(file.size>2*1024*1024){document.getElementById("photoUploadStatus").textContent="❌ File terlalu besar (maks 2MB)"; return;}
      const statusEl=document.getElementById("photoUploadStatus");
      statusEl.textContent="⏳ Mengupload...";
      const base64=await fileToBase64(file);
      // Save as base64 in localStorage + update img
      const d=load()||buildDefault();
      d.media=d.media||{};
      d.media.photo=base64;
      save(d);
      // Update live photo
      const livePhoto=document.getElementById("profilePhoto");
      if(livePhoto) livePhoto.src=base64;
      document.getElementById("previewPhoto").src=base64;
      statusEl.textContent="✓ Foto berhasil diupdate!";
      setTimeout(()=>statusEl.textContent="",3000);
    });

    /* SAVE MEDIA — Logo */
    document.getElementById("uploadLogoInput").addEventListener("change", async e=>{
      const file=e.target.files[0]; if(!file) return;
      if(file.size>500*1024){document.getElementById("logoUploadStatus").textContent="❌ File terlalu besar (maks 500KB)"; return;}
      const statusEl=document.getElementById("logoUploadStatus");
      statusEl.textContent="⏳ Mengupload...";
      const base64=await fileToBase64(file);
      const d=load()||buildDefault();
      d.media=d.media||{};
      d.media.logo=base64;
      save(d);
      // Update all logo imgs
      // Update navbar logo
      const navImg=document.getElementById("navLogoImg");
      if(navImg){navImg.src=base64;navImg.style.cssText="display:block;height:34px;width:auto;max-width:120px;object-fit:contain;object-position:left center;";}
      // Update footer logo
      const ftImg=document.getElementById("footerLogoImg");
      if(ftImg){ftImg.src=base64;ftImg.style.cssText="display:block;height:30px;width:auto;max-width:100px;object-fit:contain;object-position:left center;";}
      // Update loader logo
      const ldImg=document.getElementById("loaderLogoImg");
      if(ldImg){ldImg.src=base64;ldImg.style.cssText="display:block;width:auto;height:80px;max-width:200px;object-fit:contain;object-position:center;margin:0 auto;";}
      // Hide text versions
      ["navLogoText","footerLogoText","loaderLogoText"].forEach(id=>{
        const el=document.getElementById(id); if(el) el.style.display="none";
      });
      document.getElementById("previewLogo").src=base64;
      statusEl.textContent="✓ Logo berhasil diupdate!";
      setTimeout(()=>statusEl.textContent="",3000);
    });

    document.getElementById("saveMediaBtn").addEventListener("click",()=>{
      const d=load()||buildDefault();
      d.settings=d.settings||{};
      d.settings.loaderText_id=document.getElementById("as-loader-id").value.trim();
      d.settings.loaderText_en=document.getElementById("as-loader-en").value.trim();
      save(d); applyLang(getLang()); showSaved();
    });

/* SAVE CONTACT */
    document.getElementById("saveContactBtn").addEventListener("click",()=>{
      const d=load()||buildDefault();
      const gh=document.getElementById("ac-gh").value.trim();
      const ig=document.getElementById("ac-ig-url").value.trim();
      const linkedinUrl=document.getElementById("ac-linkedin-url").value.trim();
      d.contact={
        email:document.getElementById("ac-email").value.trim(),
        linkedin:"Ilham Hakim",
        linkedin_url:linkedinUrl,
        github:gh,
        ig_url:ig,
        instagram:"@"+(ig.split("/").filter(Boolean).pop()||"").split("?")[0],
        github_url:`https://github.com/${gh}`,
      };
      save(d); applyLang(getLang()); showSaved();
    });

    /* SAVE SETTINGS */
    document.getElementById("saveSettingsBtn").addEventListener("click",()=>{
      const d=load()||buildDefault();
      const msg=document.getElementById("settingsMsg");
      d.settings=d.settings||{};
      d.settings.defaultLang=document.getElementById("as-lang").value;
      setLangStore(d.settings.defaultLang);
      // Password
      const oldP=document.getElementById("as-old-pass").value;
      const newP=document.getElementById("as-new-pass").value;
      const conP=document.getElementById("as-confirm-pass").value;
      if(oldP||newP||conP){
        if(oldP!==getPass()){msg.textContent="❌ Password lama salah!";msg.className="admin-msg error";return;}
        if(newP.length<6){msg.textContent="❌ Password min 6 karakter!";msg.className="admin-msg error";return;}
        if(newP!==conP){msg.textContent="❌ Konfirmasi tidak cocok!";msg.className="admin-msg error";return;}
        setPass(newP);
        ["as-old-pass","as-new-pass","as-confirm-pass"].forEach(id=>document.getElementById(id).value="");
        msg.textContent="✓ Password berhasil diubah!"; msg.className="admin-msg success";
      } else {
        msg.textContent="✓ Pengaturan tersimpan!"; msg.className="admin-msg success";
      }
      save(d); applyLang(d.settings.defaultLang);
      const lb=document.getElementById("langToggleBtn");
      if(lb) lb.textContent=d.settings.defaultLang==="id"?"🇬🇧 EN":"🇮🇩 ID";
      showSaved(); setTimeout(()=>{msg.textContent="";},2500);
    });

    /* ADD PROJECT */
    document.getElementById("addStackBtn").addEventListener("click",()=>{
      const newTool={name:"Tool Baru",category:"Frontend",color:"#6366f1",year:"",creator:"",tagline:"",desc:"",usage:"",svg:""};
      STACK.push(newTool);
      const d=load()||buildDefault(); d.stack=STACK; save(d);
      _stackAdminFilter="all";
      renderStackAdmin(STACK);
      setTimeout(()=>{
        const cards=document.querySelectorAll("#stackAdminList .admin-item-card");
        const last=cards[cards.length-1];
        if(last){
          last.scrollIntoView({behavior:"smooth",block:"center"});
          const body=last.querySelector(".admin-item-body");
          if(body) body.style.display="block";
          last.style.outline="2px solid rgba(99,102,241,.6)";
          setTimeout(()=>last.style.outline="",2000);
        }
      },80);
    });

    document.getElementById("addProjectBtn").addEventListener("click",()=>{
      const d=load()||buildDefault();
      const p={id:Date.now(),title:"Project Baru",category:"fullstack",tags:["React"],icon:getDefaultIcon("fullstack"),screenshot:"",desc_id:"Deskripsi project...",desc_en:"Project description...",features_id:["Fitur 1"],features_en:["Feature 1"],demo:"#",github:"https://github.com/ilhamhakim463-hash",year:new Date().getFullYear().toString()};
      (d.projects=d.projects||[]).push(p); PROJECTS.push(p); save(d); renderProjAdmin(d.projects);
      if(typeof renderProjects==="function") renderProjects("all");
      /* Auto-open the new card */
      setTimeout(()=>{
        const cards=document.querySelectorAll("#projectAdminList .admin-item-card");
        const last=cards[cards.length-1];
        if(last){
          last.scrollIntoView({behavior:"smooth",block:"center"});
          const body=last.querySelector(".admin-item-body");
          if(body) body.style.display="block";
          last.style.outline="2px solid rgba(99,102,241,.6)";
          setTimeout(()=>last.style.outline="",2000);
        }
      },100);
    });

    /* ADD CERT */
    document.getElementById("addCertAdminBtn").addEventListener("click",()=>{
      const d=load()||buildDefault();
      const c={id:"c"+Date.now(),name:"Sertifikat Baru",issuer:"Issuer",date:"",credId:"",desc:"Deskripsi.",icon:"🏆",demoUrl:"",imageUrl:""};
      (d.certificates=d.certificates||[]).push(c); CERTIFICATES.push(c); save(d); renderCertAdmin(d.certificates);
      if(typeof renderCerts==="function") renderCerts();
    });

    /* ADD TIMELINE */
    document.getElementById("addTimelineBtn").addEventListener("click",()=>{
      const d=load()||buildDefault();
      const t={type:"work",date:"2024",role:"Posisi Baru",company:"Perusahaan",desc:"Deskripsi."};
      (d.timeline=d.timeline||[]).push(t); TIMELINE.push(t); save(d); renderTlAdmin(d.timeline);
      if(typeof renderTimeline==="function") renderTimeline();
    });

    /* ADD TESTI */
    document.getElementById("addTestiBtn").addEventListener("click",()=>{
      const d=load()||buildDefault();
      const t={text:"Testimoni luar biasa.",name:"Nama Klien",role:"Jabatan, Perusahaan",initials:"NK"};
      (d.testimonials=d.testimonials||[]).push(t); TESTIMONIALS.push(t); save(d); renderTestiAdmin(d.testimonials);
      if(typeof renderTestimonials==="function") renderTestimonials();
    });

    /* RESET */
    document.getElementById("resetAllBtn").addEventListener("click",()=>{
      if(confirm("YAKIN ingin reset semua data? TIDAK dapat dibatalkan!")) { localStorage.removeItem(STORE_KEY); location.reload(); }
    });
  }

  /* ── RENDER PROJECT ADMIN ── */

  /* Icon sets per category */
  const ICON_SETS = {
    fullstack: ["🚀","⚡","🌐","🔥","💎","🛠","🏗","🔮","🌟","💡","🎯","🧩","🖥","🔧","⚙️","🏆","💻","🌍","🔐","📦"],
    frontend:  ["🎨","✨","🖌","💅","🌈","🎭","🖼","🪄","🎪","🎠","💫","🦋","🌸","🎆","🔷","🟣","🎇","✦","🌀","🔵"],
    backend:   ["⚙️","🔩","🗄","🛡","🔌","🔑","🏭","🧠","🔒","📡","💾","🔗","🌊","🐉","🔐","⚡","🦾","🤖","🧬","🛰"],
    mobile:    ["📱","🤳","📲","🧭","🗺","📍","🎮","🔔","💬","📸","🎯","🎪","🏃","🌐","⌚","🎵","📻","🎙","📡","🔭"]
  };

  function getDefaultIcon(category) {
    const icons = ICON_SETS[category] || ICON_SETS.fullstack;
    return icons[0];
  }

  function buildIconPicker(idx, currentIcon, category) {
    const icons = ICON_SETS[category] || ICON_SETS.fullstack;
    const allIcons = [...new Set([...icons, ...ICON_SETS.fullstack])];
    return `
      <div class="icon-picker-wrap" id="icon-picker-wrap-${idx}">
        <div class="icon-picker-preview" id="icon-picker-preview-${idx}">${currentIcon || icons[0]}</div>
        <input type="hidden" id="p-icon-${idx}" value="${currentIcon || icons[0]}"/>
        <button type="button" class="icon-picker-toggle" id="icon-picker-toggle-${idx}">
          Pilih Ikon ▾
        </button>
        <div class="icon-picker-dropdown" id="icon-picker-dd-${idx}" style="display:none">
          <div class="icon-picker-tabs">
            <button type="button" class="icon-tab active" data-cat="fullstack" data-idx="${idx}">Full-Stack</button>
            <button type="button" class="icon-tab" data-cat="frontend" data-idx="${idx}">Frontend</button>
            <button type="button" class="icon-tab" data-cat="backend" data-idx="${idx}">Backend</button>
            <button type="button" class="icon-tab" data-cat="mobile" data-idx="${idx}">Mobile</button>
          </div>
          <div class="icon-picker-grid" id="icon-picker-grid-${idx}">
            ${icons.map(ic=>`<button type="button" class="icon-opt${ic===currentIcon?' selected':''}" data-icon="${ic}" data-idx="${idx}">${ic}</button>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function buildScreenshotField(idx, currentSS) {
    const hasSS = currentSS && currentSS.trim();
    return `
      <div class="ss-field-wrap" id="ss-wrap-${idx}">
        <div class="ss-preview-box" id="ss-preview-box-${idx}" style="${hasSS?'':'display:none'}">
          <div class="ss-highlight-badge">★ Highlight</div>
          <img id="ss-preview-img-${idx}" src="${hasSS?currentSS:''}" alt="Screenshot Preview"
            style="width:100%;border-radius:10px;object-fit:cover;max-height:160px;display:block;"/>
          <div class="ss-overlay-actions">
            <button type="button" class="ss-remove-btn" data-idx="${idx}">✕ Hapus</button>
          </div>
        </div>
        <div class="ss-empty-box" id="ss-empty-${idx}" style="${hasSS?'display:none':''}">
          <div class="ss-empty-icon">🖼</div>
          <p>Belum ada screenshot</p>
        </div>
        <div class="ss-upload-row">
          <label class="admin-upload-btn ss-upload-btn" for="ss-file-${idx}">📤 Upload</label>
          <input type="file" id="ss-file-${idx}" accept="image/*" style="display:none"/>
          <button type="button" class="ss-autocap-btn" id="ss-autocap-${idx}" title="Auto capture dari URL demo">🤖 Auto Capture</button>
          <span class="ss-or">atau</span>
          <input class="admin-input ss-url-input" id="p-ss-${idx}" placeholder="Paste URL screenshot..." value="${hasSS?currentSS:''}"/>
        </div>
        <div class="ss-status" id="ss-status-${idx}"></div>
      </div>
    `;
  }

  /* ── RENDER PROJECT ADMIN ── */
  function renderProjAdmin(list) {
    const el=document.getElementById("projectAdminList"); if(!el) return; el.innerHTML="";
    (list||[]).forEach((p,idx)=>{
      const card=document.createElement("div"); card.className="admin-item-card";
      card.innerHTML=`<div class="admin-item-header"><span class="admin-item-icon">${p.icon||getDefaultIcon(p.category||'fullstack')}</span><span class="admin-item-title">${p.title}</span><div class="admin-item-actions"><button class="admin-edit-btn">✏ Edit</button><button class="admin-del-btn">🗑</button></div></div><div class="admin-item-body" style="display:none"><div class="admin-grid-2"><div class="admin-field"><label>Judul</label><input class="admin-input" id="p-title-${idx}" value="${p.title}"/></div><div class="admin-field"><label>Ikon Project</label>${buildIconPicker(idx, p.icon||getDefaultIcon(p.category||'fullstack'), p.category||'fullstack')}</div><div class="admin-field"><label>Kategori</label><select class="admin-input" id="p-cat-${idx}"><option ${p.category==="fullstack"?"selected":""}>fullstack</option><option ${p.category==="frontend"?"selected":""}>frontend</option><option ${p.category==="backend"?"selected":""}>backend</option><option ${p.category==="mobile"?"selected":""}>mobile</option></select></div><div class="admin-field"><label>Tahun</label><input class="admin-input" id="p-year-${idx}" value="${p.year}"/></div><div class="admin-field"><label>Tags (pisah koma)</label><input class="admin-input" id="p-tags-${idx}" value="${(p.tags||[]).join(", ")}"/></div></div><div class="admin-field"><label>📸 Screenshot Project</label>${buildScreenshotField(idx, p.screenshot||'')}</div><div class="admin-grid-2" style="margin-top:.75rem"><div class="admin-field"><label>Link Demo (kosongkan jika tidak ada)</label><input class="admin-input" id="p-demo-${idx}" value="${p.demo==="# "||p.demo==="#"?"":p.demo||""}"/></div><div class="admin-field"><label>Link GitHub</label><input class="admin-input" id="p-gh-${idx}" value="${p.github||""}"/></div></div><div class="admin-bilingual"><div class="admin-field"><label>Deskripsi (Indonesia)</label><textarea class="admin-textarea" id="p-desc-id-${idx}">${p.desc_id||p.desc||""}</textarea></div><div class="admin-field"><label>Description (English) <button class="btn-auto-translate" data-src="p-desc-id-${idx}" data-dst="p-desc-en-${idx}">🔄 Auto</button></label><textarea class="admin-textarea" id="p-desc-en-${idx}">${p.desc_en||""}</textarea></div><div class="admin-field"><label>Fitur (Indonesia, pisah baris)</label><textarea class="admin-textarea" id="p-feat-id-${idx}">${(p.features_id||p.features||[]).join("\n")}</textarea></div><div class="admin-field"><label>Features (English) <button class="btn-auto-translate" data-src="p-feat-id-${idx}" data-dst="p-feat-en-${idx}">🔄 Auto</button></label><textarea class="admin-textarea" id="p-feat-en-${idx}">${(p.features_en||[]).join("\n")}</textarea></div></div><button class="admin-save-btn" data-sp="${idx}">💾 Simpan Project Ini</button></div>`;
      el.appendChild(card);

      /* ── Icon Picker Logic ── */
      const toggleBtn = card.querySelector(`#icon-picker-toggle-${idx}`);
      const dd = card.querySelector(`#icon-picker-dd-${idx}`);
      toggleBtn.addEventListener('click', ()=>{ dd.style.display = dd.style.display==='none'?'block':'none'; });
      card.querySelectorAll(`.icon-opt`).forEach(btn=>{
        btn.addEventListener('click',()=>{
          const ic = btn.dataset.icon;
          card.querySelector(`#p-icon-${idx}`).value = ic;
          card.querySelector(`#icon-picker-preview-${idx}`).textContent = ic;
          card.querySelectorAll('.icon-opt').forEach(b=>b.classList.remove('selected'));
          btn.classList.add('selected');
          dd.style.display = 'none';
        });
      });
      card.querySelectorAll('.icon-tab').forEach(tab=>{
        tab.addEventListener('click',()=>{
          card.querySelectorAll('.icon-tab').forEach(t=>t.classList.remove('active'));
          tab.classList.add('active');
          const cat = tab.dataset.cat;
          const grid = card.querySelector(`#icon-picker-grid-${idx}`);
          const curIcon = card.querySelector(`#p-icon-${idx}`).value;
          const iconsForCat = ICON_SETS[cat]||ICON_SETS.fullstack;
          grid.innerHTML = iconsForCat.map(ic=>`<button type="button" class="icon-opt${ic===curIcon?' selected':''}" data-icon="${ic}" data-idx="${idx}">${ic}</button>`).join('');
          grid.querySelectorAll('.icon-opt').forEach(btn=>{
            btn.addEventListener('click',()=>{
              const ic = btn.dataset.icon;
              card.querySelector(`#p-icon-${idx}`).value = ic;
              card.querySelector(`#icon-picker-preview-${idx}`).textContent = ic;
              grid.querySelectorAll('.icon-opt').forEach(b=>b.classList.remove('selected'));
              btn.classList.add('selected');
              dd.style.display = 'none';
            });
          });
        });
      });
      /* Update icon picker when category changes */
      const catSel = card.querySelector(`#p-cat-${idx}`);
      catSel && catSel.addEventListener('change', ()=>{
        const newCat = catSel.value;
        const curIcon = card.querySelector(`#p-icon-${idx}`).value;
        const grid = card.querySelector(`#icon-picker-grid-${idx}`);
        if(grid){
          const iconsForCat = ICON_SETS[newCat]||ICON_SETS.fullstack;
          grid.innerHTML = iconsForCat.map(ic=>`<button type="button" class="icon-opt${ic===curIcon?' selected':''}" data-icon="${ic}" data-idx="${idx}">${ic}</button>`).join('');
          grid.querySelectorAll('.icon-opt').forEach(btn=>{
            btn.addEventListener('click',()=>{
              const ic = btn.dataset.icon;
              card.querySelector(`#p-icon-${idx}`).value = ic;
              card.querySelector(`#icon-picker-preview-${idx}`).textContent = ic;
              grid.querySelectorAll('.icon-opt').forEach(b=>b.classList.remove('selected'));
              btn.classList.add('selected');
              dd.style.display = 'none';
            });
          });
        }
      });

      /* ── Screenshot Upload Logic ── */
      const ssFileInput = card.querySelector(`#ss-file-${idx}`);
      const ssUrlInput = card.querySelector(`#p-ss-${idx}`);
      const ssPreviewBox = card.querySelector(`#ss-preview-box-${idx}`);
      const ssPreviewImg = card.querySelector(`#ss-preview-img-${idx}`);
      const ssEmptyBox = card.querySelector(`#ss-empty-${idx}`);
      const ssStatus = card.querySelector(`#ss-status-${idx}`);
      function showSSPreview(src){
        ssPreviewImg.src = src;
        ssPreviewBox.style.display = 'block';
        ssEmptyBox.style.display = 'none';
        ssUrlInput.value = src;
      }
      function clearSSPreview(){
        ssPreviewImg.src = '';
        ssPreviewBox.style.display = 'none';
        ssEmptyBox.style.display = '';
        ssUrlInput.value = '';
      }
      ssFileInput && ssFileInput.addEventListener('change', async e=>{
        const file = e.target.files[0]; if(!file) return;
        ssStatus.textContent = '⏳ Memproses...';
        const reader = new FileReader();
        reader.onload = ev => {
          showSSPreview(ev.target.result);
          ssStatus.innerHTML = '<span style="color:#4ade80">✅ Screenshot berhasil diupload!</span>';
          setTimeout(()=>{ ssStatus.textContent=''; },3000);
        };
        reader.readAsDataURL(file);
      });
      ssUrlInput && ssUrlInput.addEventListener('input', e=>{
        const v = e.target.value.trim();
        if(v){ showSSPreview(v); } else { clearSSPreview(); }
      });
      card.querySelector(`.ss-remove-btn`) && card.querySelector(`.ss-remove-btn`).addEventListener('click',()=>{ clearSSPreview(); });
      /* Auto Capture */
      const autoCap = card.querySelector(`#ss-autocap-${idx}`);
      autoCap && autoCap.addEventListener('click', async ()=>{
        const demoUrl = document.getElementById(`p-demo-${idx}`).value.trim();
        if(!demoUrl || demoUrl==='#' || demoUrl===''){
          ssStatus.innerHTML='<span style="color:#f87171">⚠ Isi dulu URL Demo-nya!</span>'; return;
        }
        autoCap.disabled=true; autoCap.textContent='⏳ Capturing...';
        ssStatus.innerHTML='<span style="color:#94a3b8">📡 Mengambil screenshot...</span>';
        const capUrl = `https://api.screenshotone.com/take?url=${encodeURIComponent(demoUrl)}&viewport_width=1280&viewport_height=800&image_quality=85&format=jpg&access_key=public`;
        // Fallback to thum.io which works without API key
        const fallbackUrl = `https://image.thum.io/get/width/1280/crop/800/noanimate/${encodeURIComponent(demoUrl)}`;
        try {
          showSSPreview(fallbackUrl);
          ssStatus.innerHTML='<span style="color:#4ade80">✅ Screenshot berhasil di-capture! (preview dari demo URL)</span>';
        } catch(e) {
          ssStatus.innerHTML='<span style="color:#f87171">❌ Gagal capture. Coba upload manual.</span>';
        }
        setTimeout(()=>{ ssStatus.textContent=''; },4000);
        autoCap.disabled=false; autoCap.textContent='🤖 Auto Capture';
      });

      card.querySelector(".admin-edit-btn").addEventListener("click",()=>{const b=card.querySelector(".admin-item-body");b.style.display=b.style.display==="none"?"block":"none";card.querySelectorAll(".btn-auto-translate").forEach(btn=>{btn.onclick=async()=>{const s=document.getElementById(btn.dataset.src),d=document.getElementById(btn.dataset.dst);if(!s||!d)return;btn.textContent="⏳";btn.disabled=true;d.value=await autoTranslate(s.value,"id","en");btn.textContent="✓";setTimeout(()=>{btn.textContent="🔄 Auto";btn.disabled=false;},1500);};});});
      card.querySelector(".admin-del-btn").addEventListener("click",()=>{if(!confirm(`Hapus "${p.title}"?`))return;const d=load()||buildDefault();d.projects.splice(idx,1);PROJECTS.splice(idx,1);save(d);renderProjAdmin(d.projects);if(typeof renderProjects==="function")renderProjects("all");});
      card.querySelector(`[data-sp="${idx}"]`).addEventListener("click",()=>{const d=load()||buildDefault();const demo=document.getElementById(`p-demo-${idx}`).value.trim();d.projects[idx]={...d.projects[idx],title:document.getElementById(`p-title-${idx}`).value.trim(),icon:document.getElementById(`p-icon-${idx}`).value.trim(),category:document.getElementById(`p-cat-${idx}`).value,year:document.getElementById(`p-year-${idx}`).value.trim(),tags:document.getElementById(`p-tags-${idx}`).value.split(",").map(t=>t.trim()).filter(Boolean),screenshot:document.getElementById(`p-ss-${idx}`).value.trim(),demo:demo||"#",github:document.getElementById(`p-gh-${idx}`).value.trim(),desc_id:document.getElementById(`p-desc-id-${idx}`).value.trim(),desc_en:document.getElementById(`p-desc-en-${idx}`).value.trim(),features_id:document.getElementById(`p-feat-id-${idx}`).value.split("\n").filter(Boolean),features_en:document.getElementById(`p-feat-en-${idx}`).value.split("\n").filter(Boolean)};PROJECTS[idx]=d.projects[idx];save(d);card.querySelector(".admin-item-title").textContent=d.projects[idx].title;card.querySelector(".admin-item-icon").textContent=d.projects[idx].icon;if(typeof renderProjects==="function")renderProjects("all");showSaved();});
    });
  }

  /* ── RENDER STACK ADMIN ── */
  const STACK_CATS = ["Frontend","Backend","Database","DevOps","Design","Mobile","Cloud"];
  const CAT_COLORS = {Frontend:"#61DAFB",Backend:"#68A063",Database:"#336791",Mobile:"#7F52FF",DevOps:"#F05032",Cloud:"#FF9900",Design:"#F24E1E"};

  /* Preset SVG logos for popular tools */
  const PRESET_SVGS = {
    "React":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="3.5" fill="#61DAFB"/><ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="#61DAFB" stroke-width="1.8"/><ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="#61DAFB" stroke-width="1.8" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="#61DAFB" stroke-width="1.8" transform="rotate(120 20 20)"/></svg>`,
    "Vue.js":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,6 34,6 20,30 6,6" fill="none" stroke="#42B883" stroke-width="2.5"/><polygon points="20,12 29,12 20,26 11,12" fill="#42B883"/></svg>`,
    "Next.js":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="19" fill="#000"/><path d="M14 28V13l14 17.5c-2 1-4.2 1.5-6.5 1.5A13.5 13.5 0 0 1 14 28z" fill="url(#ng2)"/><path d="M26.5 27V13" stroke="white" stroke-width="2.5" stroke-linecap="round"/><defs><linearGradient id="ng2" x1="20" y1="13" x2="28" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs></svg>`,
    "TypeScript":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="5" fill="#3178C6"/><text x="5" y="28" font-size="18" font-weight="900" fill="white" font-family="Arial">TS</text></svg>`,
    "Tailwind CSS":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M10 18c1.5-6 5.5-8 8-5-1.5 6-5.5 8-8 5zm12 4c1.5-6 5.5-8 8-5-1.5 6-5.5 8-8 5z" fill="#38BDF8"/></svg>`,
    "HTML5":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M5 3l3 34 12 3 12-3 3-34z" fill="#E34F26"/><path d="M20 7v27l10-2.8L32.5 7z" fill="#EF652A"/><path d="M14 13h12l-.5 5H14.5l.3 4h9.7l-.7 7-3.8 1-3.8-1-.2-3H12l.5 6 7.5 2 7.5-2 1-11H13.5z" fill="white"/></svg>`,
    "CSS3":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M5 3l3 34 12 3 12-3 3-34z" fill="#1572B6"/><path d="M20 7v27l10-2.8L32.5 7z" fill="#33A9DC"/><path d="M14 13h12l-.3 4H14.3l.3 4h11l-.8 8-4.8 1.3-4.8-1.3-.3-3h-4l.5 6 8.6 2.4 8.6-2.4 1.2-12H13.5z" fill="white"/></svg>`,
    "Node.js":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 3L5 11.5v17L20 37l15-8.5v-17z" fill="#5FA04E"/><text x="11" y="27" font-size="11" font-weight="900" fill="white" font-family="Arial">JS</text></svg>`,
    "Laravel":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M38 8.5c0 .8-2.5 5.5-6 11L26 28l-6-1-8-10 2-8 8-5 10 1 6 3.5z" fill="#FF2D20"/><path d="M20 5l8 4.5-3 13.5-5 3-5-3-3-13.5z" fill="#FFFFFF" opacity="0.2"/></svg>`,
    "PHP":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="20" rx="19" ry="11" fill="#8892BF"/><text x="7" y="25" font-size="13" font-weight="900" fill="white" font-family="Arial">php</text></svg>`,
    "Express.js":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#1a1a1a"/><text x="4" y="26" font-size="11" font-weight="700" fill="white" font-family="Arial">expres</text></svg>`,
    "Python":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 3c-7 0-8 3-8 3v4h8v2H9s-5 .5-5 9 4.5 9 4.5 9H12v-4.5s-.2-4.5 4.5-4.5H27s4 .2 4-4V9s.5-6-11-6z" fill="#3776AB"/><path d="M20 37c7 0 8-3 8-3v-4H20v-2h11s5-.5 5-9-4.5-9-4.5-9H28v4.5s.2 4.5-4.5 4.5H13s-4-.2-4 4v7s-.5 6 11 6z" fill="#FFD43B"/></svg>`,
    "PostgreSQL":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="17" fill="#336791"/><path d="M15 13h6c3 0 5 1.5 5 4s-2 4-5 4h-3v6h-3z" fill="white"/><path d="M18 17h3c1.5 0 2-.7 2-1.5S22.5 14 21 14h-3z" fill="#336791"/></svg>`,
    "MySQL":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 4C11 4 5 8 5 14v12c0 6 6 10 15 10s15-4 15-10V14c0-6-6-10-15-10z" fill="#00758F"/><path d="M5 14c0 6 6 9 15 9s15-3 15-9" fill="none" stroke="#F29111" stroke-width="2"/><text x="10" y="25" font-size="9" fill="white" font-family="Arial" font-weight="bold">MySQL</text></svg>`,
    "MongoDB":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 3c-1 8-9 11-9 18 0 5 4 9 9 9s9-4 9-9c0-7-8-10-9-18z" fill="#47A248"/><rect x="19" y="27" width="2" height="8" fill="#47A248"/></svg>`,
    "Redis":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="28" rx="15" ry="5" fill="#A41E11"/><ellipse cx="20" cy="20" rx="15" ry="5" fill="#D82C20"/><ellipse cx="20" cy="14" rx="15" ry="5" fill="#FF5252"/></svg>`,
    "Docker":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M6 20c0-3 2-5 5-5h18c3 0 5 2 5 5" fill="none" stroke="#2496ED" stroke-width="2.5"/><rect x="11" y="13" width="4" height="4" rx="1" fill="#2496ED"/><rect x="17" y="13" width="4" height="4" rx="1" fill="#2496ED"/><rect x="23" y="13" width="4" height="4" rx="1" fill="#2496ED"/><rect x="17" y="8" width="4" height="4" rx="1" fill="#2496ED"/></svg>`,
    "Git":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" fill="none" stroke="#F05032" stroke-width="2.5"/><circle cx="28" cy="12" r="4" fill="none" stroke="#F05032" stroke-width="2.5"/><circle cx="12" cy="28" r="4" fill="none" stroke="#F05032" stroke-width="2.5"/><path d="M16 12h8M12 16v8M16 12l0 12" fill="none" stroke="#F05032" stroke-width="2"/></svg>`,
    "Figma":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="4" width="8" height="8" rx="4" fill="#F24E1E"/><rect x="20" y="4" width="8" height="8" rx="4" fill="#FF7262"/><rect x="12" y="20" width="8" height="8" rx="4" fill="#A259FF"/><rect x="12" y="28" width="8" height="8" rx="4" fill="#0ACF83"/><rect x="12" y="12" width="8" height="8" rx="0" fill="#1ABCFE"/><circle cx="24" cy="16" r="4" fill="#1ABCFE"/></svg>`,
    "React Native":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="3" fill="#61DAFB"/><ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke="#61DAFB" stroke-width="1.8"/><ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke="#61DAFB" stroke-width="1.8" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke="#61DAFB" stroke-width="1.8" transform="rotate(120 20 20)"/></svg>`,
    "Flutter":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,5 35,20 27,20 12,35" fill="#54C5F8" opacity="0.7"/><polygon points="12,35 27,20 35,28 20,35" fill="#01579B"/><polygon points="20,5 35,20 27,20" fill="#54C5F8"/></svg>`,
    "AWS":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M8 22l5 5 5-5-5-5z" fill="#FF9900"/><path d="M32 22l-5 5-5-5 5-5z" fill="#FF9900"/><path d="M10 14h20l2 4H8z" fill="#FF9900" opacity="0.7"/><text x="11" y="34" font-size="8" fill="#FF9900" font-family="Arial" font-weight="bold">AWS</text></svg>`,
    "GraphQL":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,4 35,13 35,27 20,36 5,27 5,13" fill="none" stroke="#E535AB" stroke-width="2"/><circle cx="20" cy="4" r="3" fill="#E535AB"/><circle cx="35" cy="13" r="3" fill="#E535AB"/><circle cx="35" cy="27" r="3" fill="#E535AB"/><circle cx="20" cy="36" r="3" fill="#E535AB"/><circle cx="5" cy="27" r="3" fill="#E535AB"/><circle cx="5" cy="13" r="3" fill="#E535AB"/><circle cx="20" cy="20" r="4" fill="#E535AB"/></svg>`,
    "Linux":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 4c-4 0-8 4-8 10 0 3 1 6 2 8-2 2-3 4-3 5 0 2 3 3 5 3 1 2 2 4 4 4s3-2 4-4c2 0 5-1 5-3 0-1-1-3-3-5 1-2 2-5 2-8 0-6-4-10-8-10z" fill="#FFD33D"/><circle cx="16" cy="16" r="2" fill="#333"/><circle cx="24" cy="16" r="2" fill="#333"/><path d="M16 24c1 1 3 2 4 2s3-1 4-2" fill="none" stroke="#333" stroke-width="1.5"/></svg>`,
    "Supabase":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sb" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse"><stop stop-color="#3ECF8E"/><stop offset="1" stop-color="#1C7A4A"/></linearGradient></defs><path d="M8 30l14-26 5 13-8 13z" fill="url(#sb)"/><path d="M32 10L18 36l-5-13 8-13z" fill="url(#sb)" opacity="0.7"/></svg>`,
    "Prisma":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 4L34 32 20 28 6 32z" fill="none" stroke="#5A67D8" stroke-width="2"/><line x1="20" y1="4" x2="20" y2="28" stroke="#5A67D8" stroke-width="2"/></svg>`,
    "Vite":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="vg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#BD34FE"/><stop offset="1" stop-color="#47CAFF"/></linearGradient></defs><polygon points="20,4 38,8 34,28 20,36 6,28 2,8" fill="none" stroke="url(#vg)" stroke-width="2"/><polygon points="20,10 30,13 28,26 20,30 12,26 10,13" fill="url(#vg)" opacity="0.3"/></svg>`,
    "Kotlin":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="kg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7F52FF"/><stop offset="1" stop-color="#E44857"/></linearGradient></defs><polygon points="5,5 22,5 5,22" fill="url(#kg)"/><polygon points="5,22 22,5 35,35 5,35" fill="url(#kg)" opacity="0.8"/></svg>`,
    "Swift":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="swg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FF5733"/><stop offset="1" stop-color="#FF2D55"/></linearGradient></defs><rect width="40" height="40" rx="9" fill="url(#swg)"/><path d="M31 14c-4-4-12-5-17 0-3 3-4 8-2 12-1-3 0-6 2-8 5 4 11 4 15 0l-2 2c4-1 5-4 4-6z" fill="white"/></svg>`,
    "Redux":`<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M26 8c4 1 7 5 6 9-1 3-3 5-6 6" fill="none" stroke="#764ABC" stroke-width="2.5" stroke-linecap="round"/><path d="M24 28c-1 3-4 5-7 4-3-.7-5-3-5-6" fill="none" stroke="#764ABC" stroke-width="2.5" stroke-linecap="round"/><path d="M10 16c-2-4 0-8 4-9 3-1 6 0 8 3" fill="none" stroke="#764ABC" stroke-width="2.5" stroke-linecap="round"/><circle cx="26" cy="8" r="3" fill="#764ABC"/><circle cx="24" cy="32" r="3" fill="#764ABC"/><circle cx="8" cy="18" r="3" fill="#764ABC"/></svg>`
  };

  let _stackAdminFilter = "all";

  function renderStackAdmin(list) {
    const el = document.getElementById("stackAdminList"); if(!el) return;
    el.innerHTML = "";

    /* filter buttons */
    const filterWrap = document.getElementById("stackAdminFilter");
    if(filterWrap){
      filterWrap.querySelectorAll(".stack-admin-filter-btn").forEach(btn=>{
        btn.classList.toggle("active", btn.dataset.cat===_stackAdminFilter);
        btn.onclick = ()=>{
          _stackAdminFilter = btn.dataset.cat;
          renderStackAdmin(STACK||[]);
        };
      });
    }

    const filtered = _stackAdminFilter==="all" ? list : list.filter(s=>s.category===_stackAdminFilter);

    if(filtered.length===0){
      el.innerHTML=`<div style="text-align:center;padding:2rem;color:var(--text3,#666)">Belum ada tool di kategori ini.</div>`;
    }

    filtered.forEach((s,_i)=>{
      const idx = list.indexOf(s); /* real index in STACK */
      const catColor = CAT_COLORS[s.category]||"#c9a84c";
      const card = document.createElement("div"); card.className="admin-item-card stack-admin-card";
      card.innerHTML=`
        <div class="admin-item-header">
          <span class="stack-admin-logo-preview" id="slp-${idx}">${s.svg||`<span style="font-size:1.5rem">🔧</span>`}</span>
          <span class="admin-item-title">${s.name}</span>
          <span class="stack-admin-cat-badge" style="background:${catColor}22;color:${catColor};border:1px solid ${catColor}55">${s.category}</span>
          <div class="admin-item-actions"><button class="admin-edit-btn">✏ Edit</button><button class="admin-del-btn">🗑</button></div>
        </div>
        <div class="admin-item-body" style="display:none">
          <div class="admin-grid-2">
            <div class="admin-field"><label>Nama Tool</label><input class="admin-input" id="st-name-${idx}" value="${s.name}"/></div>
            <div class="admin-field"><label>Kategori</label>
              <select class="admin-input" id="st-cat-${idx}">
                ${STACK_CATS.map(c=>`<option value="${c}" ${s.category===c?"selected":""}>${c}</option>`).join("")}
              </select>
            </div>
            <div class="admin-field"><label>Warna (hex)</label>
              <div style="display:flex;gap:.5rem;align-items:center">
                <input type="color" id="st-color-picker-${idx}" value="${s.color||"#6366f1"}" style="width:40px;height:32px;border:none;background:none;cursor:pointer;padding:0"/>
                <input class="admin-input" id="st-color-${idx}" value="${s.color||"#6366f1"}" placeholder="#RRGGBB" style="flex:1"/>
              </div>
            </div>
            <div class="admin-field"><label>Tahun Rilis</label><input class="admin-input" id="st-year-${idx}" value="${s.year||""}"/></div>
            <div class="admin-field"><label>Pembuat / Creator</label><input class="admin-input" id="st-creator-${idx}" value="${s.creator||""}"/></div>
            <div class="admin-field"><label>Tagline</label><input class="admin-input" id="st-tagline-${idx}" value="${s.tagline||""}"/></div>
          </div>
          <div class="admin-field" style="margin-top:.75rem"><label>Deskripsi</label><textarea class="admin-textarea" id="st-desc-${idx}">${s.desc||""}</textarea></div>
          <div class="admin-field"><label>Usage / Penggunaan</label><textarea class="admin-textarea" id="st-usage-${idx}">${s.usage||""}</textarea></div>
          <div class="admin-field" style="margin-top:.75rem">
            <label>SVG Logo <span style="font-size:.75rem;color:var(--text3,#666);font-weight:400">— paste kode SVG di bawah, atau pilih preset:</span></label>
            <div class="stack-preset-row" id="st-presets-${idx}">
              ${Object.keys(PRESET_SVGS).map(n=>`<button type="button" class="stack-preset-btn" title="${n}" data-preset="${n}" data-idx="${idx}"><span class="preset-svg-wrap">${PRESET_SVGS[n]}</span></button>`).join("")}
            </div>
            <div class="stack-svg-row">
              <div class="stack-svg-live-preview" id="st-live-${idx}">${s.svg||"<span style='color:#666;font-size:.75rem'>Preview SVG</span>"}</div>
              <textarea class="admin-textarea stack-svg-input" id="st-svg-${idx}" placeholder='<svg viewBox="0 0 40 40" ...>...</svg>'>${(s.svg||"").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</textarea>
            </div>
          </div>
          <button class="admin-save-btn" data-sst="${idx}">💾 Simpan Tool Ini</button>
        </div>`;
      el.appendChild(card);

      /* edit toggle */
      card.querySelector(".admin-edit-btn").addEventListener("click",()=>{
        const b=card.querySelector(".admin-item-body");
        b.style.display=b.style.display==="none"?"block":"none";
      });

      /* delete */
      card.querySelector(".admin-del-btn").addEventListener("click",()=>{
        if(!confirm(`Hapus "${s.name}"?`)) return;
        STACK.splice(idx,1);
        const d=load()||buildDefault(); d.stack=STACK; save(d);
        renderStackAdmin(STACK);
        if(typeof renderStack==="function") renderStack("all");
      });

      /* color picker sync */
      const colorPicker=card.querySelector(`#st-color-picker-${idx}`);
      const colorInput=card.querySelector(`#st-color-${idx}`);
      colorPicker.addEventListener("input",e=>{ colorInput.value=e.target.value; });
      colorInput.addEventListener("input",e=>{ colorPicker.value=e.target.value.length===7?e.target.value:colorPicker.value; });

      /* SVG live preview */
      const svgTA=card.querySelector(`#st-svg-${idx}`);
      const liveP=card.querySelector(`#st-live-${idx}`);
      svgTA.addEventListener("input",()=>{
        const raw=svgTA.value.trim().replace(/&lt;/g,"<").replace(/&gt;/g,">");
        liveP.innerHTML=raw||"<span style='color:#666;font-size:.75rem'>Preview SVG</span>";
      });

      /* preset buttons */
      card.querySelectorAll(".stack-preset-btn").forEach(btn=>{
        btn.addEventListener("click",()=>{
          const svg=PRESET_SVGS[btn.dataset.preset];
          const escaped=svg.replace(/</g,"&lt;").replace(/>/g,"&gt;");
          svgTA.value=escaped;
          liveP.innerHTML=svg;
          card.querySelector(`#slp-${idx}`).innerHTML=svg;
          card.querySelectorAll(".stack-preset-btn").forEach(b=>b.classList.remove("selected"));
          btn.classList.add("selected");
        });
      });

      /* save */
      card.querySelector(`[data-sst="${idx}"]`).addEventListener("click",()=>{
        const svgRaw=svgTA.value.trim().replace(/&lt;/g,"<").replace(/&gt;/g,">");
        STACK[idx]={
          ...STACK[idx],
          name:document.getElementById(`st-name-${idx}`).value.trim(),
          category:document.getElementById(`st-cat-${idx}`).value,
          color:document.getElementById(`st-color-${idx}`).value.trim()||"#6366f1",
          year:document.getElementById(`st-year-${idx}`).value.trim(),
          creator:document.getElementById(`st-creator-${idx}`).value.trim(),
          tagline:document.getElementById(`st-tagline-${idx}`).value.trim(),
          desc:document.getElementById(`st-desc-${idx}`).value.trim(),
          usage:document.getElementById(`st-usage-${idx}`).value.trim(),
          svg:svgRaw
        };
        const d=load()||buildDefault(); d.stack=STACK; save(d);
        card.querySelector(".admin-item-title").textContent=STACK[idx].name;
        card.querySelector(`#slp-${idx}`).innerHTML=svgRaw||"<span>🔧</span>";
        const catC=CAT_COLORS[STACK[idx].category]||"#c9a84c";
        card.querySelector(".stack-admin-cat-badge").textContent=STACK[idx].category;
        card.querySelector(".stack-admin-cat-badge").style.cssText=`background:${catC}22;color:${catC};border:1px solid ${catC}55`;
        if(typeof renderStack==="function") renderStack("all");
        showSaved();
      });
    });
  }

  /* ── ADD STACK BUTTON ── */
  /* (wired up after panel mount, in the event section below) */

  /* ── RENDER CERT ADMIN ── */
  function renderCertAdmin(list) {
    const el=document.getElementById("certAdminList"); if(!el) return; el.innerHTML="";
    (list||[]).forEach((c,idx)=>{
      const card=document.createElement("div"); card.className="admin-item-card";
      card.innerHTML=`<div class="admin-item-header"><span class="admin-item-icon">${c.icon||"🏆"}</span><span class="admin-item-title">${c.name}</span><div class="admin-item-actions"><button class="admin-edit-btn">✏ Edit</button><button class="admin-del-btn">🗑</button></div></div><div class="admin-item-body" style="display:none"><div class="admin-grid-2"><div class="admin-field"><label>Nama Sertifikat</label><input class="admin-input" id="c-name-${idx}" value="${c.name}"/></div><div class="admin-field"><label>Ikon (emoji)</label><input class="admin-input" id="c-icon-${idx}" value="${c.icon||"🏆"}"/></div><div class="admin-field"><label>Penerbit</label><input class="admin-input" id="c-issuer-${idx}" value="${c.issuer}"/></div><div class="admin-field"><label>Tanggal (YYYY-MM)</label><input class="admin-input" type="month" id="c-date-${idx}" value="${c.date||""}"/></div><div class="admin-field"><label>Credential ID</label><input class="admin-input" id="c-credid-${idx}" value="${c.credId||""}"/></div><div class="admin-field"><label>Link Demo/Sertifikat (opsional)</label><input class="admin-input" id="c-demo-${idx}" value="${c.demoUrl||""}"/></div></div><div class="admin-field" style="margin-bottom:1rem"><label>URL Foto/Gambar Sertifikat (opsional)</label><input class="admin-input" id="c-img-${idx}" value="${c.imageUrl||""}"/></div><div class="admin-field" style="margin-bottom:1rem"><label>Atau Upload Gambar Sertifikat</label><input type="file" id="c-img-file-${idx}" accept="image/*" class="admin-input" style="padding:.4rem;"/></div><div class="admin-field"><label>Deskripsi</label><textarea class="admin-textarea" id="c-desc-${idx}">${c.desc||""}</textarea></div><button class="admin-save-btn" data-sc="${idx}">💾 Simpan Sertifikat Ini</button></div>`;
      el.appendChild(card);
      card.querySelector(".admin-edit-btn").addEventListener("click",()=>{const b=card.querySelector(".admin-item-body");b.style.display=b.style.display==="none"?"block":"none";});
      card.querySelector(".admin-del-btn").addEventListener("click",()=>{if(!confirm(`Hapus "${c.name}"?`))return;const d=load()||buildDefault();d.certificates.splice(idx,1);CERTIFICATES.splice(idx,1);save(d);renderCertAdmin(d.certificates);if(typeof renderCerts==="function")renderCerts();});
      card.querySelector(`[data-sc="${idx}"]`).addEventListener("click",async()=>{
        const d=load()||buildDefault();
        let imgUrl=document.getElementById(`c-img-${idx}`).value.trim();
        const fileInput=document.getElementById(`c-img-file-${idx}`);
        if(fileInput.files[0]){
          if(fileInput.files[0].size>1024*1024){alert("Gambar maks 1MB");return;}
          imgUrl=await fileToBase64(fileInput.files[0]);
        }
        d.certificates[idx]={...d.certificates[idx],name:document.getElementById(`c-name-${idx}`).value.trim(),icon:document.getElementById(`c-icon-${idx}`).value.trim(),issuer:document.getElementById(`c-issuer-${idx}`).value.trim(),date:document.getElementById(`c-date-${idx}`).value,credId:document.getElementById(`c-credid-${idx}`).value.trim(),demoUrl:document.getElementById(`c-demo-${idx}`).value.trim(),imageUrl:imgUrl,desc:document.getElementById(`c-desc-${idx}`).value.trim()};
        CERTIFICATES[idx]=d.certificates[idx];save(d);
        card.querySelector(".admin-item-title").textContent=d.certificates[idx].name;
        card.querySelector(".admin-item-icon").textContent=d.certificates[idx].icon;
        if(typeof renderCerts==="function")renderCerts();showSaved();
      });
    });
  }

  /* ── RENDER TIMELINE ADMIN ── */
  function renderTlAdmin(list) {
    const el=document.getElementById("timelineAdminList"); if(!el) return; el.innerHTML="";
    (list||[]).forEach((item,idx)=>{
      const card=document.createElement("div"); card.className="admin-item-card";
      card.innerHTML=`<div class="admin-item-header"><span class="admin-item-icon">${item.type==="work"?"💼":"🎓"}</span><span class="admin-item-title">${item.role} — ${item.company}</span><div class="admin-item-actions"><button class="admin-edit-btn">✏ Edit</button><button class="admin-del-btn">🗑</button></div></div><div class="admin-item-body" style="display:none"><div class="admin-grid-2"><div class="admin-field"><label>Tipe</label><select class="admin-input" id="tl-type-${idx}"><option value="work" ${item.type==="work"?"selected":""}>💼 Pekerjaan</option><option value="education" ${item.type==="education"?"selected":""}>🎓 Pendidikan</option></select></div><div class="admin-field"><label>Periode</label><input class="admin-input" id="tl-date-${idx}" value="${item.date}"/></div><div class="admin-field"><label>Posisi / Gelar</label><input class="admin-input" id="tl-role-${idx}" value="${item.role}"/></div><div class="admin-field"><label>Perusahaan / Institusi</label><input class="admin-input" id="tl-co-${idx}" value="${item.company}"/></div></div><div class="admin-field"><label>Deskripsi</label><textarea class="admin-textarea" id="tl-desc-${idx}">${item.desc}</textarea></div><button class="admin-save-btn" data-stl="${idx}">💾 Simpan</button></div>`;
      el.appendChild(card);
      card.querySelector(".admin-edit-btn").addEventListener("click",()=>{const b=card.querySelector(".admin-item-body");b.style.display=b.style.display==="none"?"block":"none";});
      card.querySelector(".admin-del-btn").addEventListener("click",()=>{if(!confirm("Hapus item ini?"))return;const d=load()||buildDefault();d.timeline.splice(idx,1);TIMELINE.splice(idx,1);save(d);renderTlAdmin(d.timeline);if(typeof renderTimeline==="function")renderTimeline();});
      card.querySelector(`[data-stl="${idx}"]`).addEventListener("click",()=>{const d=load()||buildDefault();d.timeline[idx]={type:document.getElementById(`tl-type-${idx}`).value,date:document.getElementById(`tl-date-${idx}`).value.trim(),role:document.getElementById(`tl-role-${idx}`).value.trim(),company:document.getElementById(`tl-co-${idx}`).value.trim(),desc:document.getElementById(`tl-desc-${idx}`).value.trim()};TIMELINE[idx]=d.timeline[idx];save(d);card.querySelector(".admin-item-title").textContent=`${d.timeline[idx].role} — ${d.timeline[idx].company}`;if(typeof renderTimeline==="function")renderTimeline();showSaved();});
    });
  }

  /* ── RENDER TESTI ADMIN ── */
  function renderTestiAdmin(list) {
    const el=document.getElementById("testiAdminList"); if(!el) return; el.innerHTML="";
    (list||[]).forEach((t,idx)=>{
      const card=document.createElement("div"); card.className="admin-item-card";
      card.innerHTML=`<div class="admin-item-header"><span class="admin-item-icon">💬</span><span class="admin-item-title">${t.name} — ${t.role}</span><div class="admin-item-actions"><button class="admin-edit-btn">✏ Edit</button><button class="admin-del-btn">🗑</button></div></div><div class="admin-item-body" style="display:none"><div class="admin-grid-2"><div class="admin-field"><label>Nama</label><input class="admin-input" id="tt-name-${idx}" value="${t.name}"/></div><div class="admin-field"><label>Jabatan, Perusahaan</label><input class="admin-input" id="tt-role-${idx}" value="${t.role}"/></div><div class="admin-field"><label>Inisial (2 huruf)</label><input class="admin-input" id="tt-init-${idx}" value="${t.initials}"/></div></div><div class="admin-field"><label>Teks Testimoni</label><textarea class="admin-textarea" id="tt-text-${idx}">${t.text}</textarea></div><button class="admin-save-btn" data-stt="${idx}">💾 Simpan</button></div>`;
      el.appendChild(card);
      card.querySelector(".admin-edit-btn").addEventListener("click",()=>{const b=card.querySelector(".admin-item-body");b.style.display=b.style.display==="none"?"block":"none";});
      card.querySelector(".admin-del-btn").addEventListener("click",()=>{if(!confirm("Hapus testimoni ini?"))return;const d=load()||buildDefault();d.testimonials.splice(idx,1);TESTIMONIALS.splice(idx,1);save(d);renderTestiAdmin(d.testimonials);if(typeof renderTestimonials==="function")renderTestimonials();});
      card.querySelector(`[data-stt="${idx}"]`).addEventListener("click",()=>{const d=load()||buildDefault();d.testimonials[idx]={name:document.getElementById(`tt-name-${idx}`).value.trim(),role:document.getElementById(`tt-role-${idx}`).value.trim(),initials:document.getElementById(`tt-init-${idx}`).value.trim(),text:document.getElementById(`tt-text-${idx}`).value.trim()};TESTIMONIALS[idx]=d.testimonials[idx];save(d);card.querySelector(".admin-item-title").textContent=`${d.testimonials[idx].name} — ${d.testimonials[idx].role}`;if(typeof renderTestimonials==="function")renderTestimonials();showSaved();});
    });
  }

  /* ── SAVED BADGE ── */
  function showSaved() {
    const b=document.getElementById("adminSavedBadge"); if(!b) return;
    b.style.display="flex"; setTimeout(()=>{b.style.display="none";},2500);
  }

  /* ── LOAD MEDIA FROM STORAGE ── */
  function loadMediaFromStorage() {
    const d=load(); if(!d?.media) return;
    if(d.media.photo) {
      const el=document.getElementById("profilePhoto"); if(el) el.src=d.media.photo;
    }
    if(d.media.logo) {
      const logoStyles={navLogoImg:"display:block;height:34px;width:auto;max-width:120px;object-fit:contain;object-position:left center;",footerLogoImg:"display:block;height:30px;width:auto;max-width:100px;object-fit:contain;object-position:left center;",loaderLogoImg:"display:block;width:auto;height:80px;max-width:200px;object-fit:contain;object-position:center;margin:0 auto;"};
      Object.keys(logoStyles).forEach(id=>{const el=document.getElementById(id);if(el){el.src=d.media.logo;el.style.cssText=logoStyles[id];}});
      ["navLogoText","footerLogoText","loaderLogoText"].forEach(id=>{const el=document.getElementById(id);if(el) el.style.display="none";});
      // Mobile menu logo
      const mobLogo=document.getElementById("mobileMenuLogo");
      if(mobLogo){mobLogo.innerHTML=`<img src="${d.media.logo}" style="height:50px;width:auto;max-width:150px;object-fit:contain;" alt="Logo">`;} 
    }
  }

  /* ── PUBLIC API ── */
  return {
    init() {
      initData();
      initPhotoClick();
      loadMediaFromStorage();

      // Lang toggle button
      const navRight=document.querySelector(".nav-right");
      if(navRight&&!document.getElementById("langToggleBtn")){
        const btn=document.createElement("button");
        btn.id="langToggleBtn"; btn.className="theme-btn";
        btn.textContent=getLang()==="id"?"🇬🇧 EN":"🇮🇩 ID";
        btn.title="Switch Language";
        btn.addEventListener("click",()=>{
          const next=getLang()==="id"?"en":"id";
          setLangStore(next); applyLang(next);
          btn.textContent=next==="id"?"🇬🇧 EN":"🇮🇩 ID";
        });
        navRight.insertBefore(btn,document.getElementById("themeBtn"));
      }

      setTimeout(()=>applyLang(getLang()), 350);
    },
    getLang,
    setLang(l){ setLangStore(l); applyLang(l); },
    applyLang,
    loadData: load,
    autoTranslate,
  };
})();
