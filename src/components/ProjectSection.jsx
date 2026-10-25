import { formatContent } from "../utils/formatContent.js";
import { publicAssetUrl } from "../utils/publicAssetUrl.js";

export default function ProjectSection({ project, index, labels }) {
  const id = `project-${index + 1}`;

  return (
    <section
      className={`project project--${project.color}`}
      id={id}
      aria-label={formatContent(labels.projectSection, {
        title: project.title.replace("\n", " "),
      })}
    >
      <div className="project-stage">
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
              <p>
                <span>{labels.client}</span>
                {project.client}
              </p>
              <p>
                <span>{labels.type}</span>
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
