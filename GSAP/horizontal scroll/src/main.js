import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger before using it
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const stickySection = document.querySelector(".sticky");
  const stickyHeader = document.querySelector(".sticky-header");
  const cards = document.querySelectorAll(".card");
  const stickyHeight = window.innerHeight * 5;

  // hold the vertical position and rotation value
  const transform = [
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
  ];

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

      cards.forEach((cards, index) => {
        const delay = index * 0.1125;
        const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));

        if (cardProgress > 0) {
          const cardStartx = 25;
          const cardEndx = -650;
          const ypos = transform[index][0];
          const rotation = transform[index][1];

          const cardx = gsap.utils.interpolate(
            cardStartx,
            cardEndx,
            cardProgress
          );

          const yprogress = cardProgress * 3;
          const yIndex = Math.min(Math.floor(yprogress), ypos.length - 2);
          const yinterpolation = yprogress - yIndex;
          const cardY = gsap.utils.interpolate(
            ypos[yIndex],
            ypos[yIndex + 1],
            yinterpolation
          );

          const cardRotation = gsap.utils.interpolate(
            rotation[yIndex],
            rotation[yIndex + 1],
            yinterpolation
          );

          gsap.set(cards, {
            xPercent: cardx,
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
});
