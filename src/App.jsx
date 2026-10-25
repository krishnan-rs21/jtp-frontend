import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    number: "01",
    total: "04",
    title: "Hilton Marjan Island Beach\nresort & Spa",
    status: "Completed",
    client: "MR Properties",
    type: "5 Star Hilton Hotel & Branded Residences",
    description:
      "Perched on the captivating Al Marjan Island, the Hilton 5-star hotel masterfully balances serene beach front luxury with the thrilling allure of a vibrant casino. Nestled beside the existing Hampton by Hilton Al Marjan Island, this architectural marvel offers guests and residents an unparalleled experience that fuses relaxation and entertainment.",
    image: "/images/hilton-marjan-hero.jpg",
    alt: "Hilton Marjan Island resort at sunset",
    color: "warm",
  },
];

function Project({ project, index }) {
  const id = `project-${index + 1}`;

  return (
    <section
      className={`project project--${project.color}`}
      id={id}
      aria-label={`${project.title.replace("\n", " ")} project`}
    >
      <div className="project-stage">
        <div className="project-image-wrap" aria-hidden="true">
          <img className="project-image" src={project.image} alt="" />
        </div>
        <div className="image-shade" aria-hidden="true" />
        <div className="project-detail-shade" aria-hidden="true" />
        <div className="project-copy">
          <div className="project-intro">
            <h1 className="project-title">{project.title}</h1>
            <div className="project-tags">
              <span>{project.status}</span>
              <span>{project.client}</span>
            </div>
          </div>
          <div className="project-detail">
            <h2 className="detail-title">{project.title}</h2>
            <div className="project-facts">
              <p>
                <span>Client</span>
                {project.client}
              </p>
              <p>
                <span>Type</span>
                {project.type}
              </p>
            </div>
            <p className="detail-description">{project.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

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

  const expertise = {
    number: "02",
    title: "Architecture",
    description:
      "JT Partners is an international multidisciplinary consultancy with a unique portfolio of architecture, planning, engineering, project management, infrastructure and cost consultancy services.",
    image: "/images/hilton-marjan-architecture.webp",
  };

  const awards = [
    "DoubleTree by Hilton - Jeddah recognised in International Award",
    "International recognition for hospitality design",
    "Award-winning places with lasting impact",
  ];

  const navigateTo = (index) => {
    projectRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useLayoutEffect(() => {
    let updateRailMarker = () => {};
    let revealSections = () => {};
    let railResizeObserver;
    const sectionRevealTimelines = [];
    const context = gsap.context(() => {
      gsap.from(".side-rail", {
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
      });

      const firstProjectImage = appRef.current.querySelector(
        ".project-image",
      );
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

        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
        const currentIndex = Math.min(
          ticks.length - 1,
          Math.floor(progress * ticks.length),
        );
        if (currentIndex !== activeProjectRef.current) {
          activeProjectRef.current = currentIndex;
          setActiveProject(currentIndex);
        }

        const railRect = rail.getBoundingClientRect();
        const activeTickIndex = ticks.length - 1 - currentIndex;
        const activeTickRect = ticks[activeTickIndex].getBoundingClientRect();
        const position =
          activeTickRect.top +
          activeTickRect.height / 2 -
          railRect.top -
          marker.offsetHeight / 2;

        gsap.set(marker, { y: position });
        revealSections();
      };

      window.addEventListener("scroll", updateRailMarker, { passive: true });
      window.addEventListener("resize", updateRailMarker);
      ScrollTrigger.addEventListener("update", updateRailMarker);
      ScrollTrigger.addEventListener("refresh", updateRailMarker);
      railResizeObserver = new ResizeObserver(updateRailMarker);
      railResizeObserver.observe(railMarkersRef.current);
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
    <main className="portfolio" ref={appRef}>
      <aside className="side-rail" aria-label="Featured project navigation">
        <a
          className="rail-label"
          ref={railLabelRef}
          href="#project-1"
          onClick={(event) => {
            event.preventDefault();
            navigateTo(0);
          }}
        >
          Featured projects
        </a>
        <span
          className="rail-progress-marker"
          ref={railProgressRef}
          aria-hidden="true"
        />
        <div className="rail-markers" ref={railMarkersRef} aria-hidden="true">
          {Array.from({ length: Number(projects[0].total) }, (_, index) => (
            <span className="rail-tick" key={index} />
          ))}
        </div>
        <output
          className="rail-counter"
          ref={railCounterRef}
          aria-label={`Project ${String(activeProject + 1).padStart(2, "0")} of ${projects[0].total}`}
        >
          <span className="rail-counter-current">
            {String(activeProject + 1).padStart(2, "0")}
          </span>
          <span className="rail-counter-divider">-</span>
          <span>{projects[0].total}</span>
        </output>
      </aside>

      <div className="project-list">
        {projects.map((project, index) => (
          <div
            ref={(element) => {
              projectRefs.current[index] = element;
            }}
            key={project.number}
          >
            <Project project={project} index={index} />
          </div>
        ))}
      </div>

      <section className="intro-section" aria-labelledby="intro-title">
        <div className="intro-heading">
          <p className="section-index">JT+Partners</p>
          <h2 id="intro-title">
            Design the future
            <br />
            Now
          </h2>
        </div>
        <div className="intro-copy">
          <p>
            JT Partners JT P is an international multidisciplinary consultant
            which offers a unique portfolio of architecture, planning,
            engineering, project management, infrastructure and cost consultancy
            services.
          </p>
          <a className="plus-link" href="#expertise">
            <span aria-hidden="true">+</span>Know More Us
          </a>
        </div>
      </section>

      <section
        className="expertise-section"
        id="expertise"
        aria-labelledby="expertise-title"
      >
        <h2 id="expertise-title">Our Expertise</h2>
        <div className="expertise-content">
          <div className="expertise-category" aria-label="Expertise category">
            <span>01</span>
            <span>Engineering</span>
          </div>
          <div
            className="expertise-panel"
            id="expertise-panel"
            aria-labelledby="expertise-title"
          >
            <div className="expertise-copy">
              <p className="expertise-number">{expertise.number}</p>
              <h3>{expertise.title}</h3>
              <span className="expertise-accent" aria-hidden="true" />
              <p>{expertise.description}</p>
            </div>
            <div className="expertise-image-wrap">
              <img
                src={expertise.image}
                alt={`${expertise.title} project`}
              />
            </div>
            <span className="expertise-cross" aria-hidden="true">
              +
            </span>
          </div>
        </div>
      </section>

      <section className="awards-section" aria-labelledby="awards-title">
        <div className="awards-heading">
          <h2 id="awards-title">
            Architectural
            <br />
            Excellence
          </h2>
          <p>
            Awards &amp;
            <br />
            Achievements
          </p>
        </div>
        <div className="awards-content">
          <div
            className="award-pagination"
            aria-label={`Award ${String(activeAward + 1).padStart(2, "0")} of ${String(awards.length).padStart(2, "0")}`}
          >
            <span className="award-pagination-current">
              {String(activeAward + 1).padStart(2, "0")}
            </span>
            <span className="award-pagination-separator" aria-hidden="true">
              -
            </span>
            <span className="award-pagination-total">
              {String(awards.length).padStart(2, "0")}
            </span>
            <div className="award-pagination-track">
              {awards.map((award, index) => (
                <button
                  key={award}
                  type="button"
                  aria-label={`Show award ${String(index + 1).padStart(2, "0")}: ${award}`}
                  aria-pressed={activeAward === index}
                  className={activeAward === index ? "is-active" : ""}
                  onClick={() => setActiveAward(index)}
                />
              ))}
            </div>
          </div>
          <div className="award-visual">
            <img
              src="/images/doubletree-award.jpg"
              alt="DoubleTree by Hilton Jeddah awardee, Rethinking the Future Awards 2021"
            />
          </div>
          <div className="award-story">
            <h3>{awards[activeAward]}</h3>
            <a className="plus-link" href="https://jtpartners.com/news-awards/">
              <span aria-hidden="true">+</span>Read More
            </a>
          </div>
        </div>
      </section>

      <footer className="contact-section" aria-labelledby="contact-title">
        <h2 id="contact-title">Let’s collaborate!</h2>
        <div className="contact-topline">
          <div className="contact-details">
            <a href="tel:+97144521135">+971 4 452 1135</a>
            <a href="mailto:clients@jtpartners.com">
              clients<span>@</span>jtpartners.com
            </a>
          </div>
          <div className="social-links">
            <a href="https://www.instagram.com/jtandpartners/">
              Instagram <ArrowUpRight size={12} />
            </a>
            <a href="https://www.linkedin.com/company/jt-partners/">
              LinkedIn <ArrowUpRight size={12} />
            </a>
            <a href="https://www.facebook.com/jtpartners1">
              Facebook <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
        <div className="office-details">
          <div className="office-tabs" aria-label="Office locations">
            <span>Abu Dhabi</span>
            <span className="is-active">Dubai</span>
            <span>Lebanon</span>
          </div>
          <p>Dubai, UAE</p>
          <span>Business Bay · Bay Square 8 · Office 201-202</span>
          <span>+971 4 452 1135</span>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          JT&amp;PARTNERS
        </div>
        <div className="copyright">
          ©2025 JT &amp; Partners. All Rights Reserved
        </div>
      </footer>
    </main>
  );
}
