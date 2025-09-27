"use client";

import Slider from "react-slick";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toPersianDigits } from "@/utils/numberFormatter";

// Custom arrows
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary-700 hover:text-primary-600 p-2 rounded-full z-10 transition-all duration-200"
    aria-label="تصویر قبلی"
  >
    <ChevronRightIcon className="w-5 h-5" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 text-secondary-700 hover:text-primary-600 p-2 rounded-full z-10 transition-all duration-200"
    aria-label="تصویر بعدی"
  >
    <ChevronLeftIcon className="w-5 h-5" />
  </button>
);

export default function ImageSlider({ 
  images = [], 
  title = "محصول",
  showDots = true,
  autoplay = false,
  autoplaySpeed = 3000 
}) {
  // Handle empty images array
  const slideImages = images.length > 0 ? images : ['/images/product-placeholder.png'];

  const settings = {
    rtl: true,
    infinite: slideImages.length > 1,
    speed: 500,
    arrows: slideImages.length > 1, // Only show arrows if multiple images
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0px",
    dots: showDots && slideImages.length > 1, // Only show dots if multiple images
    dotsClass: "slick-dots !bottom-4",
    autoplay: autoplay && slideImages.length > 1,
    autoplaySpeed: autoplaySpeed,
    beforeChange: () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    },
    customPaging: (i) => (
      <div className="w-2 h-2 bg-primary-900 rounded-full transition-all duration-200 cursor-pointer" />
    ),
  };

  const handleImageError = (e) => {
    e.target.src = '/images/product-placeholder.png';
    e.target.alt = 'تصویر محصول یافت نشد';
  };

  return (
    <div className="relative rounded-xl shadow-md overflow-hidden bg-secondary-50">
      {slideImages.length === 1 ? (
        // Single image - no slider needed
        <div className="p-10 flex items-center justify-center aspect-square">
          <img
            src={slideImages[0]}
            alt={`${title} - تصویر محصول`}
            className="w-full h-full object-contain"
            onError={handleImageError}
          />
        </div>
      ) : (
        // Multiple images - use slider
        <Slider {...settings}>
          {slideImages.map((img, index) => (
            <div
              key={index}
              className="p-10 flex items-center justify-center aspect-square"
            >
              <img
                src={img}
                alt={`${title} - تصویر ${index + 1}`}
                className="w-full h-full object-contain"
                onError={handleImageError}
                loading={index === 0 ? "eager" : "lazy"} // Optimize loading
              />
            </div>
          ))}
        </Slider>
      )}
      
      {/* Image counter overlay */}
      {slideImages.length > 1 && (
        <div className="absolute top-4 right-4 bg-primary-800 text-white px-2 py-1 rounded-full text-xs">
          {toPersianDigits(slideImages.length)} تصویر
        </div>
      )}
    </div>
  );
}