import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { setupMarqueeAnimation } from "./marquee.js";

gsap.registerPlugin(Flip, SplitText, ScrollTrigger);

// Global variables
let isOpen = false;
let isAnimating = false;
let loadingComplete = false;
let lenis = null;
let scrollPosition = 0;

// DOM Elements
const container = document.querySelector(".container");
const menuToggle = document.querySelector(".menu-toggle");
const menuOverlay = document.querySelector(".menu-overlay");
const menuContent = document.querySelector(".menu-content");
const menuPreviewImg = document.querySelector(".menu-preview-img");
const menuLinks = document.querySelectorAll(".link a");
const mainNav = document.querySelector("nav.main-nav");
const body = document.body;

// Setup text splitting for landing page animations
const setupTextSpliting = () => {
  const textElements = document.querySelectorAll(
    ".hero h1, .hero h2, .hero p, .hero a, .main-nav h1, .main-nav h2, .main-nav p, .main-nav a"
  );
  textElements.forEach((element) => {
    if (element.closest(".menu-overlay")) return;

    SplitText.create(element, {
      type: "lines",
      linesClass: "line",
    });

    const lines = element.querySelectorAll(".line");
    lines.forEach((line) => {
      const textContent = line.textContent;
      line.innerHTML = `<span>${textContent}</span>`;
    });
  });
};

// Scroll Management System
const ScrollManager = {
  disableScroll() {
    // Store current scroll position
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Disable Lenis if active
    if (lenis) {
      lenis.stop();
    }

    // Apply fixed positioning to prevent scroll
    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
  },

  enableScroll() {
    // Re-enable Lenis if it was active
    if (lenis) {
      lenis.start();
    }

    // Remove fixed positioning
    body.style.position = "";
    body.style.top = "";
    body.style.width = "";
    body.style.overflow = "";

    // Restore scroll position
    if (scrollPosition !== undefined) {
      window.scrollTo(0, scrollPosition);
    }
  },
};

// ===== STICKY CARDS SYSTEM =====
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

    if (!stickySection || !stickyHeader || cards.length === 0) return;

    const stickyHeight = window.innerHeight * 5;

    ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;

        const maxTranslate = stickyHeader.offsetWidth - window.innerWidth;
        const translateX = -progress * maxTranslate;
        gsap.set(stickyHeader, { x: translateX });

        // Animate cards
        cards.forEach((card, index) => {
          const delay = index * 0.1125;
          const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));

          if (cardProgress > 0) {
            const cardStartX = 25;
            const cardEndX = -650;
            const yPositions = this.transforms[index][0];
            const rotations = this.transforms[index][1];

            const cardX = gsap.utils.interpolate(
              cardStartX,
              cardEndX,
              cardProgress
            );

            const yProgress = cardProgress * 3;
            const yIndex = Math.min(
              Math.floor(yProgress),
              yPositions.length - 2
            );
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
          } else {
            gsap.set(card, { opacity: 0 });
          }
        });
      },
    });
  },
};

// Create counter digits for loading animation
const createCounterDigits = () => {
  const counter1 = document.querySelector(".counter-1");
  if (!counter1) return;

  const num0 = document.createElement("div");
  num0.className = "num";
  num0.textContent = "0";
  counter1.appendChild(num0);

  const num1 = document.createElement("div");
  num1.className = "num num1offset1";
  num1.textContent = "1";
  counter1.appendChild(num1);

  const counter2 = document.querySelector(".counter-2");
  if (counter2) {
    for (let i = 0; i <= 10; i++) {
      const numDiv = document.createElement("div");
      numDiv.className = i === 1 ? "num num1offset2" : "num";
      numDiv.textContent = i === 10 ? "0" : i;
      counter2.appendChild(numDiv);
    }
  }

  const counter3 = document.querySelector(".counter-3");
  if (counter3) {
    for (let i = 0; i <= 30; i++) {
      const numDiv = document.createElement("div");
      numDiv.className = "num";
      numDiv.textContent = i % 10;
      counter3.appendChild(numDiv);
    }

    const finalNum = document.createElement("div");
    finalNum.className = "num";
    finalNum.textContent = "0";
    counter3.appendChild(finalNum);
  }
};

