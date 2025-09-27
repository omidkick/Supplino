import Image from "next/image";

function Avatar({ src, width = 24, mobileWidth, priority = false }) {
  const finalWidth = mobileWidth || width;

  return (
    <Image
      src={src || "/images/avatar.png"}
      width={finalWidth}
      height={finalWidth}
      className="rounded-full ring-1 ring-secondary-300 ml-2"
      alt="User Avatar"
      priority={priority}
      sizes={`(max-width: 768px) ${mobileWidth || width}px, ${width}px`}
    />
  );
}

export default Avatar;
