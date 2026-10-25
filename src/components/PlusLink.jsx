export default function PlusLink({ href, children }) {
  return (
    <a className="plus-link" href={href}>
      <span aria-hidden="true">+</span>
      {children}
    </a>
  );
}
