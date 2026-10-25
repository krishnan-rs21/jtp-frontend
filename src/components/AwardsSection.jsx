import { formatContent } from "../utils/formatContent.js";
import PlusLink from "./PlusLink.jsx";

export default function AwardsSection({ activeAward, content, onAwardChange }) {
  const current = String(activeAward + 1).padStart(2, "0");
  const total = String(content.items.length).padStart(2, "0");

  return (
    <section
      className="awards-section"
      id="awards"
      aria-labelledby="awards-title"
    >
      <div className="awards-heading">
        <h2 id="awards-title">
          {content.heading[0]}
          <br />
          {content.heading[1]}
        </h2>
        <p>
          {content.subheading[0]}
          <br />
          {content.subheading[1]}
        </p>
      </div>
      <div className="awards-content">
        <div
          className="award-pagination"
          aria-label={formatContent(content.paginationLabel, {
            current,
            total,
          })}
        >
          <span className="award-pagination-current">{current}</span>
          <span className="award-pagination-separator" aria-hidden="true">
            -
          </span>
          <span className="award-pagination-total">{total}</span>
          <div className="award-pagination-track">
            {content.items.map((award, index) => (
              <button
                key={award}
                type="button"
                aria-label={formatContent(content.buttonLabel, {
                  number: String(index + 1).padStart(2, "0"),
                  title: award,
                })}
                aria-pressed={activeAward === index}
                className={activeAward === index ? "is-active" : ""}
                onClick={() => onAwardChange(index)}
              />
            ))}
          </div>
        </div>
        <div className="award-visual">
          <img src={content.image} alt={content.imageAlt} />
        </div>
        <div className="award-story">
          <h3>{content.items[activeAward]}</h3>
          <PlusLink>{content.linkLabel}</PlusLink>
        </div>
      </div>
    </section>
  );
}
