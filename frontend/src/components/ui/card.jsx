// src/components/ui/card.jsx
import React from "react";

export const Card = ({ className = "", children, ...props }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`border-b pb-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ className = "", children, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);
