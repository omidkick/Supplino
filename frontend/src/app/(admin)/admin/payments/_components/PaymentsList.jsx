"use client";

import { usePaymentActions } from "@/hooks/usePayments";
import Loader from "@/ui/Loader";
import Empty from "@/ui/Empty";
import Pagination from "@/ui/Pagination";
import SortPayments from "./SortPayments";
import PaymentsTable from "./PaymentsTable";

function PaymentsList({ searchParams }) {
  const { payments, isLoadingPayments, pagination } = usePaymentActions();

  // Get current filter values from props
  const currentPage = Number(searchParams?.page) || 1;

  if (isLoadingPayments) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Payments Table or Empty State */}
      {payments?.length > 0 ? (
        <PaymentsTable payments={payments} />
      ) : (
        <Empty resourceName="سفارشی" />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={currentPage}
            itemsPerPage={pagination.itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}

export default PaymentsList;
