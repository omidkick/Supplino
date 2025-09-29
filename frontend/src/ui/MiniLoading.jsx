"use client";

import Loader from "./Loader"; // Import your custom loader

function MiniLoading({ width = "40", height = "20", color = "#ffffff" }) {
  // Map the old props to your new Loader component
  const getSizeClass = () => {
    if (height === "20") return "h-5 w-5"; // Smaller size for mini loader
    return "h-6 w-6";
  };

  const getBorderColor = () => {
    switch (color) {
      case "#ffffff": return "border-white";
      case "#4a6dff": return "border-primary-600";
      default: return "border-white";
    }
  };

  return (
    <Loader
      size={getSizeClass()}
      borderColor={getBorderColor()}
      message=""
      className="justify-center p-0"
    />
  );
}

export default MiniLoading;