import React from "react";
import SupportList from "./_components/SupportList";
import { Suspense } from "react";
import Loader from "@/ui/Loader";
import Search from "@/ui/Search";

// This component handles the search params
function SupportPageContent() {
  return (
    <>
      {/* Title and Search*/}
      <div className="flex flex-col md:flex-row items-center justify-between text-secondary-800 gap-y-6 mb-6 md:mb-12 mt-8 md:mt-2">
        <h1 className="font-extrabold text-xl md:text-2xl order-1">
          مدیریت تیکت‌های پشتیبانی
        </h1>
        <div className="order-3 md:order-2">
          <Search placeholder="جستجو در تیکت‌ها..." />
        </div>
      </div>

      <SupportList />
    </>
  );
}

function SupportPage() {
  return (
    <Suspense fallback={<Loader message="در حال بارگذاری تیکت‌ها..." />}>
      <SupportPageContent />
    </Suspense>
  );
}

export default SupportPage;