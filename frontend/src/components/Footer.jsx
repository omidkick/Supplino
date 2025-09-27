import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaLeaf } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-secondary-50 to-secondary-100 py-12 px-4 border-t border-secondary-200 rounded-t-3xl">
      <div className="container xl:max-w-screen-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: About Suplino */}
        <div>
          <h3 className="text-2xl font-semibold text-secondary-800 mb-4 flex items-center">
            <span className="text-primary-900 font-black ml-2">ساپلینو</span>
            <FaLeaf className="text-primary-900 w-5 h-5" />
          </h3>

          <p className="text-sm text-secondary-600 leading-relaxed mb-4">
            ساپلینو مرجع تخصصی مکمل‌های ورزشی، سلامت و زیبایی با تضمین کیفیت و
            اصالت کالا. ما با ارائه محصولات اورجینال و مشاوره تخصصی، همراه
            همیشگی سلامتی شما هستیم.
          </p>
          <p className="text-sm text-secondary-600 leading-relaxed">
            تمام محصولات ما دارای مجوز از وزارت بهداشت و تضمین اصالت می‌باشند.
          </p>

          {/* Social Media Icons */}
          <div className="flex gap-4 mt-6">
            <a href="#" className="">
              <img
                src="/images/social/instagram.svg"
                alt="Instagram"
                className="w-10 h-10"
              />
            </a>
            <a href="#">
              <img
                src="/images/social/facebook.svg"
                alt="Facebook"
                className="w-10 h-10"
              />
            </a>
            <a href="#">
              <img
                src="/images/social/telegram.svg"
                alt="Telegram"
                className="w-10 h-10"
              />
            </a>
            <a href="#">
              <img
                src="/images/social/whatsapp.svg"
                alt="WhatsApp"
                className="w-10 h-10"
              />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-secondary-800 mb-4 border-r-4 border-primary-700 pr-2">
            دسته‌بندی محصولات
          </h3>
          <ul className="space-y-3 text-sm text-secondary-600 text-right leading-6">
            <li>
              <a
                href="products?category=wheyProtein,massGainer"
                className="hover:text-primary-600 flex items-center"
              >
                <div className="w-2 h-2 bg-primary-400 rounded-full ml-2"></div>
                <span>پروتئین و گینر</span>
              </a>
            </li>
            <li>
              <a
                href="products?category=vitamins"
                className="hover:text-primary-600 flex items-center"
              >
                <div className="w-2 h-2 bg-primary-400 rounded-full ml-2"></div>
                <span>ویتامین‌ها و مینرال‌ها</span>
              </a>
            </li>
            <li>
              <a
                href="products?category=fatBurner"
                className="hover:text-primary-600 flex items-center"
              >
                <div className="w-2 h-2 bg-primary-400 rounded-full ml-2"></div>
                <span>چربی‌سوزها</span>
              </a>
            </li>
            <li>
              <a
                href="/products?category=pre-work"
                className="hover:text-primary-600 flex items-center"
              >
                <div className="w-2 h-2 bg-primary-400 rounded-full ml-2"></div>
                <span>مکمل قبل تمرین</span>
              </a>
            </li>
            <li>
              <a
                href="/beauty"
                className="hover:text-primary-600 flex items-center"
              >
                <div className="w-2 h-2 bg-primary-400 rounded-full ml-2"></div>
                <span>محصولات زیبایی</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div>
          <h3 className="text-xl font-semibold text-secondary-800 mb-4 border-r-4 border-primary-700 pr-2">
            خدمات مشتریان
          </h3>
          <ul className="space-y-3 text-sm text-secondary-600 text-right leading-6">
            <li>
              <a href="/track-order" className="hover:text-primary-600">
                پیگیری سفارش
              </a>
            </li>
            <li>
              <a href="/return-policy" className="hover:text-primary-600">
                شرایط بازگرداندن کالا
              </a>
            </li>
            <li>
              <a href="/shipping" className="hover:text-primary-600">
                هزینه و زمان ارسال
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-primary-600">
                سوالات متداول
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-primary-600">
                مجله سلامتی
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-secondary-800 mb-4 border-r-4 border-primary-700 pr-2">
            راه‌های ارتباطی
          </h3>
          <ul className="space-y-4 text-sm text-secondary-600 text-right leading-6">
            <li className="flex items-center">
              <FaMapMarkerAlt className="text-primary-500 ml-2 w-4 h-4" />
              <span>تهران، خیابان ولیعصر، پلاک ۱۲۳۴</span>
            </li>
            <li className="flex items-center">
              <FaPhone className="text-primary-500 ml-2 w-4 h-4" />
              <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="text-primary-500 ml-2 w-4 h-4" />
              <span>info@suplino.ir</span>
            </li>
          </ul>

          {/* Newsletter Subscription */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-secondary-700 mb-2">
              عضویت در خبرنامه
            </h4>
            <div className="flex">
              <button className="bg-primary-900 hover:bg-primary-800 text-primary-100 px-4 py-2 rounded-r-lg text-sm transition-colors">
                عضویت
              </button>
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                id="newsletter-email"
                name="newsletter-email"
                className="flex-1 bg-white border border-secondary-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-900 "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Seals & Copyright */}
      <div className="container xl:max-w-screen-xl mx-auto mt-10 pt-4 border-t border-secondary-200 mb-10 md:mb-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 md:w-24 md:h-24 h-16">
              <img
                src="/images/sib.png"
                alt="نماد سیب سلامت"
                className="object-contain"
              />
            </div>

            <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24">
              {" "}
              <img
                src="/images/ENAMAD.png"
                alt="نماد اعتماد الکترونیک"
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16">
              {" "}
              <img
                src="/images/ZarinPal.png"
                alt="درگاه پرداخت زرین پال"
                className="object-contain"
              />
            </div>
          </div>

          <div className="text-center text-sm text-secondary-600">
            <p>
              © {new Date().getFullYear()} کلیه حقوق برای ساپلینو محفوظ است.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


