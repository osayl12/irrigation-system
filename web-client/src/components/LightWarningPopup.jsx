import React from "react";

export default function LightWarningPopup({ warning, onConfirm, onCancel }) {
  if (!warning) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Strong light detected</h3>

        <p>{warning.message}</p>

        {warning.light_raw !== undefined && (
          <p className="modal__meta">Light level: {warning.light_raw}</p>
        )}

        <div className="modal__actions">
          <button onClick={onConfirm} className="btn btn--danger">
            Water anyway
          </button>

          <button onClick={onCancel} className="btn btn--ghost">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
