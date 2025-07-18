import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { setupMarqueeAnimation } from "./marquee.js";

gsap.registerPlugin(Flip, SplitText, ScrollTrigger);

const AppState = {
  isOpen: false,
  isAnimating: false,
  loadingComplete: false,
  scrollPosition: 0,
};

const DOM = {
  container: document.querySelector(".container"),
  menuToggle: document.querySelector(".menu-toggle"),
  menuOverlay: document.querySelector(".menu-overlay"),
  menuContent: document.querySelector(".menu-content"),
  menuPreviewImg: document.querySelector(".menu-preview-img"),
  menuLinks: document.querySelectorAll(".link a"),
  mainNav: document.querySelector("nav.main-nav"),
  body: document.body,
};

let lenis = null;

const setupTextSplitting = () => {
  const textElements = document.querySelectorAll(
    ".hero h1, .hero h2, .hero p, .hero a, .main-nav h1, .main-nav h2, .main-nav p, .main-nav a"
  );
  textElements.forEach((element) => {
    if (element.closest(".menu-overlay")) return;

    SplitText.create(element, { type: "lines", linesClass: "line" });
    element.querySelectorAll(".line").forEach((line) => {
      line.innerHTML = `<span>${line.textContent}</span>`;
    });
  });
};

// ✅ FINAL, CORRECTED SCROLL MANAGER

