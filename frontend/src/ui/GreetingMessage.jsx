"use client";

function GreetingMessage() {
  const hour = new Date().getHours();

  const greeting =
    hour >= 5 && hour < 12
      ? "صبح بخیر ☀️"
      : hour >= 12 && hour < 18
      ? "عصر بخیر 🌇"
      : "شب بخیر 🌙";

  return (
    <span className="text-xs md:text-sm font-bold text-secondary-400">
      {greeting}
    </span>
  );
}

export default GreetingMessage;
