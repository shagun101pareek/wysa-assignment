function Loader({ label = "Loading..." }) {
  return (
    <div className="loader" role="status" aria-live="polite" aria-label={label}>
      <div className="loader__spinner" aria-hidden="true" />
      {label && <p className="loader__label">{label}</p>}
    </div>
  );
}

export default Loader;
