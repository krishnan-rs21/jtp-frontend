import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AwardsSection from "./components/AwardsSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import ExpertiseSection from "./components/ExpertiseSection.jsx";
import IntroSection from "./components/IntroSection.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ProjectSection from "./components/ProjectSection.jsx";
import SideRail from "./components/SideRail.jsx";
import content from "./data/content.json";

gsap.registerPlugin(ScrollTrigger);

const projects = content.projects;
export default function App() {
  const appRef = useRef(null);
  const projectRefs = useRef([]);
  const railProgressRef = useRef(null);
  const railMarkersRef = useRef(null);
  const railLabelRef = useRef(null);
  const railCounterRef = useRef(null);
  const activeProjectRef = useRef(0);
  const [activeProject, setActiveProject] = useState(0);
  const [activeAward, setActiveAward] = useState(0);
  const [loaderPhase, setLoaderPhase] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    let exitTimer;
    const images = [...appRef.current.querySelectorAll("img")];
    const imageLoads = images.map(
      (image) =>
        new Promise((resolve) => {
          const finish = (failed) => {
            image.removeEventListener("load", onLoad);
            image.removeEventListener("error", onError);
            if (failed) {
              console.error("Failed to load page image:", image.currentSrc || image.src);
            }
            resolve();
          };
          const onLoad = () => finish(false);
          const onError = () => finish(true);

          if (image.complete) {
            finish(image.naturalWidth === 0);
            return;
          }

          image.addEventListener("load", onLoad, { once: true });
          image.addEventListener("error", onError, { once: true });
        }),
    );
    const minimumDuration = new Promise((resolve) => {
      window.setTimeout(resolve, 5000);
    });

    Promise.all([Promise.all(imageLoads), document.fonts.ready, minimumDuration])
      .then(() => {
        if (cancelled) return;
        setLoaderPhase("exiting");
        exitTimer = window.setTimeout(() => {
          if (!cancelled) setLoaderPhase("hidden");
        }, 700);
      })
      .catch((error) => {
        console.error("Failed while preparing the initial loading screen:", error);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(exitTimer);
    };
  }, []);

  const navigateTo = (index) => {
    projectRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const navigateToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useLayoutEffect(() => {
    let updateRailMarker = () => {};
    let revealSections = () => {};
    let railResizeObserver;
    const mobileBreakpoint = window.matchMedia("(max-width: 600px)");
    const sectionRevealTimelines = [];
    const context = gsap.context(() => {
      gsap.from(".side-rail", {
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
      });

      const firstProjectImage = appRef.current.querySelector(".project-image");
      const firstProjectTitle = appRef.current.querySelector(".project-title");
      const firstProjectTags = appRef.current.querySelectorAll(
        ".project-tags span",
      );
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          firstProjectImage,
          { scale: 1.045 },
          { scale: 1, duration: 1.5 },
          0,
        )
        .fromTo(
          firstProjectTitle,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.8 },
          0.3,
        )
        .fromTo(
          firstProjectTags,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.7,
            stagger: 0.16,
          },
          0.95,
        );

      updateRailMarker = () => {
        const marker = railProgressRef.current;
        const rail = marker?.parentElement;
        const markers = railMarkersRef.current;
        const ticks = markers?.querySelectorAll(".rail-tick");
        if (!marker || !rail || !markers || !ticks?.length) return;

        const destinations = content.projectNavigation.destinations;
        const currentIndex = destinations.reduce((activeIndex, destination, index) => {
          const section = document.getElementById(destination.target);
          if (
            section &&
            section.getBoundingClientRect().top <= window.innerHeight * 0.25
          ) {
            return index;
          }
          return activeIndex;
        }, 0);
        if (currentIndex !== activeProjectRef.current) {
          activeProjectRef.current = currentIndex;
          setActiveProject(currentIndex);
        }

        const railRect = rail.getBoundingClientRect();
        const isMobile = window.matchMedia("(max-width: 600px)").matches;
        const activeTickIndex = currentIndex;
        const activeTickRect = ticks[activeTickIndex].getBoundingClientRect();
        if (isMobile) {
          marker.style.top = "";
          marker.style.left = `${
            activeTickRect.left +
            activeTickRect.width / 2 -
            railRect.left -
            marker.offsetWidth / 2
          }px`;
        } else {
          marker.style.left = "";
          marker.style.top = `${
            activeTickRect.top +
            activeTickRect.height / 2 -
            railRect.top -
            marker.offsetHeight / 2
          }px`;
        }
        revealSections();
      };

      window.addEventListener("scroll", updateRailMarker, { passive: true });
      window.addEventListener("resize", updateRailMarker);
      mobileBreakpoint.addEventListener("change", updateRailMarker);
      ScrollTrigger.addEventListener("update", updateRailMarker);
      ScrollTrigger.addEventListener("refresh", updateRailMarker);
      railResizeObserver = new ResizeObserver(updateRailMarker);
      railResizeObserver.observe(railMarkersRef.current);
      railResizeObserver.observe(railMarkersRef.current.parentElement);
      updateRailMarker();

      gsap.utils.toArray(".project").forEach((section) => {
        const title = section.querySelector(".project-title");
        const tags = section.querySelector(".project-tags");
        const detail = section.querySelector(".project-detail");
        const detailShade = section.querySelector(".project-detail-shade");
        const detailTitle = detail.querySelector(".detail-title");
        const projectFacts = detail.querySelector(".project-facts");
        const factColumns = projectFacts.querySelectorAll("p");
        const description = detail.querySelector(".detail-description");

        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.6,
          },
        });
        reveal
          .fromTo(
            detailShade,
            { opacity: 0, immediateRender: false },
            { opacity: 1, ease: "none" },
            0.2,
          )
          .fromTo(
            title,
            { y: 0, opacity: 1, immediateRender: false },
            { y: -24, opacity: 0, ease: "none" },
            0.08,
          )
          .fromTo(
            tags,
            { y: 0, opacity: 1, immediateRender: false },
            { y: -12, opacity: 0, ease: "none" },
            0.2,
          )
          .fromTo(
            detail,
            { y: 44, opacity: 0 },
            { y: 0, opacity: 1, ease: "none" },
            0.26,
          )
          .fromTo(
            detailTitle,
            { y: 24, opacity: 0, immediateRender: false },
            { y: 0, opacity: 1, ease: "none" },
            0.34,
          )
          .fromTo(
            factColumns,
            { y: 20, opacity: 0, immediateRender: false },
            { y: 0, opacity: 1, stagger: 0.08, ease: "none" },
            0.43,
          )
          .fromTo(
            projectFacts,
            { clipPath: "inset(0 0 100% 0)", immediateRender: false },
            { clipPath: "inset(0 0 0% 0)", ease: "none" },
            0.43,
          )
          .fromTo(
            description,
            { y: 24, opacity: 0, immediateRender: false },
            { y: 0, opacity: 1, ease: "none" },
            0.56,
          );
      });

      const sectionAnimations = [
        {
          section: ".intro-section",
          elements: [
            [".section-index", { y: 14, opacity: 0 }],
            [".intro-heading h2", { y: 36, opacity: 0 }],
            [".intro-copy > p", { y: 24, opacity: 0 }],
            [".intro-copy .plus-link", { y: 16, opacity: 0 }],
          ],
        },
        {
          section: ".expertise-section",
          elements: [
            [".expertise-section > h2", { y: 30, opacity: 0 }],
            [".expertise-category", { y: 12, opacity: 0 }],
            [".expertise-copy", { x: -24, opacity: 0 }],
            [".expertise-image-wrap", { clipPath: "inset(0 0 0 100%)" }],
          ],
        },
        {
          section: ".awards-section",
          elements: [
            [".awards-heading > *", { y: 24, opacity: 0, stagger: 0.12 }],
            [".award-pagination", { y: 18, opacity: 0 }],
            [".award-visual", { y: 36, opacity: 0 }],
            [".award-story", { x: 28, opacity: 0 }],
          ],
        },
        {
          section: ".contact-section",
          elements: [
            [".contact-section > h2", { y: 28, opacity: 0 }],
            [".contact-topline", { y: 24, opacity: 0 }],
            [".office-details", { y: 18, opacity: 0 }],
          ],
        },
      ];

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const sectionElements = new Map();
        sectionAnimations.forEach(({ section: selector, elements }) => {
          const section = appRef.current.querySelector(selector);
          if (!section) return;

          const groups = [];
          elements.forEach(([elementSelector, from], index) => {
            const { stagger, ...fromVars } = from;
            const targets = section.querySelectorAll(elementSelector);
            if (!targets.length) return;

            gsap.set(targets, fromVars);
            groups.push({ targets, stagger, position: index * 0.2 });
          });

          sectionElements.set(section, groups);
        });

        const revealedSections = new Set();
        revealSections = () => {
          sectionElements.forEach((groups, section) => {
            if (revealedSections.has(section)) return;
            const bounds = section.getBoundingClientRect();
            if (
              bounds.top > window.innerHeight * 0.6 ||
              bounds.bottom <= 0
            ) {
              return;
            }

            const reveal = gsap.timeline();
            groups.forEach(({ targets, stagger, position }) => {
              reveal.to(
                targets,
                {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  clipPath: "inset(0 0 0 0)",
                  duration: 1.15,
                  stagger,
                  ease: "power3.out",
                },
                position,
              );
            });
            sectionRevealTimelines.push(reveal);
            revealedSections.add(section);
          });
        };
        window.addEventListener("scroll", revealSections, { passive: true });
        window.addEventListener("resize", revealSections);
        revealSections();
      }

      ScrollTrigger.refresh();
    }, appRef);

    return () => {
      window.removeEventListener("scroll", updateRailMarker);
      window.removeEventListener("resize", updateRailMarker);
      mobileBreakpoint.removeEventListener("change", updateRailMarker);
      window.removeEventListener("scroll", revealSections);
      window.removeEventListener("resize", revealSections);
      ScrollTrigger.removeEventListener("update", updateRailMarker);
      ScrollTrigger.removeEventListener("refresh", updateRailMarker);
      railResizeObserver?.disconnect();
      sectionRevealTimelines.forEach((timeline) => timeline.kill());
      context.revert();
    };
  }, []);

  return (
    <>
      {loaderPhase !== "hidden" && (
        <LoadingScreen
          brand={content.loader.brand}
          message={content.loader.message}
          phase={loaderPhase}
        />
      )}
      <main className="portfolio" ref={appRef}>
        <SideRail
        activeProject={activeProject}
        ariaLabel={content.projectNavigation.ariaLabel}
        counterRef={railCounterRef}
        label={content.projectNavigation.label}
        labelRef={railLabelRef}
        markersRef={railMarkersRef}
        navigateToSection={navigateToSection}
        progressRef={railProgressRef}
        destinations={content.projectNavigation.destinations}
        destinationLabel={content.projectNavigation.destinationLabel}
        counterLabel={content.projectNavigation.counterLabel}
        />

        <div className="project-list">
          {projects.map((project, index) => (
            <div
              ref={(element) => {
                projectRefs.current[index] = element;
              }}
              key={project.number}
            >
              <ProjectSection
                project={project}
                index={index}
                labels={content.labels}
              />
            </div>
          ))}
        </div>

        <IntroSection content={content.intro} />
        <ExpertiseSection content={content.expertise} />
        <AwardsSection
          activeAward={activeAward}
          content={content.awards}
          onAwardChange={setActiveAward}
        />
        <ContactSection content={content.contact} />
      </main>
    </>
  );
}
