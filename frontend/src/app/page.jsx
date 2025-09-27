import Button from "@/ui/Button";
import Link from "next/link";

export const metadata = {
  title: "ساپلینو - فروشگاه مکمل‌های اصلی و ویتامین‌ها",
};

export default function Welcome() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ویدیوی پس‌زمینه */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/videos/welcome-background.webm" type="video/webm" />
          <source src="/videos/welcome-background.mp4" type="video/mp4" />
        </video>

        {/* overlay برای خوانایی بهتر متن */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>

      {/* محتوای اصلی */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* لوگو یا آیکون */}
        <div className="mb-8 md:mb-16 flex items-center justify-center">
          <img
            src="/images/logo (1).png"
            alt="logo"
            className="w-40 max-h-30"
          />
        </div>

        {/* عنوان اصلی */}
        <h1 className="font-extrabold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
          به <span className="text-primary-800">ساپلینو</span> خوش آمدید
        </h1>

        {/* توضیحات */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
          سلامتتان را با مکمل‌های اصلی و ویتامین‌های تضمین‌شده
          <span className="block mt-2">به ساده‌ترین روش تجربه کنید</span>
        </p>

        {/* دکمه‌های اقدام */}
        <div className="flex flex-col-reverse sm:flex-row justify-center gap-4 md:gap-6">
          <Button
            variant="primary"
            className="px-8 py-4 text-lg backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30 shadow-sm"
          >
            <Link href="/products" className="text-white font-semibold">
              شروع خرید 🚀
            </Link>
          </Button>

          <Button variant="primary" className="px-8 py-4 text-lg  shadow-sm">
            <Link href="/home">بزن بریم</Link>
          </Button>
        </div>

        {/* اسکرول پایین (اختیاری) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
