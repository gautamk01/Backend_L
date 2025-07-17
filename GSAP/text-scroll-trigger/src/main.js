import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const animeTextContainers = document.querySelectorAll(
    ".anime-text-container"
  );

  animeTextContainers.forEach((container) => {
    const imageContainer = container.querySelector(".image-container");
    const paragraphs = container.querySelectorAll(".anime-text p");

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

    // Create the ScrollTrigger for the pinned content animation
    ScrollTrigger.create({
      trigger: container,
      // === THIS IS THE CRITICAL FIX ===
      // We are now pinning the entire container (the trigger itself).
      // This ensures the title and the content box are locked together.
      pin: true,
      // ===============================
      start: "top top",
      end: `+=${window.innerHeight * 4}`,
      pinSpacing: true, // Adds padding to the bottom of the pinned element to push the next section down
      onUpdate: (self) => {
        const progress = self.progress;
        const words = Array.from(
          container.querySelectorAll(".anime-text .word")
        );
        const totalWords = words.length;
        const animationProgressTarget = 0.7;
        const revealProgress = Math.min(1, progress / animationProgressTarget);

        if (imageContainer) {
          gsap.set(imageContainer, {
            clipPath: `inset(${(1 - revealProgress) * 100}% 0 0 0)`,
          });
        }

        words.forEach((word, index) => {
          const wordText = word.querySelector("span");
          if (progress <= animationProgressTarget) {
            const overlapWords = 15;
            const totalAnimationLength = 1 + overlapWords / totalWords;
            const timelineScale =
              1 /
              Math.min(
                totalAnimationLength,
                1 + (totalWords - 1) / totalWords + overlapWords / totalWords
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
        });
      },
    });
  });
});
