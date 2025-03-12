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
    const interval = setInterval(fetchRateLimit, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>API Rate Limit: {rateLimit.limit}</p>
      <p>API Calls Remaining: {rateLimit.remaining}</p>
    </div>
  );
};

export default RateLimit;
