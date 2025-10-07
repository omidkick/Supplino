"use client";

function MiniLoading({ size = "sm", className = "" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-5 w-5 border-2",
    lg: "h-6 w-6 border-2"
  };

  return (
    <div
      className={`
        animate-spin rounded-full 
        border-b-transparent
        ${sizeClasses[size]}
        ${className}
      `}
    />
  );
}

export default MiniLoading;