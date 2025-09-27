// app/(admin)/admin/payments/page.jsx (Server Component)
import { Suspense } from "react";
import Loader from "@/ui/Loader";

import PaymentsList from "./_components/PaymentsList";
import SortPayments from "./_components/SortPayments";

async function PaymentsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-12 mt-8 md:mt-2">
        <h1 className="font-extrabold text-xl md:text-2xl">لیست سفارشات</h1>
        {/* Sorting */}
        <SortPayments />
      </div>

      <Suspense fallback={<Loader message="در حال بارگذاری..." />}>
        <PaymentsList searchParams={resolvedSearchParams} />
      </Suspense>
    </>
  );
}

export default PaymentsPage;
