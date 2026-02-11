import React from "react";

export default function LightWarningPopup({ warning, onConfirm, onCancel }) {
  if (!warning) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ color: "red" }}>⚠️ Warning</h3>

        <p>{warning.message}</p>

        {warning.light_raw !== undefined && (
          <p>
            Light level: <b>{warning.light_raw}</b>
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          <button onClick={onConfirm} style={confirmBtn}>
            ✔ Turn ON anyway
          </button>

          <button onClick={onCancel} style={cancelBtn}>
            ✖ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== simple inline styles ===== */
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "8px",
  width: "350px",
  textAlign: "center",
};

const confirmBtn = {
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  marginRight: "10px",
  cursor: "pointer",
};

const cancelBtn = {
  background: "#aaa",
  color: "#000",
  border: "none",
  padding: "10px 15px",
  cursor: "pointer",
};
