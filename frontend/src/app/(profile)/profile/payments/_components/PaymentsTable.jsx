"use client";

import { useGetUser } from "@/hooks/useAuth";
import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import PaymentRow from "../_components/PaymentRow";
import Fallback from "@/ui/Fallback";

function PaymentsTable({ payments, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Fallback />
      </div>
    );
  }

if (!payments || payments.length === 0) return <Empty resourceName="سفارشی" />;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>شماره فاکتور</th>
        <th>توضیحات</th>
        <th>محصولات</th>
        <th>مبلغ</th>
        <th>تاریخ ایجاد</th>
        <th>وضعیت پرداخت</th>
        <th>وضعیت سفارش</th>
        <th>عملیات</th>
      </Table.Header>
      <Table.Body>
        {payments.map((payment, index) => (
          <PaymentRow key={payment._id} payment={payment} index={index} />
        ))}
      </Table.Body>
    </Table>
  );
}

export default PaymentsTable;
