import gsap from "gsap";

export function setupMarqueeAnimation() {
  const marqueeItems = gsap.utils.toArray(".marquee h1");
  if (marqueeItems.length > 0) {
    const marqueeTimeline = horizontalLoop(marqueeItems, {
      repeat: -1,
      paddingRight: 30,
      speed: 1,
    });

    // Setup scroll direction detection
    setupScrollDirectionControl(marqueeTimeline);
  }
}

function setupScrollDirectionControl(timeline) {
  let lastScrollY = window.scrollY;
  let scrollDirection = -1; // -1 for initial left to right, 1 for right to left when scrolling down
  let ticking = false;

  function updateMarqueeDirection() {
    const currentScrollY = window.scrollY;
    const newDirection = currentScrollY > lastScrollY ? 1 : -1;

    // Only update if direction actually changed
    if (newDirection !== scrollDirection) {
      scrollDirection = newDirection;

      // Smoothly transition to new direction
      gsap.to(timeline, {
        timeScale: scrollDirection,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateMarqueeDirection);
      ticking = true;
    }
  }

  // Add scroll event listener
  window.addEventListener("scroll", onScroll, { passive: true });

  // Set initial direction (left to right by default)
  timeline.timeScale(-1);

  // Return cleanup function
  return () => {
    window.removeEventListener("scroll", onScroll);
  };
}

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};

  const tl = gsap.timeline({
    repeat: config.repeat,
    defaults: { ease: "none" },
  });

  const length = items.length;
  const width = [];
  const xPercents = [];
  const pixelsPerSecond = (config.speed || 1) * 100;
  let totalWidth;

  // Set initial positions
  gsap.set(items, {
    xPercent: (i, el) => {
      let w = (width[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      let x = parseFloat(gsap.getProperty(el, "x", "px")) || 0;
      xPercents[i] = (x / w) * 100 + (gsap.getProperty(el, "xPercent") || 0);
      return xPercents[i];
    },
  });

  gsap.set(items, { x: 0 });

  // Calculate total width
  totalWidth =
    items[length - 1].offsetLeft +
    width[length - 1] * gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);

  const startX = items[0].offsetLeft;

  // Create loop animation for each item
  for (let i = 0; i < length; i++) {
    const item = items[i];
    const curX = (xPercents[i] / 100) * width[i];
    const distanceToStart = item.offsetLeft - startX;
    const distanceToLoop =
      distanceToStart + width[i] * gsap.getProperty(item, "scaleX");

    // Move from current position to loop start
    tl.to(
      item,
      {
        xPercent: ((curX - distanceToLoop) / width[i]) * 100,
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    ).fromTo(
      item,
      {
        xPercent: ((curX - distanceToLoop + totalWidth) / width[i]) * 100,
      },
      {
        xPercent: xPercents[i],
        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
        immediateRender: false,
      },
      distanceToLoop / pixelsPerSecond
    );
  }

  // Initialize timeline
  tl.progress(1, true).progress(0, true);

  return tl;
}
