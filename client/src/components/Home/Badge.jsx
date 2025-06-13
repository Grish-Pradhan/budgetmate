import React from "react";

export default function Badge({ text, isCost, tip }) {
  return (
    <div
      className={`badge ${isCost ? (isCost === 1 ? "text-red-main" : "text-green-500") : ""}`}
      data-tip={tip}
      data-for={tip}
    >
      {text}
    </div>
  );
}
