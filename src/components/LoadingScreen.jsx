export default function LoadingScreen({ brand, message, phase }) {
  return (
    <div
      className={`loading-screen${phase === "exiting" ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="loading-content">
        <span className="loading-brand" aria-hidden="true">
          {brand.split("").map((character, index) => (
            <span
              className="loading-brand-character"
              key={`${character}-${index}`}
              style={{ "--character-index": index }}
            >
              {character}
            </span>
          ))}
        </span>
        <span className="loading-message" aria-hidden="true">
          {message}
        </span>
        <span className="loading-progress" aria-hidden="true">
          <span />
        </span>
      </div>
    </div>
  );
}
