import { useEffect, useState } from "react";

function AuthBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="hidden lg:block absolute  inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Main clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700"></div>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-800/30 via-transparent to-primary-400/20"></div>

      {/* Simple geometric shapes - inspired by the clean design */}
      <div className="absolute inset-0">
        {/* Large circle in top left */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>

        {/* Medium circle in bottom right */}
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-white/8 rounded-full blur-lg"></div>

        {/* Small accent circle */}
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/12 rounded-full blur-md"></div>

        {/* Minimal geometric lines */}
        <div className="absolute top-1/3 right-1/4 w-px h-32 bg-white/20 rotate-45"></div>
        <div className="absolute bottom-1/3 left-1/3 w-px h-24 bg-white/15 rotate-12"></div>
      </div>

      {/* Very subtle floating dots - much fewer than before */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Central area with lighter gradient for form readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-700/20 via-transparent to-primary-600/10"></div>
    </div>
  );
}

export default AuthBackground;