// Animate counter digits
const animateCounter = (counter, duration, delay = 0) => {
  if (!counter) return;

  const numHeight = counter.querySelector(".num")?.clientHeight;
  if (!numHeight) return;

  const totalDistance =
    (counter.querySelectorAll(".num").length - 1) * numHeight;

  gsap.to(counter, {
    y: -totalDistance,
    duration: duration,
    delay: delay,
    ease: "power2.inOut",
  });
};

// Animate images with flip and scale effects
function animateImages() {
  const images = document.querySelectorAll(".img");
  if (images.length === 0) return;

  images.forEach((img) => img.classList.remove("animate-out"));

  const state = Flip.getState(images);
  images.forEach((img) => img.classList.add("animate-out"));

  const mainTimeline = gsap.timeline();

  mainTimeline.add(
    Flip.from(state, {
      duration: 1,
      stagger: 0.1,
      ease: "power3.inOut",
    })
  );

  images.forEach((img, index) => {
    const scaleTimeline = gsap.timeline();
    scaleTimeline
      .to(img, { scale: 2.5, duration: 0.45, ease: "power3.in" }, 0.025)
      .to(img, { scale: 1, duration: 0.45, ease: "power3.out" }, 0.5);
    mainTimeline.add(scaleTimeline, index * 0.1);
  });

  return mainTimeline;
}

// Burger menu animation function
function animateBurgerMenu(isOpening) {
  if (!menuToggle) return;

  if (isOpening) {
    menuToggle.classList.add("open");
    body.classList.add("menu-open");
  } else {
    menuToggle.classList.remove("open");
    body.classList.remove("menu-open");
  }
}

// Open menu function
function openMenu() {
  if (isAnimating || isOpen || !loadingComplete) return;
  isAnimating = true;
  isOpen = true;

  // DISABLE SCROLL COMPLETELY
  ScrollManager.disableScroll();

  menuOverlay.classList.add("open");
  menuContent.classList.add("open");
  container.classList.add("menu-open");

  animateBurgerMenu(true);

  const timeline = gsap.timeline();
  timeline
    .to([container, menuContent], { duration: 1.25, ease: "power4.inOut" })
    .to(
      [".link a", ".social a"],
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
    .to(
      menuOverlay,
      {
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          isAnimating = false;
        },
      },
      0
    );
}

// Close menu function
function closeMenu() {
  if (isAnimating || !isOpen) return;
  isAnimating = true;

  menuOverlay.classList.remove("open");
  menuContent.classList.remove("open");
  container.classList.remove("menu-open");

  animateBurgerMenu(false);

  const timeline = gsap.timeline();
  timeline
    .to([container, menuContent], { duration: 1.25, ease: "power4.inOut" })
    .to(
      menuOverlay,
      {
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          isOpen = false;
          isAnimating = false;

          // RE-ENABLE SCROLL
          ScrollManager.enableScroll();

          gsap.set([".link a", ".social a"], { y: "120%", opacity: 0.25 });
          resetPreviewImage();
        },
      },
      0
    );
}

// Reset preview image to default
function resetPreviewImage() {
  if (!menuPreviewImg) return;

  menuPreviewImg.innerHTML = "";
  const defaultPreviewImg = document.createElement("img");
  defaultPreviewImg.src = "/resume.png";
  menuPreviewImg.appendChild(defaultPreviewImg);
}

// Cleanup preview images
function cleanupPreviewImage() {
  if (!menuPreviewImg) return;

  const previewImages = menuPreviewImg.querySelectorAll("img");
  if (previewImages.length > 3) {
    for (let i = 0; i < previewImages.length - 3; i++) {
      menuPreviewImg.removeChild(previewImages[i]);
    }
  }
}

