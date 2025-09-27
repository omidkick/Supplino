"use client";
import { useGetUser } from "@/hooks/useAuth";
import PaymentsTable from "./_components/PaymentsTable";

function Payments() {
  const { data, isLoading } = useGetUser();
  const { user, payments } = data || {};

  return (
    <div>
      <h1 className="font-extrabold text-xl lg:text-2xl mb-8">
        لیست سفارش های کاربر
      </h1>
      <PaymentsTable payments={payments} isLoading={isLoading} />
    </div>
  );
}

export default Payments;
