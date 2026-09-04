/* ============================================================
   ABOUT SECTION — scroll-driven timeline
   ============================================================
   Phase 0 (0vh)      : hero at rest, centred, headlines full strength
   Phase 1 (scrolling) : bottle zooms in + shifts right,
                         intro panel (tagline + paragraph) fades/slides in
   Phase 2 (continued) : bottle zooms back out + shifts left,
                         intro panel exits, gallery reveals on the right

   Only #bottleWrap is transformed — never the <video> element itself,
   so its native autoplay/loop keeps running untouched throughout.
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const bottleWrap  = document.getElementById("bottleWrap");
const introPanel  = document.getElementById("introPanel");
const gallery     = document.getElementById("gallery");
const photos      = gallery.querySelectorAll(".about__photo");
const frontLine   = document.getElementById("frontLine");
const backWord    = document.getElementById("backWord");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  // Skip the scroll choreography entirely and land on a settled,
  // fully-visible composition (see the matching CSS media query).
  gsap.set([introPanel, photos], { opacity: 1 });
} else {
  buildScrollTimeline();
}

function buildScrollTimeline() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top top",
      end: "+=250%",
      scrub: 1,          // ties timeline progress directly to scroll position
      pin: "#aboutPin",
      anticipatePin: 1,
    },
  });

  // --- Phase 1: zoom in, shift right, bring in the intro copy -------
  tl.addLabel("phase1")
    .to(bottleWrap, { scale: 1.35, x: "26vw", ease: "none", duration: 1 }, "phase1")
    .to(frontLine,  { opacity: 0.12, ease: "none", duration: 0.6 }, "phase1")
    .to(backWord,   { opacity: 0.18, ease: "none", duration: 0.6 }, "phase1")
    .to(introPanel, { opacity: 1, ease: "none", duration: 0.6 }, "phase1+=0.25")

  // --- Phase 2: zoom back out, shift left, reveal the gallery -------
    .addLabel("phase2", "phase1+=1")
    .to(introPanel, { opacity: 0, ease: "none", duration: 0.3 }, "phase2")
    .to(bottleWrap, { scale: 1, x: "-22vw", ease: "none", duration: 1 }, "phase2")
    .to(
      photos,
      { opacity: 1, ease: "none", duration: 0.6, stagger: 0.15 },
      "phase2+=0.3"
    );
}
