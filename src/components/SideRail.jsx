import { formatContent } from "../utils/formatContent.js";

export default function SideRail({
  activeProject,
  ariaLabel,
  counterRef,
  destinations,
  destinationLabel,
  label,
  labelRef,
  markersRef,
  navigateToProject,
  progressRef,
  counterLabel,
}) {
  const current = String(activeProject + 1).padStart(2, "0");
  const total = String(destinations.length).padStart(2, "0");

  return (
    <aside className="side-rail" aria-label={ariaLabel}>
      <a
        className="rail-label"
        ref={labelRef}
        href="#project-1"
      >
        {label}
      </a>
      <span
        className="rail-progress-marker"
        ref={progressRef}
        aria-hidden="true"
      />
      <div className="rail-markers" ref={markersRef}>
        {destinations.map((destination, index) => (
          <button
            className="rail-tick"
            key={destination.target}
            type="button"
            aria-label={formatContent(destinationLabel, {
              label: destination.label,
            })}
            onClick={() => navigateToProject(index)}
          />
        ))}
      </div>
      <output
        className="rail-counter"
        ref={counterRef}
        aria-label={formatContent(counterLabel, { current, total })}
      >
        <span className="rail-counter-current">{current}</span>
        <span className="rail-counter-divider">-</span>
        <span>{total}</span>
      </output>
    </aside>
  );
}