// Navigation scroll effect
function handleNavScroll() {
  const scrollY = lenis ? lenis.scroll : window.scrollY;
  const sidebarDivider = document.querySelector(".sidebar .divider");

  if (scrollY > 100 && !isOpen) {
    mainNav.classList.add("scrolled");
    if (sidebarDivider) sidebarDivider.style.opacity = "0";
  } else {
    mainNav.classList.remove("scrolled");
    if (sidebarDivider) sidebarDivider.style.opacity = "1";
  }
}

// Initialize Lenis smooth scrolling
function initializeLenis() {
  if (!loadingComplete) return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  lenis.on("scroll", () => {
    ScrollTrigger.update();
    handleNavScroll();
  });

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Initialize loading sequence
function initLoadingSequence() {
  body.classList.add("loading");
  body.classList.remove("loaded", "menu-open");
  loadingComplete = false;

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

  setupTextSpliting();
  createCounterDigits();

  animateCounter(document.querySelector(".counter-3"), 2.5);
  animateCounter(document.querySelector(".counter-2"), 3);
  animateCounter(document.querySelector(".counter-1"), 2, 1.5);

  const loadingTimeline = gsap.timeline();

  loadingTimeline
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
    .to(".sidebar .logo", { scale: 1, duration: 1, ease: "power4.inOut" }, "<")
    .to([".nav-left .logo-name a span", ".nav-center .nav-links a span"], {
      y: "0%",
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
    })
    .to(
      [".header span", ".site-info span", ".hero-footer span"],
      {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        onComplete: () => {
          loadingComplete = true;
          body.classList.remove("loading");
          body.classList.add("loaded");
          setTimeout(() => {
            initializeLenis();
            StickyCards.initialize();
          }, 500);
        },
      },
      "<"
    );
}

// Comprehensive scroll prevention
const preventScroll = (e) => {
  if (isOpen) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
};

// Force page to start from top on refresh
window.addEventListener("beforeunload", () => window.scrollTo(0, 0));
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  body.classList.remove("loaded", "menu-open");
});

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  body.classList.add("loading");
  initLoadingSequence();
  resetPreviewImage();

  // Menu toggle event listener
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (!loadingComplete || isAnimating) return;
      isOpen ? closeMenu() : openMenu();
    });
  }

  // Menu links hover effect for image preview
  if (menuLinks) {
    menuLinks.forEach((link) => {
      link.addEventListener("mouseover", () => {
        if (!isOpen || isAnimating || !menuPreviewImg) return;

        const imgsrc = link.getAttribute("data-img");
        if (!imgsrc) return;

        const previewImages = menuPreviewImg.querySelectorAll("img");
        if (
          previewImages.length > 0 &&
          previewImages[previewImages.length - 1].src.endsWith(imgsrc)
        )
          return;

        const newPreviewImg = document.createElement("img");
        newPreviewImg.src = imgsrc;
        newPreviewImg.style.opacity = "0";
        newPreviewImg.style.transform = "scale(1.25) rotate(10deg)";

        menuPreviewImg.appendChild(newPreviewImg);
        cleanupPreviewImage();

        gsap.to(newPreviewImg, {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.75,
          ease: "power2.out",
        });
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target && lenis) lenis.scrollTo(target);
    });
  });

  // COMPREHENSIVE SCROLL PREVENTION
  document.addEventListener("wheel", preventScroll, { passive: false });
  document.addEventListener("touchmove", preventScroll, { passive: false });
  document.addEventListener("scroll", preventScroll, { passive: false });

  // Keyboard scroll prevention
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      closeMenu();
    }

    if (
      isOpen &&
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

  // Window resize handler
  window.addEventListener("resize", () => {
    if (isOpen && window.innerWidth <= 768) {
      gsap.set(container, { clearProps: "all" });
      ScrollManager.disableScroll(); // Ensure scroll stays disabled on mobile
    }
  });

  // Prevent context menu on burger menu
  if (menuToggle) {
    menuToggle.addEventListener("contextmenu", (e) => e.preventDefault());
  }
});

// Export functions for potential external use
export {
  openMenu,
  closeMenu,
  resetPreviewImage,
  setupTextSpliting,
  createCounterDigits,
  animateCounter,
  animateImages,
  animateBurgerMenu,
  StickyCards,
  ScrollManager,
};