const ScrollManager = {
  disable() {
    // The PREFERRED way: Use Lenis's own stop method.
    if (lenis) {
      lenis.stop();
    }
    // The FALLBACK: A less disruptive CSS-only method.
    else {
      AppState.scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${this.getScrollbarWidth()}px`;
    }
  },

  enable() {
    // The PREFERRED way: Use Lenis's own start method.
    if (lenis) {
      lenis.start();
    }
    // The FALLBACK: Revert the CSS changes.
    else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      if (AppState.scrollPosition !== undefined) {
        window.scrollTo(0, AppState.scrollPosition);
      }
    }
  },

  // This helper function is perfect, no changes needed.
  getScrollbarWidth() {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    document.body.appendChild(outer);
    const inner = document.createElement("div");
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  },
};

const StickyCards = {
  transforms: [
    [
      [10, 50, -10, 10],
      [20, -10, -45, 20],
    ],
    [
      [0, 47.5, -10, 15],
      [-25, 15, -45, 30],
    ],
    [
      [0, 52.5, -10, 5],
      [15, -5, -40, 60],
    ],
    [
      [0, 50, 30, -80],
      [20, -10, 60, 5],
    ],
    [
      [0, 55, -15, 30],
      [25, -15, 60, 95],
    ],
  ],
  initialize() {
    const stickySection = document.querySelector(".sticky-cards-section");
    const stickyHeader = document.querySelector(".sticky-header");
    const cards = document.querySelectorAll(".sticky-card");

    if (!stickySection || !stickyHeader || !cards.length) return;

    ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => this.animate(self, stickyHeader, cards),
      onComplete: () => this.cleanup(stickyHeader, cards),
    });
  },
  animate(self, stickyHeader, cards) {
    const progress = self.progress;
    const maxTranslate = stickyHeader.offsetWidth - window.innerWidth;
    gsap.set(stickyHeader, { x: -progress * maxTranslate });

    cards.forEach((card, index) => {
      const delay = index * 0.1125;
      const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));
      if (cardProgress > 0) {
        this.updateCardTransform(card, cardProgress, index);
      } else {
        gsap.set(card, { opacity: 0 });
      }
    });
  },
  updateCardTransform(card, cardProgress, index) {
    const [yPositions, rotations] = this.transforms[index];
    const cardX = gsap.utils.interpolate(25, -650, cardProgress);
    const yProgress = cardProgress * 3;
    const yIndex = Math.min(Math.floor(yProgress), yPositions.length - 2);
    const yInterpolation = yProgress - yIndex;
    const cardY = gsap.utils.interpolate(
      yPositions[yIndex],
      yPositions[yIndex + 1],
      yInterpolation
    );
    const cardRotation = gsap.utils.interpolate(
      rotations[yIndex],
      rotations[yIndex + 1],
      yInterpolation
    );

    gsap.set(card, {
      xPercent: cardX,
      yPercent: cardY,
      rotation: cardRotation,
      opacity: 1,
    });
  },
  cleanup(stickyHeader, cards) {
    gsap.set(stickyHeader, { clearProps: "x" });
    cards.forEach((card) => gsap.set(card, { clearProps: "all" }));
    ScrollTrigger.refresh();
  },
};

const createCounterDigits = () => {
  const counter1 = document.querySelector(".counter-1");
  if (!counter1) return;
  counter1.innerHTML =
    '<div class="num">0</div><div class="num num1offset1">1</div>';

  const counter2 = document.querySelector(".counter-2");
  if (counter2) {
    let nums = "";
    for (let i = 0; i <= 10; i++) {
      nums += `<div class="num ${i === 1 ? "num1offset2" : ""}">${
        i === 10 ? 0 : i
      }</div>`;
    }
    counter2.innerHTML = nums;
  }

  const counter3 = document.querySelector(".counter-3");
  if (counter3) {
    let nums = "";
    for (let i = 0; i <= 30; i++) {
      nums += `<div class="num">${i % 10}</div>`;
    }
    counter3.innerHTML = nums + '<div class="num">0</div>';
  }
};

const animateCounter = (counter, duration, delay = 0) => {
  if (!counter) return;
  const numHeight = counter.querySelector(".num")?.clientHeight;
  if (!numHeight) return;
  const totalDistance =
    (counter.querySelectorAll(".num").length - 1) * numHeight;
  gsap.to(counter, {
    y: -totalDistance,
    duration,
    delay,
    ease: "power2.inOut",
  });
};

function animateImages() {
  const images = document.querySelectorAll(".img");
  if (!images.length) return;

  images.forEach((img) => img.classList.remove("animate-out"));
  const state = Flip.getState(images);
  images.forEach((img) => img.classList.add("animate-out"));

  const tl = gsap.timeline();
  tl.add(Flip.from(state, { duration: 1, stagger: 0.1, ease: "power3.inOut" }));

  images.forEach((img, index) => {
    const scaleTl = gsap.timeline();
    scaleTl
      .to(img, { scale: 2.5, duration: 0.45, ease: "power3.in" }, 0.025)
      .to(img, { scale: 1, duration: 0.45, ease: "power3.out" }, 0.5);
    tl.add(scaleTl, index * 0.1);
  });
  return tl;
}

const Menu = {
  animateBurger(isOpening) {
    if (!DOM.menuToggle) return;
    DOM.menuToggle.classList.toggle("open", isOpening);
    DOM.body.classList.toggle("menu-open", isOpening);
  },
  open() {
    if (AppState.isAnimating || AppState.isOpen || !AppState.loadingComplete)
      return;
    AppState.isAnimating = true;
    AppState.isOpen = true;
    ScrollManager.disable();

    DOM.menuOverlay.classList.add("open");
    DOM.menuContent.classList.add("open");
    DOM.container.classList.add("menu-open");
    this.animateBurger(true);

    gsap
      .timeline({ onComplete: () => (AppState.isAnimating = false) })
      .to([DOM.container, DOM.menuContent], {
        duration: 1.25,
        ease: "power4.inOut",
      })
      .to(
        ".link a, .social a",
        {
          y: "0%",
          opacity: 1,
          duration: 1,
          delay: 0.75,
          stagger: 0.1,
          ease: "power3.out",
        },
        0
      )
      .to(DOM.menuOverlay, { duration: 1.25, ease: "power4.inOut" }, 0);
  },
  close() {
    if (AppState.isAnimating || !AppState.isOpen) return;
    AppState.isAnimating = true;
    AppState.isOpen = false;

    DOM.menuOverlay.classList.remove("open");
    DOM.menuContent.classList.remove("open");
    DOM.container.classList.remove("menu-open");
    this.animateBurger(false);

    gsap
      .timeline({
        onComplete: () => {
          AppState.isAnimating = false;
          ScrollManager.enable();
          gsap.set(".link a, .social a", { y: "120%", opacity: 0.25 });
          this.resetPreviewImage();
        },
      })
      .to([DOM.container, DOM.menuContent], {
        duration: 1.25,
        ease: "power4.inOut",
      })
      .to(DOM.menuOverlay, { duration: 1.25, ease: "power4.inOut" }, 0);
  },
  resetPreviewImage() {
    if (!DOM.menuPreviewImg) return;
    DOM.menuPreviewImg.innerHTML =
      '<img src="/resume.jpeg" alt="Resume Preview">';
  },
  cleanupPreviewImage() {
    if (!DOM.menuPreviewImg) return;
    const previewImages = DOM.menuPreviewImg.querySelectorAll("img");
    if (previewImages.length > 3) {
      for (let i = 0; i < previewImages.length - 3; i++) {
        DOM.menuPreviewImg.removeChild(previewImages[i]);
      }
    }
  },
  handleLinkHover(e) {
    if (!AppState.isOpen || AppState.isAnimating || !DOM.menuPreviewImg) return;
    const imgsrc = e.target.getAttribute("data-img");
    if (!imgsrc) return;

    const previewImages = DOM.menuPreviewImg.querySelectorAll("img");
    if (
      previewImages.length &&
      previewImages[previewImages.length - 1].src.endsWith(imgsrc)
    )
      return;

    const newPreviewImg = document.createElement("img");
    newPreviewImg.src = imgsrc;
    newPreviewImg.alt = `${e.target.textContent} Preview`;
    gsap.set(newPreviewImg, { opacity: 0, scale: 1.25, rotation: 10 });
    DOM.menuPreviewImg.appendChild(newPreviewImg);
    this.cleanupPreviewImage();
    gsap.to(newPreviewImg, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      ease: "power2.out",
    });
  },
};

function handleNavScroll() {
  const scrollY = lenis ? lenis.scroll : window.scrollY;
  const sidebarDivider = document.querySelector(".sidebar .divider");
  DOM.mainNav.classList.toggle("scrolled", scrollY > 100 && !AppState.isOpen);
  if (sidebarDivider) sidebarDivider.style.opacity = scrollY > 100 ? "0" : "1";
}

function initializeLenis() {
  if (!AppState.loadingComplete) return;
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  lenis.on("scroll", () => {
    ScrollTrigger.update();
    handleNavScroll();
  });

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

const LoadingSequence = {
  async init() {
    DOM.body.classList.add("loading");
    DOM.body.classList.remove("loaded", "menu-open");
    AppState.loadingComplete = false;

    this.setInitialStates();
    setupTextSplitting();
    createCounterDigits();

    animateCounter(document.querySelector(".counter-3"), 2.5);
    animateCounter(document.querySelector(".counter-2"), 3);
    animateCounter(document.querySelector(".counter-1"), 2, 1.5);

    await this.runAnimations();

    AppState.loadingComplete = true;
    DOM.body.classList.remove("loading");
    DOM.body.classList.add("loaded");
    setTimeout(this.onComplete, 500);
  },
  setInitialStates() {
    gsap.set(".img", { scale: 0 });
    gsap.set(".hero-bg", { scaleY: "0%" });
    gsap.set(".counter", { opacity: 1 });
    gsap.set(".sidebar .divider", { scaleY: "0%" });
    gsap.set(".site-info .divider", { scaleX: "0%" });
    gsap.set(".sidebar .logo", { scale: 0 });
    gsap.set([".header span", ".site-info span", ".hero-footer span"], {
      y: "125%",
    });
    gsap.set([".nav-left .logo-name a span", ".nav-center .nav-links a span"], {
      y: "125%",
    });
  },
  runAnimations() {
    return new Promise((resolve) => {
      gsap
        .timeline({ onComplete: resolve })
        .to(".hero-bg", {
          scaleY: "100%",
          duration: 3,
          ease: "power2.inOut",
          delay: 0.25,
        })
        .to(
          ".img",
          { scale: 1, duration: 1, stagger: 0.125, ease: "power3.out" },
          "<"
        )
        .to(".counter", {
          opacity: 0,
          duration: 0.3,
          ease: "power3.out",
          delay: 0.3,
          onStart: () => animateImages(),
          onComplete: () => gsap.set(".counter", { display: "none" }),
        })
        .to(".sidebar .divider", {
          scaleY: "100%",
          duration: 1,
          ease: "power3.inOut",
          delay: 1.25,
        })
        .to([".main-nav .divider", ".site-info .divider"], {
          scaleX: "100%",
          duration: 1,
          stagger: 0.5,
          ease: "power3.inOut",
        })
        .to(
          ".sidebar .logo",
          { scale: 1, duration: 1, ease: "power4.inOut" },
          "<"
        )
        .to([".nav-left .logo-name a span", ".nav-center .nav-links a span"], {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
        })
        .to(
          [".header span", ".site-info span", ".hero-footer span"],
          { y: "0%", duration: 1, stagger: 0.1, ease: "power4.out" },
          "<"
        );
    });
  },
  onComplete() {
    optimizeScrollTriggerForMobile();
    initializeLenis();
    enhanceMobileTextAnimation();
    PortfolioAbout.initialize();
    initStickyCardsEntrance();
    StickyCards.initialize();
    setupProjectsSpotlight();
    ContactForm.initialize();
    cleanupScrollTriggers();
    ScrollTrigger.refresh();
  },
};

const PortfolioAbout = {
  initialize() {
    document
      .querySelectorAll(".portfolio-anime-text-container")
      .forEach((container) => {
        this.setupText(container);
        this.createScrollTrigger(container);
      });
  },
  setupText(container) {
    container.querySelectorAll(".portfolio-anime-text p").forEach((p) => {
      const keywords = [
        "technology",
        "design",
        "data",
        "intuitive",
        "impactful",
        "sustainability",
        "SaaS",
        "Next.js",
        "Supabase",
        "serverless",
        "AI",
        "RAG",
        "Mistral-7B",
        "hybrid",
      ];
      p.innerHTML = p.textContent
        .split(/\s+/)
        .map((word) => {
          if (!word.trim()) return "";
          const cleanWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
          const isKeyword = keywords.includes(cleanWord);
          const className = `word ${isKeyword ? `keyword-wrapper` : ""}`;
          const spanClass = isKeyword ? `keyword ${cleanWord}` : "";
          return `<div class="${className}"><span class="${spanClass}">${word}</span></div>`;
        })
        .join(" ");
    });
  },
  createScrollTrigger(container) {
    const isMobile = window.innerWidth <= 768;
    ScrollTrigger.create({
      trigger: container,
      pin: true,
      start: "top top",
      end: isMobile
        ? () => `+=${container.querySelectorAll(".word").length * 50 + 1000}`
        : () => `+=${container.offsetHeight * 1.5}`,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => this.animateText(self, container, isMobile),
      onComplete: () => this.cleanup(container, isMobile),
    });
  },
  animateText(self, container, isMobile) {
    const progress = self.progress;
    const words = Array.from(
      container.querySelectorAll(".portfolio-anime-text .word")
    );
    const imageContainer = container.querySelector(
      ".portfolio-image-container"
    );

    if (imageContainer) {
      const revealProgress = Math.min(1, progress / (isMobile ? 0.9 : 0.7));
      gsap.set(imageContainer, {
        clipPath: `inset(${(1 - revealProgress) * 100}% 0 0 0)`,
      });
    }

    words.forEach((word, index) => {
      const wordText = word.querySelector("span");
      const wordProgress = isMobile
        ? Math.min(1, (progress * words.length * 1.5 - index) / 5)
        : this.calculateDesktopWordProgress(progress, index, words.length);

      if (wordProgress > 0) {
        const bgColor = "60, 60, 60";
        const bgOpacity = isMobile
          ? Math.max(0, 1 - (wordProgress - 0.3) / 0.7)
          : Math.max(
              0,
              1 - (wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0)
            );
        word.style.opacity = isMobile
          ? Math.min(1, wordProgress)
          : wordProgress;
        word.style.backgroundColor = `rgba(${bgColor}, ${bgOpacity})`;
        wordText.style.opacity = isMobile
          ? Math.min(1, wordProgress)
          : Math.pow(wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0, 0.5);
      }
    });
  },
  calculateDesktopWordProgress(progress, index, totalWords) {
    const animationProgressTarget = 0.7;
    if (progress > animationProgressTarget) return 1;
    const revealProgress = Math.min(1, progress / animationProgressTarget);
    const overlapWords = 15;
    const timelineScale = 1 / (1 + overlapWords / totalWords);
    const wordStart = (index / totalWords) * timelineScale;
    const wordEnd = wordStart + (overlapWords / totalWords) * timelineScale;
    return revealProgress <= wordStart
      ? 0
      : revealProgress >= wordEnd
      ? 1
      : (revealProgress - wordStart) / (wordEnd - wordStart);
  },
  cleanup(container, isMobile) {
    if (isMobile) {
      container
        .querySelectorAll(".portfolio-anime-text .word")
        .forEach((word) => {
          word.style.opacity = "1";
          word.style.backgroundColor = "transparent";
          word.querySelector("span").style.opacity = "1";
        });
      setTimeout(() => ScrollTrigger.refresh(), 500);
    }
  },
};

const ContactForm = {
  initialize() {
    const contactSection = document.querySelector(".contact-section");
    if (!contactSection) return;
    this.setupAnimations();
    this.setupFormHandling();
  },
  setupAnimations() {
    const animate = (trigger, animation) =>
      ScrollTrigger.create({ trigger, start: "top 80%", onEnter: animation });
    animate(".contact-header", this.animateHeader);
    animate(".contact-info", this.animateContactInfo);
    animate(".contact-form-wrapper", this.animateForm);
  },
  animateHeader() {
    gsap.fromTo(
      ".contact-title h1",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      ".contact-subtitle p",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" }
    );
  },
  animateContactInfo() {
    gsap.to(".info-item", {
      x: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
    gsap.to(".social-link", {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.8,
      ease: "power3.out",
    });
  },
  animateForm() {
    gsap.to(".contact-form-wrapper", {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(
      ".form-group label, .form-group input, .form-group textarea, .submit-btn",
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: "power3.out",
      }
    );
  },
  setupFormHandling() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit(form);
    });
    form.querySelectorAll("input, textarea").forEach((input) => {
      const line = input.nextElementSibling;
      input.addEventListener("focus", () =>
        gsap.to(line, { width: "100%", duration: 0.4, ease: "power2.out" })
      );
      input.addEventListener("blur", () => {
        if (!input.value)
          gsap.to(line, { width: "0%", duration: 0.4, ease: "power2.out" });
      });
    });
  },
  handleSubmit(form) {
    const submitBtn = form.querySelector(".submit-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnArrow = submitBtn.querySelector(".btn-arrow");
    gsap.to(submitBtn, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
    btnText.textContent = "Sending...";
    btnArrow.textContent = "⏳";
    setTimeout(() => {
      btnText.textContent = "Message Sent!";
      btnArrow.textContent = "✓";
      gsap.to(submitBtn, {
        backgroundColor: "#4CAF50",
        duration: 0.3,
        ease: "power2.out",
      });
      setTimeout(() => {
        form.reset();
        btnText.textContent = "Send Message";
        btnArrow.textContent = "→";
        gsap.to(submitBtn, {
          backgroundColor: "var(--fg)",
          duration: 0.3,
          ease: "power2.out",
        });
      }, 2000);
    }, 1500);
  },
};

function initStickyCardsEntrance() {
  const stickySection = document.querySelector(".sticky-cards-section");
  if (!stickySection) return;
  gsap.fromTo(
    stickySection,
    { x: "100%", opacity: 0 },
    {
      x: "0%",
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".portfolio-about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) =>
          stickySection.classList.toggle("active", self.progress > 0.5),
      },
    }
  );
}

function cleanupScrollTriggers() {
  window.addEventListener("resize", () => ScrollTrigger.refresh());
  ScrollTrigger.addEventListener("refresh", () => {
    DOM.body.style.transform = "translateZ(0)";
    requestAnimationFrame(() => (DOM.body.style.transform = ""));
  });
}

function enhanceMobileTextAnimation() {
  if (window.innerWidth > 768) return;
  document
    .querySelectorAll(".portfolio-anime-text-container")
    .forEach((container) => {
      let animationComplete = false;
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        onEnter: () => {
          animationComplete = false;
          const interval = setInterval(() => {
            const words = container.querySelectorAll(
              ".portfolio-anime-text .word"
            );
            const visibleWords = Array.from(words).filter(
              (word) => parseFloat(word.style.opacity) > 0.9
            );
            if (visibleWords.length >= words.length * 0.9) {
              animationComplete = true;
              clearInterval(interval);
            }
          }, 100);
        },
        onLeave: () => {
          if (!animationComplete) {
            lenis ? lenis.scrollTo(container) : container.scrollIntoView();
          }
        },
      });
    });
}

function optimizeScrollTriggerForMobile() {
  if (window.innerWidth <= 768) {
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });
    DOM.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });
  }
}

function preventScroll(e) {
  if (AppState.isOpen) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}

function setupEventListeners() {
  window.addEventListener("beforeunload", () => window.scrollTo(0, 0));
  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    DOM.body.classList.remove("loaded", "menu-open");
  });

  document.addEventListener("DOMContentLoaded", () => {
    DOM.body.classList.add("loading");
    LoadingSequence.init();
    Menu.resetPreviewImage();
    if (DOM.menuToggle) {
      DOM.menuToggle.addEventListener("click", () =>
        AppState.isOpen ? Menu.close() : Menu.open()
      );
      DOM.menuToggle.addEventListener("contextmenu", (e) => e.preventDefault());
    }
    if (DOM.menuLinks) {
      DOM.menuLinks.forEach((link) =>
        link.addEventListener("mouseover", (e) => Menu.handleLinkHover(e))
      );
    }
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target && lenis) lenis.scrollTo(target);
      });
    });
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("scroll", preventScroll, { passive: false });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && AppState.isOpen) Menu.close();
      if (
        AppState.isOpen &&
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }
    });
    window.addEventListener("resize", () => {
      if (AppState.isOpen && window.innerWidth <= 768) {
        gsap.set(DOM.container, { clearProps: "all" });
        ScrollManager.disable();
      }
    });
  });
}

// ===== PROJECTS SPOTLIGHT FUNCTIONALITY =====

function setupProjectsSpotlight() {
  const projectsSpotlightConfig = {
    gap: 0.08,
    speed: 0.5,
    arcRadius: 500,
  };

  const projectsSpotlightItems = [
    {
      name: "Aurora SaaS",
      img: "/img-1.png",
      desc: "Advanced SaaS platform with modern UI/UX",
      liveUrl: "#",
      gitUrl: "#",
    },
    {
      name: "RAG Music AI",
      img: "/img-2.png",
      desc: "AI-powered music recommendation system",
      liveUrl: "#",
      gitUrl: "#",
    },
    {
      name: "Data Analytics",
      img: "/img-3.png",
      desc: "Big data visualization dashboard",
      liveUrl: "#",
      gitUrl: "#",
    },
    {
      name: "ML Pipeline",
      img: "/img-4.png",
      desc: "Machine learning processing pipeline",
      liveUrl: "#",
      gitUrl: "#",
    },

    {
      name: "Data Analytics",
      img: "/img-5.png",
      desc: "Big data visualization dashboard",
      liveUrl: "#",
      gitUrl: "#",
    },
    {
      name: "Data Analytics",
      img: "/img-6.png",
      desc: "Big data visualization dashboard",
      liveUrl: "#",
      gitUrl: "#",
    },
  ];

  const projectsLive = {
    get vh() {
      return window.innerHeight;
    },
    get vw() {
      return window.innerWidth;
    },
    get w75() {
      return this.vw * 0.75;
    },
    get end() {
      return `+=${this.vh * 10}px`;
    },
    get arc() {
      const startX = this.w75 - 220;
      const cpX = startX + 500;
      const cpY = this.vh / 2;
      return { startX, cpX, cpY };
    },
  };

  // DOM Elements
  const projectsTitlesContainer = document.querySelector(".projects-titles");
  const projectsImagesContainer = document.querySelector(".projects-images");
  const projectsHeader = document.querySelector(".projects-header");
  const projectsTitlesContainerElement = document.querySelector(
    ".projects-titles-container"
  );
  const projectsIntroTextElements = document.querySelectorAll(
    ".projects-intro-text"
  );
  const projectsImageElements = [];

  if (!projectsTitlesContainer || !projectsImagesContainer) return;

  // Create project elements
  projectsSpotlightItems.forEach((item, index) => {
    const titleElement = document.createElement("h1");
    titleElement.textContent = item.name;
    if (index === 0) titleElement.style.opacity = "1";
    projectsTitlesContainer.appendChild(titleElement);

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "projects-img";
    const imgElement = document.createElement("img");
    imgElement.src = item.img;
    imgElement.alt = item.name;
    imgWrapper.appendChild(imgElement);
    projectsImagesContainer.appendChild(imgWrapper);
    projectsImageElements.push(imgWrapper);
  });

  const projectsTitleElements = projectsTitlesContainer.querySelectorAll("h1");
  let projectsCurrentActiveIndex = 0;

  function getProjectsBezierPosition(t) {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const w75 = vw * 0.75;
    const startX = w75 - 220;
    const cpX = startX + 500;
    const cpY = vh / 2;
    const startY = -200;
    const endY = vh + 200;

    const x = (1 - t) ** 2 * startX + 2 * (1 - t) * t * cpX + t ** 2 * startX;
    const y = (1 - t) ** 2 * startY + 2 * (1 - t) * t * cpY + t ** 2 * endY;

    return { x, y };
  }

  function getProjectsImgProgressState(index, overallProgress) {
    const startTime = index * projectsSpotlightConfig.gap;
    const endTime = startTime + projectsSpotlightConfig.speed;

    if (overallProgress < startTime) return -1;
    if (overallProgress > endTime) return 2;
    return (overallProgress - startTime) / projectsSpotlightConfig.speed;
  }

  projectsImageElements.forEach((img) => gsap.set(img, { opacity: 0 }));

  ScrollTrigger.create({
    trigger: ".projects-spotlight",
    start: "top top",
    end: projectsLive.end,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress;

      /* 1️⃣  Intro 0 – 20 %  */
      if (p <= 0.2) {
        gsap.set(projectsIntroTextElements[0], {
          x: -(p / 0.2) * window.innerWidth * 0.6,
          opacity: 1,
        });
        gsap.set(projectsIntroTextElements[1], {
          x: (p / 0.2) * window.innerWidth * 0.6,
          opacity: 1,
        });
        gsap.set(".projects-bg-img", { scale: p / 0.2 });
        gsap.set(".projects-bg-img img", { scale: 1.5 - (p / 0.2) * 0.5 });
        gsap.set(projectsImageElements, { opacity: 0 });
        if (projectsHeader) projectsHeader.style.opacity = 0;
        gsap.set(projectsTitlesContainerElement, {
          "--before-opacity": 0,
          "--after-opacity": 0,
        });
        return;
      }

      /* 2️⃣  Fade-through 20 – 25 %  */
      if (p > 0.2 && p <= 0.25) {
        gsap.set(".projects-bg-img", { scale: 1 });
        gsap.set(".projects-bg-img img", { scale: 1 });
        gsap.set(projectsIntroTextElements, { opacity: 0 });
        gsap.set(projectsImageElements, { opacity: 0 });
        if (projectsHeader) projectsHeader.style.opacity = 1;
        gsap.set(projectsTitlesContainerElement, {
          "--before-opacity": 0,
          "--after-opacity": 0,
        });
        return;
      }

      /* 3️⃣  Images fly 25 – 95 %  */
      if (p > 0.25 && p <= 0.95) {
        const switchProgress = (p - 0.25) / 0.7;
        const vh = window.innerHeight;
        const h = projectsTitlesContainer.scrollHeight;
        const y = vh - switchProgress * (vh + h);
        gsap.set(".projects-titles", { y });

        projectsImageElements.forEach((img, idx) => {
          const imgP = getProjectsImgProgressState(idx, switchProgress);
          if (imgP >= 0 && imgP <= 1) {
            const pos = getProjectsBezierPosition(imgP);
            gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
          } else {
            gsap.set(img, { opacity: 0 });
          }
        });

        /* highlight closest title */
        const mid = vh / 2;
        let closest = 0,
          min = Infinity;
        projectsTitleElements.forEach((t, i) => {
          const d = Math.abs(
            t.getBoundingClientRect().top + t.offsetHeight / 2 - mid
          );
          if (d < min) {
            min = d;
            closest = i;
          }
        });
        if (closest !== projectsCurrentActiveIndex) {
          projectsTitleElements[projectsCurrentActiveIndex] &&
            (projectsTitleElements[projectsCurrentActiveIndex].style.opacity =
              "0.25");
          projectsTitleElements[closest].style.opacity = "1";
          const bgImg = document.querySelector(".projects-bg-img img");
          if (bgImg) bgImg.src = projectsSpotlightItems[closest].img;
          projectsCurrentActiveIndex = closest;
        }

        /* show the line */
        gsap.set(projectsTitlesContainerElement, {
          "--before-opacity": 1,
          "--after-opacity": 1,
        });
        return;
      }

      /* 4️⃣  Outro 95 – 100 %  */
      if (p > 0.95) {
        gsap.set(projectsTitlesContainerElement, {
          "--before-opacity": 0,
          "--after-opacity": 0,
        });
      }
    },
  });

  // Modal functionality
  const projectsModal = document.getElementById("projects-modal");
  const projectsModalClose = projectsModal?.querySelector(
    ".projects-modal__close"
  );

  if (projectsModal && projectsModalClose) {
    projectsTitlesContainer.addEventListener("click", (e) => {
      const h1 = e.target.closest("h1");
      if (!h1) return;

      const idx = [...projectsTitleElements].indexOf(h1);
      if (idx !== projectsCurrentActiveIndex) return;

      const item = projectsSpotlightItems[idx];

      projectsModal.querySelector(".projects-modal__img").src = item.img;
      projectsModal.querySelector(".projects-modal__title").textContent =
        item.name;
      projectsModal.querySelector(".projects-modal__desc").textContent =
        item.desc;
      projectsModal.querySelector(".live").href = item.liveUrl;
      projectsModal.querySelector(".git").href = item.gitUrl;

      projectsModal.classList.add("open");
      ScrollManager.disable();
    });

    const closeProjectsModal = () => {
      projectsModal.classList.remove("open");
      ScrollManager.enable();
    };

    projectsModalClose.addEventListener("click", closeProjectsModal);
    projectsModal.addEventListener("click", (e) => {
      if (e.target === projectsModal) closeProjectsModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && projectsModal.classList.contains("open")) {
        closeProjectsModal();
      }
    });
  }
}

setupEventListeners();

export { Menu, StickyCards, ScrollManager, PortfolioAbout };
