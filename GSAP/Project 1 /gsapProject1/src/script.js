import { setupMarqueeAnimation } from "./marquee.js";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const cards = gsap.utils.toArray(".card");
  const introCard = cards[0];

  // Fixed title selection and animation setup
  const titles = gsap.utils.toArray(".card-title h1");
  titles.forEach((title) => {
    const split = new SplitText(title, {
      type: "chars",
      charsClass: "char",
    });

    // Wrap each character in a span and set initial position
    split.chars.forEach((char) => {
      char.innerHTML = `<span>${char.textContent}</span>`;
      // Set initial position for animation
      gsap.set(char.querySelector("span"), { x: "100%" });
    });
  });

  const cardImgWrapper = introCard.querySelector(".card-img");
  const cardImg = introCard.querySelector(".card-img img");
  gsap.set(cardImgWrapper, { scale: 0.5, borderRadius: "400px" });
  gsap.set(cardImg, { scale: 1.5 });

  function animateContentIn(titleChars, description) {
    gsap.to(titleChars, {
      x: "0%",
      duration: 0.75,
      ease: "power4.out",
      stagger: 0.02,
    });
    gsap.to(description, {
      x: 0,
      opacity: 1,
      duration: 0.75,
      delay: 0.1,
      ease: "power4.out",
    });
  }

  function animateContentOut(titleChars, description) {
    gsap.to(titleChars, {
      x: "100%",
      duration: 0.55,
      ease: "power4.out",
      stagger: 0.01,
    });
    gsap.to(description, {
      x: "40px",
      opacity: 0,
      duration: 0.5,
      delay: 0.1,
      ease: "power4.out",
    });
  }

  const marquee = introCard.querySelector(".card-marquee .marquee");
  const titleChars = introCard.querySelectorAll(".char span");
  const description = introCard.querySelector(".card-description");

  // Set initial states
  gsap.set(description, { x: "40px", opacity: 0 });

  // First card (intro card) with special scroll animation
  ScrollTrigger.create({
    trigger: introCard,
    start: "top top",
    end: "+=300vh",
    pin: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const imageScale = 0.5 + progress * 0.5;
      const borderRadius = 400 - progress * 375;
      const innerImgScale = 1.5 - progress * 0.5;

      gsap.set(cardImgWrapper, {
        scale: imageScale,
        borderRadius: borderRadius + "px",
      });
      gsap.set(cardImg, { scale: innerImgScale });

      // Marquee fade logic
      if (imageScale >= 0.5 && imageScale <= 0.75) {
        const fadeProgress = (imageScale - 0.5) / (0.75 - 0.5);
        gsap.set(marquee, { opacity: 1 - fadeProgress });
      } else if (imageScale < 0.5) {
        gsap.set(marquee, { opacity: 1 });
      } else if (imageScale > 0.75) {
        gsap.set(marquee, { opacity: 0 });
      }

      // Content reveal logic
      if (progress >= 1 && !introCard.contentRevealed) {
        introCard.contentRevealed = true;
        animateContentIn(titleChars, description);
      }
      if (progress < 1 && introCard.contentRevealed) {
        introCard.contentRevealed = false;
        animateContentOut(titleChars, description);
      }
    },
  });

  // Other cards with standard pinning
  cards.forEach((card, index) => {
    // Skip the first card since it already has its own ScrollTrigger
    if (index === 0) return;

    const isLastCard = index === cards.length - 1;

    ScrollTrigger.create({
      trigger: card,
      start: "top top",
      end: isLastCard ? "+=100vh" : "bottom top",
      pin: true,
      pinSpacing: isLastCard,
    });
  });

  // Card wrapper scaling animation (entrance effect)
  cards.forEach((card, index) => {
    if (index < cards.length - 1) {
      const cardWrapper = card.querySelector(".card-wrapper");
      if (cardWrapper) {
        ScrollTrigger.create({
          trigger: cards[index + 1], // Fixed: use next card as trigger
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(cardWrapper, {
              scale: 1 - progress * 0.25,
              opacity: 1 - progress,
            });
          },
        });
      }
    }
  });

  // Card image scaling animation (zoom effect on scroll)
  cards.forEach((card, index) => {
    if (index > 0) {
      const cardImg = card.querySelector(".card-img img");
      const imgContainer = card.querySelector(".card-img");

      if (cardImg && imgContainer) {
        // Set initial states
        gsap.set(cardImg, { scale: 2 });
        gsap.set(imgContainer, { borderRadius: "150px" });

        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(cardImg, { scale: 2 - progress });
            gsap.set(imgContainer, {
              borderRadius: 150 - progress * 125 + "px",
            });
          },
        });
      }
    }
  });

  // Content animation for other cards
  cards.forEach((card, index) => {
    if (index === 0) return;

    const cardDescription = card.querySelector(".card-description");
    const cardTitleChars = card.querySelectorAll(".char span"); // Fixed: querySelectorAll

    if (cardDescription && cardTitleChars.length > 0) {
      // Set initial states
      gsap.set(cardDescription, { x: "40px", opacity: 0 });

      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        onEnter: () => animateContentIn(cardTitleChars, cardDescription),
        onLeaveBack: () => animateContentOut(cardTitleChars, cardDescription),
      });
    }
  });

  // Setup marquee animation if needed
  if (typeof setupMarqueeAnimation === "function") {
    setupMarqueeAnimation();
  }
});
