import { Fragment } from "react";
import { publicAssetUrl } from "../utils/publicAssetUrl.js";

export default function ExpertiseSection({ content }) {
  return (
    <section
      className="expertise-section"
      id="expertise"
      aria-labelledby="expertise-title"
    >
      <h2 id="expertise-title">{content.heading}</h2>
      <div className="expertise-content">
        <div className="expertise-category" aria-label={content.categoryLabel}>
          {content.categories.map((category) => (
            <Fragment key={category.number}>
              <span>{category.number}</span>
              <span>{category.title}</span>
            </Fragment>
          ))}
        </div>
        <div
          className="expertise-panel"
          id="expertise-panel"
          aria-labelledby="expertise-title"
        >
          <div className="expertise-copy">
            <p className="expertise-number">{content.number}</p>
            <h3>{content.title}</h3>
            <span className="expertise-accent" aria-hidden="true" />
            <p>{content.description}</p>
          </div>
          <div className="expertise-image-wrap">
            <img src={publicAssetUrl(content.image)} alt={content.imageAlt} />
          </div>
          <span className="expertise-cross" aria-hidden="true">
            +
          </span>
        </div>
      </div>
    </section>
  );
}
