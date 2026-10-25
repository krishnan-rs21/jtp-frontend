import { useEffect, useState } from "react";
import { formatContent } from "../utils/formatContent.js";
import { publicAssetUrl } from "../utils/publicAssetUrl.js";

function ProjectSlide({ labels, project }) {
  return (
    <article
      className="project-slide"
      aria-label={formatContent(labels.projectSection, {
        title: project.title.replace("\n", " "),
      })}
    >
      <div className="project-image-wrap" aria-hidden="true">
        <img
          className="project-image"
          src={publicAssetUrl(project.image)}
          alt=""
        />
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
            {project.facts.map((fact) => (
              <p key={fact.label}>
                <span>{fact.label}</span>
                {fact.value}
              </p>
            ))}
          </div>
          <p className="detail-description">{project.description}</p>
        </div>
      </div>
    </article>
  );
}

export default function ProjectShowcase({ content }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <section
      className="project"
      id="project-1"
      aria-label={content.label}
      style={{
        "--project-scroll-height": `${(content.projects.length + 1) * 100}vh`,
      }}
    >
      <div className="project-stage">
        {content.projects.map((project) => (
          <ProjectSlide
            key={project.number}
            project={project}
            labels={content.labels}
          />
        ))}
        <nav
          className={`project-menu${menuOpen ? " is-open" : ""}`}
          id="project-menu"
          aria-label={content.menu.label}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          {content.menu.items.map((item) => (
            <a
              href={`#${item.target}`}
              key={item.target}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="project-brandbar">
          <a className="project-wordmark" href="#project-1" aria-label="JTP home">
            <img src={publicAssetUrl("/images/jtp-logo.png")} alt="" />
          </a>
          <button
            className={`project-menu-toggle${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-controls="project-menu"
            aria-label={menuOpen ? content.menu.closeLabel : content.menu.openLabel}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </section>
  );
}
