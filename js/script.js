/* =========================================================
   Portofolio — Narendra Wisnu Mahaputra
   JavaScript murni (DOM) — tanpa library
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     1. DATA SKILL
     Ubah / tambah skill cukup di array ini, kartu otomatis dibuat.
     --------------------------------------------------------- */
  const skillData = [
    {
      id: "languages",
      title: "Bahasa Pemrograman",
      icon: "</>",
      items: [
        { name: "Python", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "PHP", level: 80 },
        { name: "C#", level: 75 }
      ]
    },
    {
      id: "frameworks",
      title: "Framework",
      icon: "{ }",
      items: [
        { name: "Laravel", level: 95 },
        { name: "Flutter", level: 80 },
        { name: "Flask", level: 75 }
      ]
    },
    {
      id: "database",
      title: "Database",
      icon: "DB",
      items: [
        { name: "MySQL", level: 85 },
        { name: "PostgreSQL", level: 80 }
      ]
    },
    {
      id: "tools",
      title: "Tools",
      icon: "⚙",
      items: [
        { name: "VS Code", level: 95 },
        { name: "Jupyter", level: 85 },
        { name: "Figma", level: 70 },
        { name: "Canva", level: 75 },
        { name: "MS Office", level: 90 },
        { name: "Google Workspace", level: 85 }
      ]
    }
  ];

  /* ---------------------------------------------------------
     2. RENDER KARTU SKILL KE DOM
     --------------------------------------------------------- */
  const skillGrid = document.getElementById("skillGrid");

  skillData.forEach((category) => {
    const card = document.createElement("article");
    card.className = "skill-card reveal";
    card.dataset.category = category.id;
    card.setAttribute("aria-labelledby", `skill-${category.id}`);

    const head = document.createElement("header");
    head.className = "skill-card-head";
    head.innerHTML = `
      <span class="skill-card-icon" aria-hidden="true"></span>
      <h3 id="skill-${category.id}"></h3>
    `;
    head.querySelector(".skill-card-icon").textContent = category.icon;
    head.querySelector("h3").textContent = category.title;

    if (category.isNew) {
      const badge = document.createElement("span");
      badge.className = "skill-card-new";
      badge.textContent = "BARU";
      head.appendChild(badge);
    }

    const list = document.createElement("ul");
    list.className = "skill-list";

    category.items.forEach((skill) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="skill-row"><span></span><span></span></div>
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100">
          <div class="bar-fill"></div>
        </div>
      `;
      li.querySelector(".skill-row span:first-child").textContent = skill.name;
      li.querySelector(".skill-row span:last-child").textContent = `${skill.level}%`;
      const bar = li.querySelector(".bar");
      bar.setAttribute("aria-valuenow", skill.level);
      bar.setAttribute("aria-label", `${skill.name} ${skill.level}%`);
      li.querySelector(".bar-fill").dataset.level = skill.level;
      list.appendChild(li);
    });

    card.append(head, list);
    skillGrid.appendChild(card);
  });

  // total teknologi untuk counter di About
  const totalSkills = skillData.reduce((sum, c) => sum + c.items.length, 0);
  document.getElementById("skillCount").dataset.target = totalSkills;

  /* ---------------------------------------------------------
     3. FILTER KATEGORI SKILL
     --------------------------------------------------------- */
  const chips = document.querySelectorAll(".chip");
  const skillCards = document.querySelectorAll(".skill-card");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.dataset.filter;
      skillCards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
        if (match) {
          card.classList.add("visible");
          fillBars(card);
        }
      });
    });
  });

  function fillBars(scope) {
    scope.querySelectorAll(".bar-fill").forEach((bar) => {
      bar.style.width = `${bar.dataset.level}%`;
    });
  }

  /* ---------------------------------------------------------
     4. NAVBAR: hamburger, header saat scroll, link aktif
     --------------------------------------------------------- */
  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    navToggle.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }

  navToggle.addEventListener("click", () => {
    setMenu(!navMenu.classList.contains("open"));
  });

  // tutup menu ketika link diklik (mobile)
  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  // tutup menu dengan tombol Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // tandai link aktif sesuai section yang sedang terlihat
  const sections = document.querySelectorAll("main section[id]");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((sec) => sectionObserver.observe(sec));

  /* ---------------------------------------------------------
     5. SCROLL: header blur + tombol back-to-top
     --------------------------------------------------------- */
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 30);
    toTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------------------------------------------------
     6. EFEK MENGETIK di Hero
     --------------------------------------------------------- */
  const typedEl = document.getElementById("typedText");
  const roles = [
    "Mahasiswa Teknologi Informasi",
    "Web Developer",
    "Pengelola Database (MySQL · PostgreSQL)",
    "Haus Belajar & Berbagi Ilmu",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    typedEl.textContent = current.slice(0, charIndex);

    let delay = deleting ? 40 : 80;

    if (!deleting && charIndex === current.length) {
      delay = 1800;           // berhenti sebentar setelah selesai mengetik
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    setTimeout(typeLoop, delay);
  }
  typeLoop();

  /* ---------------------------------------------------------
     7. COUNTER ANGKA di About
     --------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------
     8. REVEAL saat scroll (+ jalankan counter & skill bar)
     --------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");

      const counter = el.querySelector(".stat-num");
      if (counter) animateCounter(counter);

      if (el.classList.contains("skill-card")) fillBars(el);

      observer.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------
     9. FOTO PROFIL: kalau belum ada, tampilkan inisial
     --------------------------------------------------------- */
  const profileImg = document.getElementById("profileImg");
  function hideBrokenImg() { profileImg.remove(); }
  profileImg.addEventListener("error", hideBrokenImg);
  if (profileImg.complete && profileImg.naturalWidth === 0) hideBrokenImg();

  /* ---------------------------------------------------------
     10. MUSIC PLAYER (Now Playing)
     File lagu: assets/2112.mp3
     --------------------------------------------------------- */
  const player = document.getElementById("player");
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("playBtn");
  const seek = document.getElementById("seek");
  const curTimeEl = document.getElementById("curTime");
  const durTimeEl = document.getElementById("durTime");
  const playerStatus = document.getElementById("playerStatus");
  let isSeeking = false;

  // ubah detik → "m:ss"
  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function setProgress(percent) {
    seek.value = percent;
    seek.style.setProperty("--progress", `${percent}%`);
  }

  const heroVisual = document.getElementById("heroVisual");

  function setPlayingUI(playing) {
    player.classList.toggle("playing", playing);
    heroVisual.classList.toggle("playing", playing); // piringan ikut berputar
    playBtn.setAttribute("aria-label", playing ? "Jeda lagu" : "Putar lagu");
    playerStatus.textContent = playing ? "Sedang diputar" : "Dijeda";
  }

  // tombol play / pause
  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {
        playerStatus.textContent = "Gagal memutar";
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => setPlayingUI(true));
  audio.addEventListener("pause", () => setPlayingUI(false));

  // durasi lagu muncul setelah metadata terbaca
  function showDuration() {
    durTimeEl.textContent = formatTime(audio.duration);
  }
  audio.addEventListener("loadedmetadata", showDuration);
  audio.addEventListener("durationchange", showDuration);
  if (audio.readyState >= 1) showDuration(); // metadata sudah terbaca duluan

  // update waktu & progress bar saat lagu berjalan
  audio.addEventListener("timeupdate", () => {
    if (isSeeking || !audio.duration) return;
    curTimeEl.textContent = formatTime(audio.currentTime);
    setProgress((audio.currentTime / audio.duration) * 100);
  });

  // geser progress bar untuk loncat ke bagian lagu
  seek.addEventListener("input", () => {
    isSeeking = true;
    seek.style.setProperty("--progress", `${seek.value}%`);
    if (audio.duration) curTimeEl.textContent = formatTime((seek.value / 100) * audio.duration);
  });
  seek.addEventListener("change", () => {
    if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
    isSeeking = false;
  });

  // lagu selesai → kembali ke awal (event "pause" juga ikut terpanggil)
  audio.addEventListener("ended", () => {
    setProgress(0);
    curTimeEl.textContent = "0:00";
    playerStatus.textContent = "Putar lagi?";
  });

  // kalau file lagu belum ada / gagal dimuat
  function onAudioError() {
    playBtn.disabled = true;
    seek.disabled = true;
    playerStatus.textContent = "Lagu tidak ditemukan";
  }
  audio.addEventListener("error", onAudioError);
  if (audio.error) onAudioError();

  // tombol spasi = play/pause (hanya saat tidak sedang fokus di tombol / form)
  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const free = active === document.body || active === seek;
    if (e.code === "Space" && free && !playBtn.disabled) {
      e.preventDefault();
      playBtn.click();
    }
  });

  /* ---------------------------------------------------------
     11. TAHUN OTOMATIS di footer
     --------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
