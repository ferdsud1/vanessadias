/* ============================================================
   Dra. Vanessa Dias — Landing Page JS
   ============================================================ */

(() => {
  /* ---------- Config ---------- */
  const CONTACT = window.SITE_CONFIG || {};
  const WHATSAPP_URL = CONTACT.whatsappUrl || "#contato";

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const toggleNav = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 24);
    };
    toggleNav();
    window.addEventListener("scroll", toggleNav, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
      })
    );
  }

  /* ---------- Active nav link ---------- */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === currentPath || (href === "index.html" && currentPath === "")) {
      a.classList.add("active");
    }
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Home: preencher galeria destaque ---------- */
  const previewGrid = document.querySelector("[data-gallery-preview]");
  if (previewGrid && window.MEDIA_MANIFEST) {
    const layout = [
      { cat: "dra-vanessa", idx: 0, sz: "sz-lg" },
      { cat: "resultados", idx: 0, sz: "sz-md" },
      { cat: "lentes", idx: 0, sz: "sz-sm" },
      { cat: "clareamento", idx: 0, sz: "sz-sm" },
      { cat: "resultados", idx: 5, sz: "sz-sm" },
      { cat: "kids", idx: 0, sz: "sz-hz" },
      { cat: "resultados", idx: 8, sz: "sz-sm" },
      { cat: "resultados", idx: 12, sz: "sz-sm" },
      { cat: "resultados", idx: 15, sz: "sz-sm" },
    ];
    const byId = {};
    window.MEDIA_MANIFEST.photos.forEach((c) => (byId[c.id] = c));
    layout.forEach(({ cat, idx, sz }) => {
      const c = byId[cat];
      if (!c) return;
      const src = c.items[idx] || c.items[0];
      if (!src) return;
      const a = document.createElement("a");
      a.className = `item ${sz}`;
      a.href = "galeria.html";
      a.innerHTML = `<img loading="lazy" alt="${c.label}" src="${encodePath(src)}">`;
      previewGrid.appendChild(a);
    });
  }

  /* ---------- Galeria: tabs, filtros, masonry, lightbox ---------- */
  const galleryPhotos = document.getElementById("galleryPhotos");
  const galleryVideos = document.getElementById("galleryVideos");
  const pills = document.getElementById("categoryPills");
  const tabButtons = document.querySelectorAll("[data-tab-target]");

  if (galleryPhotos && window.MEDIA_MANIFEST) {
    buildPhotoGallery();
    buildVideoGallery();

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tabTarget;
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document
          .querySelectorAll("[data-tab-panel]")
          .forEach((p) => (p.hidden = p.dataset.tabPanel !== target));
        if (pills) pills.style.display = target === "photos" ? "" : "none";
      });
    });
  }

  function buildPhotoGallery() {
    const categories = window.MEDIA_MANIFEST.photos;
    const pillsContainer = pills;
    if (pillsContainer) {
      pillsContainer.innerHTML = "";
      const all = document.createElement("button");
      all.textContent = "Todas";
      all.classList.add("active");
      all.dataset.cat = "all";
      pillsContainer.appendChild(all);
      categories.forEach((c) => {
        if (!c.items.length) return;
        const b = document.createElement("button");
        b.textContent = c.label;
        b.dataset.cat = c.id;
        pillsContainer.appendChild(b);
      });
      pillsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        pillsContainer
          .querySelectorAll("button")
          .forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
        filterPhotos(btn.dataset.cat);
      });
    }

    galleryPhotos.innerHTML = "";
    const allPhotos = [];
    categories.forEach((c) => {
      c.items.forEach((src) => {
        const fig = document.createElement("figure");
        fig.className = "item";
        fig.dataset.cat = c.id;
        fig.innerHTML = `<img loading="lazy" alt="${c.label}" src="${encodePath(src)}">`;
        fig.addEventListener("click", () => openLightbox(src, "image"));
        galleryPhotos.appendChild(fig);
        allPhotos.push({ src, cat: c.id });
      });
    });
  }

  function filterPhotos(cat) {
    galleryPhotos.querySelectorAll(".item").forEach((el) => {
      el.style.display = cat === "all" || el.dataset.cat === cat ? "" : "none";
    });
  }

  function buildVideoGallery() {
    if (!galleryVideos) return;
    galleryVideos.innerHTML = "";
    window.MEDIA_MANIFEST.videos.forEach((src) => {
      const card = document.createElement("div");
      card.className = "video-card";
      card.innerHTML = `
        <video preload="metadata" playsinline muted>
          <source src="${encodePath(src)}" type="video/mp4">
        </video>
        <div class="play-overlay"><span class="icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span></div>`;
      const videoEl = card.querySelector("video");
      card.addEventListener("click", () => openLightbox(src, "video"));
      card.addEventListener("mouseenter", () => {
        try {
          videoEl.currentTime = 0.2;
          videoEl.play().catch(() => {});
          card.classList.add("playing");
        } catch (_) {}
      });
      card.addEventListener("mouseleave", () => {
        videoEl.pause();
        card.classList.remove("playing");
      });
      galleryVideos.appendChild(card);
    });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxBody = document.getElementById("lightboxBody");

  function openLightbox(src, kind) {
    if (!lightbox || !lightboxBody) return;
    lightboxBody.innerHTML =
      kind === "video"
        ? `<video controls autoplay playsinline style="max-width:92vw;max-height:88vh"><source src="${encodePath(src)}" type="video/mp4"></video>`
        : `<img src="${encodePath(src)}" alt="">`;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightboxBody.innerHTML = "";
    document.body.style.overflow = "";
  }
  if (lightbox) {
    lightbox.querySelector(".close")?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------- Util: encode path with spaces and accents ---------- */
  function encodePath(path) {
    return path
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
  }

  /* ---------- Aplica URLs de contato em CTAs ---------- */
  document.querySelectorAll("[data-whats]").forEach((a) => {
    a.setAttribute("href", WHATSAPP_URL);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });

  /* ---------- Ano atual no footer ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
