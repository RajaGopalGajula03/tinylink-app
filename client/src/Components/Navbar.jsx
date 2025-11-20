import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "14px 20px",
        marginBottom: "20px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "16px",
        }}
      >
        Dashboard
      </Link>

      <Link
        to="/healthz"
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "16px",
        }}
      >
        Health Check
      </Link>
    </div>
  );
}
