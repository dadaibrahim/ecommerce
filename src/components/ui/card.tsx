import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">{children}</div>
  );
}
