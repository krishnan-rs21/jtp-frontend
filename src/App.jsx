import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowDownRight, ArrowUpRight } from "lucide-react";

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
        <div className="project-index" aria-hidden="true">
          <span>{project.number}</span>
          <span className="index-rule" />
          <span>{project.total}</span>
        </div>
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
        <div className="scroll-prompt" aria-hidden="true">
          <span>Scroll to explore</span>
          <ArrowDown size={16} strokeWidth={1.5} />
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
  const [activeExpertise, setActiveExpertise] = useState(1);
  const [activeAward, setActiveAward] = useState(0);

  const expertise = [
    {
      title: "Engineering",
      description:
        "Integrated engineering that brings clarity, performance and long-term value to every project.",
      image: projects[0].image,
    },
    {
      title: "Architecture",
      description:
        "JT Partners is an international multidisciplinary consultancy with a unique portfolio of architecture, planning, engineering, project management, infrastructure and cost consultancy services.",
      image: "/images/hilton-marjan-architecture.webp",
    },
    {
      title: "Interior Design",
      description:
        "Thoughtful interior environments that connect people to place through material, light and detail.",
      image: projects[0].image,
    },
  ];

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
    let railResizeObserver;
    const context = gsap.context(() => {
      gsap.from(".side-rail, .project-index, .scroll-prompt", {
        opacity: 0,
        duration: 1,
        delay: 0.2,
        stagger: 0.12,
        ease: "power2.out",
      });

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
        const intro = section.querySelector(".project-intro");
        const detail = section.querySelector(".project-detail");
        const image = section.querySelector(".project-image");
        const prompt = section.querySelector(".scroll-prompt");

        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.65,
          },
        });

        reveal
          .to(title, { yPercent: -28, opacity: 0, ease: "none" }, 0.12)
          .to(intro, { y: -22, opacity: 0, ease: "none" }, 0.12)
          .fromTo(
            detail,
            { y: 56, opacity: 0 },
            { y: 0, opacity: 1, ease: "none" },
            0.22,
          )
          .to(image, { scale: 1.06, ease: "none" }, 0)
          .to(image, { opacity: 0.58, ease: "none" }, 0.2)
          .to(prompt, { opacity: 0, ease: "none" }, 0.08);

        gsap.fromTo(
          image,
          { scale: 1.08 },
          {
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      ScrollTrigger.refresh();
    }, appRef);

    return () => {
      window.removeEventListener("scroll", updateRailMarker);
      window.removeEventListener("resize", updateRailMarker);
      ScrollTrigger.removeEventListener("update", updateRailMarker);
      ScrollTrigger.removeEventListener("refresh", updateRailMarker);
      railResizeObserver?.disconnect();
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
          <div
            className="expertise-list"
            role="tablist"
            aria-label="Areas of expertise"
          >
            {expertise.map((item, index) => (
              <button
                className={`expertise-tab${activeExpertise === index ? " is-active" : ""}`}
                id={`expertise-tab-${index}`}
                key={item.title}
                type="button"
                role="tab"
                aria-selected={activeExpertise === index}
                aria-controls="expertise-panel"
                onClick={() => setActiveExpertise(index)}
              >
                <span className="expertise-tab-number">0{index + 1}</span>
                <span>{item.title}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div
            className="expertise-panel"
            id="expertise-panel"
            role="tabpanel"
            aria-labelledby={`expertise-tab-${activeExpertise}`}
          >
            <div className="expertise-copy">
              <p className="expertise-number">0{activeExpertise + 1}</p>
              <h3>{expertise[activeExpertise].title}</h3>
              <p>{expertise[activeExpertise].description}</p>
            </div>
            <div className="expertise-image-wrap">
              <img
                src={expertise[activeExpertise].image}
                alt={`${expertise[activeExpertise].title} project`}
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
          <div className="award-visual" aria-hidden="true">
            <span>Rethinking the future awards</span>
            <strong>AWARDEE</strong>
            <span>Hospitality concept</span>
          </div>
          <div className="award-story">
            <div
              className="award-pagination"
              role="tablist"
              aria-label="Awards"
            >
              {awards.map((award, index) => (
                <button
                  key={award}
                  type="button"
                  role="tab"
                  aria-label={`Award ${index + 1}`}
                  aria-selected={activeAward === index}
                  className={activeAward === index ? "is-active" : ""}
                  onClick={() => setActiveAward(index)}
                >
                  <span>0{index + 1}</span>
                </button>
              ))}
            </div>
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
