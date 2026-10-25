import PlusLink from "./PlusLink.jsx";

export default function IntroSection({ content }) {
  return (
    <section
      className="intro-section"
      id="intro"
      aria-labelledby="intro-title"
    >
      <div className="intro-heading">
        <p className="section-index">{content.brand}</p>
        <h2 id="intro-title">
          {content.heading[0]}
          <br />
          {content.heading[1]}
        </h2>
      </div>
      <div className="intro-copy">
        <p>{content.description}</p>
        <PlusLink href={content.link.href}>{content.link.label}</PlusLink>
      </div>
    </section>
  );
}
