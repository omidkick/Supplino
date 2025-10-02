"use client";

import Image from "next/image";

function FeatureSection() {
  const features = [
    {
      icon: "/images/featureIcons/icon2.png",
      title: "پشتیبانی ۲۴ ساعته",
    },
    {
      icon: "/images/featureIcons/icon1.png",
      title: "خدمات امن و مطمئن",
    },
    {
      icon: "/images/featureIcons/icon3.png",
      title: "پرداخت امن و سریع",
    },
    {
      icon: "/images/featureIcons/icon4.png",
      title: "تحویل سریع کالا",
    },
  ];

  // Responsive image sizes
  const imageSizes = "(max-width: 640px) 50px, (max-width: 1024px) 60px, 64px";

  return (
    <section className="max-w-screen-xl mx-auto md:px-4 mb-12 lg:mb-16" dir="rtl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 lg:gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group flex flex-col items-center text-center p-4 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="mb-3">
              <div className="relative w-14 h-14 mx-auto transition-transform duration-200 group-hover:scale-105">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  fill
                  sizes={imageSizes}
                  className="object-contain"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>
            </div>

            <h3 className="text-base font-medium text-secondary-800 transition-colors duration-300 group-hover:text-primary-900">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;