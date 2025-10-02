import Image from "next/image";

function CoverImage({ title, className, coverImageUrl }) {
  return (
    <Image
      src={coverImageUrl}
      alt={title}
      fill
      priority
      sizes="(max-width: 768px) 95vw, 
             (max-width: 1024px) 50vw, 
             33vw"
      className={`object-contain object-center ${className}`}
      quality={90}
    />
  );
}

export default CoverImage;
