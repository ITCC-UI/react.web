import React from 'react';
import './Error.css';

const Error = ({ message, severity = 'error', onClose }) => {
  const severityClasses = {
    error: 'error-message-error',
    warning: 'error-message--warning',
    info: 'error-message--info'
  };

  return (
    <div className={`error-message ${severityClasses[severity]}`}>
      <div className="error-message__content">
        <span className="error-message__text">{message}</span>
        {onClose && (
          <button
            className="error-message__close"
            onClick={onClose}
            aria-label="Close error message"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;