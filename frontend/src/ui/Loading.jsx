"use client";

import Loader from "./Loader"; // Import your custom loader

function Loading({ width = "75", height = "40", color = "#4a6dff", message }) {
  // Map the old props to your new Loader component
  const getSizeClass = () => {
    if (height === "40") return "h-10 w-10";
    return "h-12 w-12";
  };

  const getBorderColor = () => {
    switch (color) {
      case "#4a6dff":
        return "border-primary-600";
      case "#ffffff":
        return "border-white";
      default:
        return "border-primary-600";
    }
  };

  return (
    <Loader
      size={getSizeClass()}
      borderColor={getBorderColor()}
      message={message}
      className="justify-center"
    />
  );
}

export default Loading;
