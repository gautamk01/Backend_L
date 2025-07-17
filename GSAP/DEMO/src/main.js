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
// Scroll Management System
const ScrollManager = {
  disableScroll() {
    // Store current scroll position
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Disable Lenis if active
    if (lenis) {
      lenis.stop();
    }

    // FIXED: Apply scroll prevention WITHOUT position jumping
    body.style.overflow = "hidden";
    body.style.height = "100vh";

    // Keep the page content in the same visual position
    body.style.paddingRight = this.getScrollbarWidth() + "px";
  },

  enableScroll() {
    // Re-enable Lenis if it was active
    if (lenis) {
      lenis.start();
    }

    // FIXED: Remove scroll prevention smoothly
    body.style.overflow = "";
    body.style.height = "";
    body.style.paddingRight = "";

    // Restore scroll position WITHOUT jumping
    if (scrollPosition !== undefined) {
      window.scrollTo(0, scrollPosition);
    }
  },

  // Helper function to get scrollbar width
  getScrollbarWidth() {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    outer.style.msOverflowStyle = "scrollbar";
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
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

    // FIXED: Add proper cleanup and spacing control
    ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1, // Prevents jumping
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

      // CRITICAL: Add cleanup when animation completes
      onComplete: () => {
        // Clean up any remaining transforms
        gsap.set(stickyHeader, { clearProps: "x" });
        cards.forEach((card) => {
          gsap.set(card, { clearProps: "all" });
        });

        // Force ScrollTrigger refresh
        ScrollTrigger.refresh();
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
            optimizeScrollTriggerForMobile();
            initializeLenis();
            enhanceMobileTextAnimation();
            PortfolioAbout.initialize();
            initStickyCardsEntrance();
            StickyCards.initialize();
            ContactForm.initialize();
            cleanupScrollTriggers();
            ScrollTrigger.refresh();
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

// ===== PORTFOLIO ABOUT ME ANIMATION =====
const PortfolioAbout = {
  initialize() {
    const animeTextContainers = document.querySelectorAll(
      ".portfolio-anime-text-container"
    );

    animeTextContainers.forEach((container) => {
      const imageContainer = container.querySelector(
        ".portfolio-image-container"
      );
      const paragraphs = container.querySelectorAll(".portfolio-anime-text p");

      // Setup text splitting (keep existing code)
      paragraphs.forEach((paragraph) => {
        const text = paragraph.textContent;
        const words = text.split(/\s+/);
        paragraph.innerHTML = "";

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

        words.forEach((word) => {
          if (word.trim()) {
            const wordContainer = document.createElement("div");
            wordContainer.className = "word";
            const wordText = document.createElement("span");
            wordText.textContent = word;
            const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
            if (keywords.includes(normalizedWord)) {
              wordContainer.classList.add("keyword-wrapper");
              wordText.classList.add("keyword", normalizedWord);
            }
            wordContainer.appendChild(wordText);
            paragraph.appendChild(wordContainer);
          }
        });
      });

      const isMobile = window.innerWidth <= 768;

      // MOBILE-OPTIMIZED PINNING - Keeps section visible during animation
      ScrollTrigger.create({
        trigger: container,
        pin: true, // ✅ RE-ENABLE PINNING ON MOBILE
        start: "top top",
        // CRITICAL: Mobile-optimized end point based on animation completion
        end: isMobile
          ? () => {
              const words = container.querySelectorAll(
                ".portfolio-anime-text .word"
              );
              return `+=${words.length * 50 + 1000}`; // Dynamic based on word count
            }
          : () => `+=${container.offsetHeight * 1.5}`,
        pinSpacing: true,
        anticipatePin: 1,
        // MOBILE: Prevent overflow during pinning
        onStart: () => {
          if (isMobile) {
            document.body.style.overflowX = "hidden";
            container.style.width = "100%";
            container.style.maxWidth = "100vw";
          }
        },

        onUpdate: (self) => {
          const progress = self.progress;
          const words = Array.from(
            container.querySelectorAll(".portfolio-anime-text .word")
          );
          const totalWords = words.length;

          // MOBILE-OPTIMIZED: Slower, more controlled animation
          const animationProgressTarget = isMobile ? 0.9 : 0.7;
          const revealProgress = Math.min(
            1,
            progress / animationProgressTarget
          );

          if (imageContainer) {
            gsap.set(imageContainer, {
              clipPath: `inset(${(1 - revealProgress) * 100}% 0 0 0)`,
            });
          }

          words.forEach((word, index) => {
            const wordText = word.querySelector("span");

            if (isMobile) {
              // MOBILE: Simplified, more visible animation
              const wordProgress = Math.min(
                1,
                (progress * totalWords * 1.5 - index) / 5
              );

              if (wordProgress > 0) {
                const wordHighlightBgColor = "60, 60, 60";
                word.style.opacity = Math.min(1, wordProgress);

                // Longer background highlight duration on mobile
                const backgroundOpacity = Math.max(
                  0,
                  1 - (wordProgress - 0.3) / 0.7
                );
                word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${Math.max(
                  0,
                  backgroundOpacity
                )})`;

                wordText.style.opacity = Math.min(1, wordProgress);
              }
            } else {
              // DESKTOP: Keep existing logic
              if (progress <= animationProgressTarget) {
                const overlapWords = 15;
                const totalAnimationLength = 1 + overlapWords / totalWords;
                const timelineScale =
                  1 /
                  Math.min(
                    totalAnimationLength,
                    1 +
                      (totalWords - 1) / totalWords +
                      overlapWords / totalWords
                  );

                const wordStart = index / totalWords;
                const wordEnd = wordStart + overlapWords / totalWords;
                const adjustedStart = wordStart * timelineScale;
                const adjustedEnd = wordEnd * timelineScale;
                const duration = adjustedEnd - adjustedStart;

                const wordProgress =
                  revealProgress <= adjustedStart
                    ? 0
                    : revealProgress >= adjustedEnd
                    ? 1
                    : (revealProgress - adjustedStart) / duration;

                const wordHighlightBgColor = "60, 60, 60";

                word.style.opacity = wordProgress;
                const backgroundFadeStart =
                  wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
                const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
                word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

                const textRevealThreshold = 0.9;
                const textRevealProgress =
                  wordProgress >= textRevealThreshold
                    ? (wordProgress - textRevealThreshold) /
                      (1 - textRevealThreshold)
                    : 0;
                wordText.style.opacity = Math.pow(textRevealProgress, 0.5);
              }
            }
          });
        },

        // MOBILE: Clean up after animation completes
        onComplete: () => {
          if (isMobile) {
            // Ensure all words are fully visible
            const words = container.querySelectorAll(
              ".portfolio-anime-text .word"
            );
            words.forEach((word) => {
              const wordText = word.querySelector("span");
              word.style.opacity = "1";
              word.style.backgroundColor = "transparent";
              wordText.style.opacity = "1";
            });

            // Small delay before allowing scroll to continue
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 500);
          }
        },
      });
    });
  },
};

// ===== CONTACT FORM SYSTEM =====
const ContactForm = {
  initialize() {
    const contactSection = document.querySelector(".contact-section");
    if (!contactSection) return;

    this.setupAnimations();
    this.setupFormHandling();
  },

  setupAnimations() {
    // Animate contact header
    ScrollTrigger.create({
      trigger: ".contact-header",
      start: "top 80%",
      onEnter: () => {
        this.animateHeader();
      },
    });

    // Animate contact info items
    ScrollTrigger.create({
      trigger: ".contact-info",
      start: "top 80%",
      onEnter: () => {
        this.animateContactInfo();
      },
    });

    // Animate contact form
    ScrollTrigger.create({
      trigger: ".contact-form-wrapper",
      start: "top 80%",
      onEnter: () => {
        this.animateForm();
      },
    });
  },

  animateHeader() {
    const title = document.querySelector(".contact-title h1");
    const subtitle = document.querySelector(".contact-subtitle p");

    if (title) {
      gsap.fromTo(
        title,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }

    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" }
      );
    }
  },

  animateContactInfo() {
    const infoItems = document.querySelectorAll(".info-item");
    const socialLinks = document.querySelectorAll(".social-link");

    gsap.to(infoItems, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });

    gsap.to(socialLinks, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.8,
      ease: "power3.out",
    });
  },

  animateForm() {
    const formWrapper = document.querySelector(".contact-form-wrapper");
    const labels = document.querySelectorAll(".form-group label");
    const inputs = document.querySelectorAll(
      ".form-group input, .form-group textarea"
    );
    const submitBtn = document.querySelector(".submit-btn");

    // Animate form wrapper
    gsap.to(formWrapper, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    });

    // Animate form elements
    gsap.to(labels, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.3,
      ease: "power3.out",
    });

    gsap.to(inputs, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.5,
      ease: "power3.out",
    });

    gsap.to(submitBtn, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay: 0.8,
      ease: "power3.out",
    });
  },

  setupFormHandling() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit(form);
    });

    // Add focus animations for form inputs
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        gsap.to(input.nextElementSibling, {
          width: "100%",
          duration: 0.4,
          ease: "power2.out",
        });
      });

      input.addEventListener("blur", () => {
        if (!input.value) {
          gsap.to(input.nextElementSibling, {
            width: "0%",
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });
    });
  },

  handleSubmit(form) {
    const submitBtn = form.querySelector(".submit-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnArrow = submitBtn.querySelector(".btn-arrow");

    // Animate button on submit
    gsap.to(submitBtn, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });

    // Change button text
    btnText.textContent = "Sending...";
    btnArrow.textContent = "⏳";

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      btnText.textContent = "Message Sent!";
      btnArrow.textContent = "✓";

      gsap.to(submitBtn, {
        backgroundColor: "#4CAF50",
        duration: 0.3,
        ease: "power2.out",
      });

      // Reset form after delay
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

  // Smooth scrub animation that follows scroll
  gsap.fromTo(
    stickySection,
    {
      x: "100%",
      opacity: 0,
    },
    {
      x: "0%",
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".portfolio-about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: 1, // Smooth follow scroll
        onUpdate: (self) => {
          if (self.progress > 0.5) {
            stickySection.classList.add("active");
          } else {
            stickySection.classList.remove("active");
          }
        },
      },
    }
  );
}

function slideInStickyCards() {
  const stickySection = document.querySelector(".sticky-cards-section");

  if (!stickySection) return;

  // Simple, clean animation without nested ScrollTriggers
  gsap.fromTo(
    stickySection,
    {
      x: "100%",
      opacity: 0,
    },
    {
      x: "0%",
      opacity: 1,
      duration: 1.5,
      ease: "power3.out",
      onStart: () => {
        stickySection.classList.add("active");
      },
      onComplete: () => {
        // Refresh ScrollTrigger after animation completes
        ScrollTrigger.refresh();
      },
    }
  );
}

function cleanupScrollTriggers() {
  // Refresh all ScrollTriggers when window resizes
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });

  // Clean up any stale ScrollTriggers
  ScrollTrigger.addEventListener("refresh", () => {
    // Force repaint to prevent white screen
    document.body.style.transform = "translateZ(0)";
    requestAnimationFrame(() => {
      document.body.style.transform = "";
    });
  });
}

function enhanceMobileTextAnimation() {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    const containers = document.querySelectorAll(
      ".portfolio-anime-text-container"
    );

    containers.forEach((container) => {
      let animationComplete = false;

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",

        onEnter: () => {
          animationComplete = false;

          // Monitor animation progress
          const checkAnimationComplete = setInterval(() => {
            const words = container.querySelectorAll(
              ".portfolio-anime-text .word"
            );
            const visibleWords = Array.from(words).filter(
              (word) => parseFloat(word.style.opacity) > 0.9
            );

            // Animation is complete when 90% of words are visible
            if (visibleWords.length >= words.length * 0.9) {
              animationComplete = true;
              clearInterval(checkAnimationComplete);
            }
          }, 100);
        },

        onLeave: () => {
          if (!animationComplete) {
            // If user tries to scroll away before animation completes,
            // scroll back to the section
            lenis ? lenis.scrollTo(container) : container.scrollIntoView();
          }
        },
      });
    });
  }
}

function optimizeScrollTriggerForMobile() {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Configure ScrollTrigger for mobile
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    // Prevent overflow issues
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    // Handle mobile viewport changes
    window.addEventListener("resize", () => {
      clearTimeout(window.mobileResizeTimer);
      window.mobileResizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });
  }
}

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
  PortfolioAbout,
};
