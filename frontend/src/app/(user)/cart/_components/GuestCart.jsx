import Link from "next/link";
import Image from "next/image";
import Button from "@/ui/Button";
import { useRouter } from "next/navigation";
import { HiOutlineLogin } from "react-icons/hi";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

function GuestCart() {
  const router = useRouter();
  return (
    <div className="">
      <div className="mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Right Section: Image + Text */}
          <div className="w-full lg:w-[70%] flex flex-col items-center text-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 mb-4">
              <Image
                src="/images/empty-cart.svg"
                alt="سبد خرید خالی"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
              سبد خرید شما خالی است!
            </h2>
            <p className="text-sm sm:text-base text-secondary-600 mb-4">
              می‌توانید برای مشاهده محصولات بیشتر به صفحات محصولات بروید:
            </p>
            <Button onClick={() => router.push("/products")} variant="primary">
              رفتن به صفحه محصولات
            </Button>
          </div>

          {/* Left Box: Login  */}
          <Link
            href="/auth"
            role="button"
            aria-label="ورود به حساب کاربری"
            className="w-full lg:w-[30%] p-4 rounded-xl border shadow-sm text-right bg-secondary-0"
          >
            <div className="flex items-center justify-between">
              <div className="font-bold text-base text-secondary-900 flex items-center justify-start gap-2">
                <span className="text-xl">
                  <HiOutlineLogin className="w-6 h-6 text-primary-900" />
                </span>

                <span>ورود به حساب کاربری</span>
              </div>

              <ChevronLeftIcon className="w-5 h-5 text-primary-900 hover:text-primary-700" />
            </div>

            <p className="mt-3 text-sm text-secondary-600 leading-relaxed">
              برای مشاهده محصولاتی که پیش‌تر به سبد خرید خود اضافه کرده‌اید وارد
              شوید.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GuestCart;
