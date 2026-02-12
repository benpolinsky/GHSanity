"use client";

import React, { useState, useEffect } from "react";

const RateLimit: React.FC = () => {
  const [rateLimit, setRateLimit] = useState({ limit: 0, remaining: 0 });

  useEffect(() => {
    const fetchRateLimit = async () => {
      try {
        const response = await fetch("https://api.github.com/rate_limit");
        const data = await response.json();
        setRateLimit(data.rate);
      } catch (error) {
        console.error("Error fetching rate limit:", error);
      }
    };

    fetchRateLimit();
    const interval = setInterval(fetchRateLimit, 60000);
    return () => clearInterval(interval);
  }, []);

  const { limit, remaining } = rateLimit;
  const pct = limit > 0 ? (remaining / limit) * 100 : 0;
  const barColor =
    pct > 50
      ? "var(--color-state-open)"
      : pct > 20
        ? "var(--color-state-warning)"
        : "var(--color-state-closed)";

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-md, 8px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            color: "var(--color-fg-secondary)",
          }}
        >
          {remaining}/{limit}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-fg-muted)",
          }}
        >
          {Math.round(pct)}%
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: "var(--radius-full, 9999px)",
          background: "var(--color-bg-surface-1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: "inherit",
            background: barColor,
            transition: "width 300ms ease, background-color 300ms ease",
          }}
        />
      </div>
    </div>
  );
};

export default RateLimit;
