import React from "react";

const Loader = ({
  message = "در حال بارگذاری...",
  size = "h-12 w-12",
  borderColor = "border-primary-600",
  textColor = "text-secondary-400",
  fullScreen = true,
  className = "",
}) => {
  const containerClasses = "flex items-center justify-center p-4 mt-[10%]";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div
          className={`animate-spin rounded-full ${size} border-b-2 ${borderColor} mx-auto mb-4`}
        ></div>
        <p className={textColor}>{message}</p>
      </div>
    </div>
  );
};

export default Loader;
