import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(Flip, SplitText);

// Global variables
let isOpen = false;
let isAnimating = false;
let loadingComplete = false;

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
  const textElements = document.querySelectorAll("h1, h2, p, a");
  textElements.forEach((element) => {
    // Skip menu elements during initial setup
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

// Create counter digits for loading animation
const createCounterDigits = () => {
  const counter1 = document.querySelector(".counter-1");
  const num0 = document.createElement("div");
  num0.className = "num";
  num0.textContent = "0";
  counter1.appendChild(num0);

  const num1 = document.createElement("div");
  num1.className = "num num1offset1";
  num1.textContent = "1";
  counter1.appendChild(num1);

  const counter2 = document.querySelector(".counter-2");
  for (let i = 0; i <= 10; i++) {
    const numDiv = document.createElement("div");
    numDiv.className = i === 1 ? "num num1offset2" : "num";
    numDiv.textContent = i === 10 ? "0" : i;
    counter2.appendChild(numDiv);
  }

  const counter3 = document.querySelector(".counter-3");
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
};

// Animate counter digits
const animateCounter = (counter, duration, delay = 0) => {
  const numHeight = counter.querySelector(".num").clientHeight;
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
  images.forEach((img) => {
    img.classList.remove("animate-out");
  });

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
      .to(
        img,
        {
          scale: 2.5,
          duration: 0.45,
          ease: "power3.in",
        },
        0.025
      )
      .to(
        img,
        {
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
        },
        0.5
      );

    mainTimeline.add(scaleTimeline, index * 0.1);
  });

  return mainTimeline;
}

// Burger menu animation function
function animateBurgerMenu(isOpening) {
  if (isOpening) {
    menuToggle.classList.add("open");
    body.classList.add("menu-open"); // Disable scrolling
  } else {
    menuToggle.classList.remove("open");
    body.classList.remove("menu-open"); // Enable scrolling
  }
}

// Open menu function
function openMenu() {
  if (isAnimating || isOpen || !loadingComplete) return;
  isAnimating = true;

  // Add open classes
  menuOverlay.classList.add("open");
  menuContent.classList.add("open");
  container.classList.add("menu-open");

  // Animate burger menu
  animateBurgerMenu(true);

  // Animate container transformation
  gsap.to(container, {
    duration: 1.25,
    ease: "power4.inOut",
  });

  // Animate menu content
  gsap.to(menuContent, {
    duration: 1.25,
    ease: "power4.inOut",
  });

  // Animate menu links and social links
  gsap.to([".link a", ".social a"], {
    y: "0%",
    opacity: 1,
    duration: 1,
    delay: 0.75,
    stagger: 0.1,
    ease: "power3.out",
  });

  // Animate menu overlay
  gsap.to(menuOverlay, {
    duration: 1.25,
    ease: "power4.inOut",
    onComplete: () => {
      isOpen = true;
      isAnimating = false;
    },
  });
}

// Close menu function
function closeMenu() {
  if (isAnimating || !isOpen) return;
  isAnimating = true;

  // Remove open classes
  menuOverlay.classList.remove("open");
  menuContent.classList.remove("open");
  container.classList.remove("menu-open");

  // Animate burger menu
  animateBurgerMenu(false);

  // Animate container back to normal
  gsap.to(container, {
    duration: 1.25,
    ease: "power4.inOut",
  });

  // Animate menu content
  gsap.to(menuContent, {
    duration: 1.25,
    ease: "power4.inOut",
  });

  // Animate menu overlay
  gsap.to(menuOverlay, {
    duration: 1.25,
    ease: "power4.inOut",
    onComplete: () => {
      isOpen = false;
      isAnimating = false;
      // Reset menu links
      gsap.set([".link a", ".social a"], { y: "120%", opacity: 0.25 });
      resetPreviewImage();
    },
  });
}

// Reset preview image to default
function resetPreviewImage() {
  if (!menuPreviewImg) return;

  menuPreviewImg.innerHTML = "";
  const defaultPreviewImg = document.createElement("img");
  defaultPreviewImg.src = "/img-1.png";
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
  const scrollY = window.scrollY;

  if (scrollY > 50 && !isOpen) {
    mainNav.classList.add("scrolled");
  } else {
    mainNav.classList.remove("scrolled");
  }
}

// Initialize loading sequence
function initLoadingSequence() {
  // Ensure page starts in proper loading state
  body.classList.remove("loaded");
  body.classList.remove("menu-open");
  loadingComplete = false;

  // Reset all elements to initial state
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

  // Start counter animations
  animateCounter(document.querySelector(".counter-3"), 2.5);
  animateCounter(document.querySelector(".counter-2"), 3);
  animateCounter(document.querySelector(".counter-1"), 2, 1.5);

  // Main loading timeline
  const loadingTimeline = gsap.timeline();

  // Background loader animation
  loadingTimeline.to(".hero-bg", {
    scaleY: "100%",
    duration: 3,
    ease: "power2.inOut",
    delay: 0.25,
  });

  // Images scale in
  loadingTimeline.to(
    ".img",
    {
      scale: 1,
      duration: 1,
      stagger: 0.125,
      ease: "power3.out",
    },
    "<"
  );

  // Counter fade out and trigger image animation
  loadingTimeline.to(".counter", {
    opacity: 0,
    duration: 0.3,
    ease: "power3.out",
    delay: 0.3,
    onStart: () => {
      animateImages();
    },
    onComplete: () => {
      // Hide counter completely after loading
      gsap.set(".counter", { display: "none" });
    },
  });

  // UI elements reveal
  loadingTimeline.to(".sidebar .divider", {
    scaleY: "100%",
    duration: 1,
    ease: "power3.inOut",
    delay: 1.25,
  });

  loadingTimeline.to([".main-nav .divider", ".site-info .divider"], {
    scaleX: "100%",
    duration: 1,
    stagger: 0.5,
    ease: "power3.inOut",
  });

  loadingTimeline.to(
    ".sidebar .logo",
    {
      scale: 1,
      duration: 1,
      ease: "power4.inOut",
    },
    "<"
  );

  // Text animations
  loadingTimeline.to(
    [".nav-left .logo-name a span", ".nav-center .nav-links a span"],
    {
      y: "0%",
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
    }
  );

  loadingTimeline.to(
    [".header span", ".site-info span", ".hero-footer span"],
    {
      y: "0%",
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
      onComplete: () => {
        loadingComplete = true;
        body.classList.add("loaded"); // Enable scrolling and show demo section
      },
    },
    "<"
  );
}

// Force page to start from top on refresh
window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

// Ensure proper initialization on page load/refresh
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  body.classList.remove("loaded");
  body.classList.remove("menu-open");
});

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initialize loading sequence
  initLoadingSequence();

  // Initialize preview image
  resetPreviewImage();

  // Menu toggle event listener
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (!loadingComplete || isAnimating) return;

      if (!isOpen) {
        openMenu();
      } else {
        closeMenu();
      }
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
        ) {
          return;
        }

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

  // Scroll event for navigation background
  window.addEventListener("scroll", handleNavScroll);

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      closeMenu();
    }
  });

  // Prevent scroll when menu is open (additional safety)
  document.addEventListener(
    "wheel",
    (e) => {
      if (isOpen) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // Handle window resize
  window.addEventListener("resize", () => {
    if (isOpen && window.innerWidth <= 768) {
      // Adjust menu for mobile if needed
      gsap.set(container, { clearProps: "all" });
    }
  });

  // Prevent context menu on burger menu (optional UX improvement)
  if (menuToggle) {
    menuToggle.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
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
};
