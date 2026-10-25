import { ArrowUpRight } from "lucide-react";

export default function ContactSection({ content }) {
  return (
    <footer
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title">{content.heading}</h2>
      <div className="contact-topline">
        <div className="contact-details">
          <a href={content.phone.href}>{content.phone.label}</a>
          <a href={content.email.href}>
            {content.email.label.split("@")[0]}
            <span>@</span>
            {content.email.label.split("@")[1]}
          </a>
        </div>
        <div className="social-links">
          {content.socialLinks.map((link) => (
            <a key={link.label}>
              {link.label} <ArrowUpRight size={12} />
            </a>
          ))}
        </div>
      </div>
      <div className="office-details">
        <div className="office-tabs" aria-label={content.officesLabel}>
          {content.offices.map((office) => (
            <span
              className={office.active ? "is-active" : ""}
              key={office.name}
            >
              {office.name}
            </span>
          ))}
        </div>
        <p>{content.location}</p>
        <span>{content.address}</span>
        <span>{content.phone.label}</span>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        {content.wordmark}
      </div>
      <div className="copyright">{content.copyright}</div>
    </footer>
  );
}
