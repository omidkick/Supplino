import Image from "next/image";
import Button from "@/ui/Button";
import { useRouter } from "next/navigation";


function EmptyCart() {
  const router = useRouter();


  return (
    <div className="mb-20">
      <div className="mx-auto">
        <div className="flex items-center justify-center gap-8 ">
          {/* Image + Text */}
          <div className="w-full flex flex-col items-center text-center">
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

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button
                onClick={() => router.push("/products")}
                variant="primary"
              >
                رفتن به صفحه محصولات
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyCart;
