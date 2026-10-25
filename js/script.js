"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lenis Smooth Scrolling (CivicResolve Architecture)
  let lenis = null;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof window.Lenis !== "undefined" && !prefersReducedMotion) {
    lenis = new window.Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Smooth scroll helper function
  function scrollToTarget(target) {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.2, offset: -20 });
    } else {
      el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  }

  // Intercept in-page hash navigation for smooth momentum scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href && href !== "#") {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          scrollToTarget(targetEl);
          history.pushState(null, "", href);
        }
      }
    });
  });

  // 2. IntersectionObserver for Scroll-Reveal System (CivicResolve Physics)
  const revealTargets = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible", "visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible", "visible"));
  }

  // 3. Global Top Scroll Progress Scrubber & Cinematic Track HUD
  const progressBar = document.querySelector("#scroll-progress");
  const trackCounter = document.querySelector(".cinematic-track .active-sec-num");
  const trackFill = document.querySelector(".cinematic-progress-fill");
  const trackDots = document.querySelectorAll(".track-dot");

  const sections = [
    { id: "home", num: "01" },
    { id: "about", num: "02" },
    { id: "skills", num: "03" },
    { id: "projects", num: "04" },
    { id: "contact", num: "05" },
  ];

  const ringOuter = document.querySelector(".visual-ring-outer");
  const ringInner = document.querySelector(".visual-ring-inner");
  const speedLines = document.querySelectorAll(".speed-lines span");
  const ambientOne = document.querySelector(".ambient-one");
  const ambientTwo = document.querySelector(".ambient-two");

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

    // Top progress bar width
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    // Determine active section for Cinematic HUD Tracker
    let activeIndex = 0;
    const scrollMiddle = scrollY + window.innerHeight * 0.35;

    sections.forEach((sec, idx) => {
      const el = document.getElementById(sec.id);
      if (el) {
        const top = el.offsetTop;
        if (scrollMiddle >= top) {
          activeIndex = idx;
        }
      }
    });

    if (trackCounter) {
      trackCounter.textContent = sections[activeIndex].num;
    }

    if (trackFill) {
      const fillHeight = sections.length > 1 ? (activeIndex / (sections.length - 1)) * 100 : 0;
      trackFill.style.height = `${fillHeight}%`;
    }

    trackDots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    // Parallax scrubbing for racing emblem and ambient glow
    if (!prefersReducedMotion && scrollY < window.innerHeight * 1.5) {
      const angle = scrollY * 0.15;
      if (ringOuter) ringOuter.style.transform = `rotate(${angle}deg)`;
      if (ringInner) ringInner.style.transform = `rotate(${-angle * 1.4}deg)`;

      speedLines.forEach((line, i) => {
        const offset = (scrollY * 0.08 * (i + 1)) % 30;
        line.style.transform = `translateX(${offset}px)`;
      });

      if (ambientOne) ambientOne.style.transform = `translateY(${scrollY * 0.12}px)`;
      if (ambientTwo) ambientTwo.style.transform = `translateY(${-scrollY * 0.08}px)`;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Cinematic Track Dot clicks
  trackDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetSelector = dot.getAttribute("data-target");
      if (targetSelector) {
        scrollToTarget(targetSelector);
      }
    });
  });

  // 4. Mobile Navigation
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      menuButton.setAttribute(
        "aria-label",
        isExpanded ? "Open navigation menu" : "Close navigation menu"
      );
      mobileNav.hidden = isExpanded;
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        mobileNav.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }
});
