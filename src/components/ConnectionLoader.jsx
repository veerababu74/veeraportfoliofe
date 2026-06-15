import './ConnectionLoader.css';

function ConnectionLoader() {
  return (
    <div className="connection-loader-overlay" role="status" aria-live="polite" aria-label="Loading website">
      <div className="connection-loader-card">
        <div className="connection-scene">
          <div className="loader-character" aria-hidden="true">
            <div className="character-head">
              <span className="eye" />
              <span className="eye" />
            </div>
            <div className="character-body" />
          </div>

          <div className="loader-laptop" aria-hidden="true">
            <div className="laptop-screen">
              <span className="scan-line" />
            </div>
            <div className="laptop-base" />
          </div>

          <div className="loader-signal" aria-hidden="true">
            <span className="signal-wave wave-1" />
            <span className="signal-wave wave-2" />
            <span className="signal-wave wave-3" />
            <span className="signal-dot" />
          </div>
        </div>

        <p className="loader-title">Connecting to Veera Portfolio</p>
        <p className="loader-subtitle">Establishing connection and loading sections...</p>

        <div className="loader-progress" aria-hidden="true">
          <span className="loader-progress-fill" />
        </div>
      </div>
    </div>
  );
}

export default ConnectionLoader;