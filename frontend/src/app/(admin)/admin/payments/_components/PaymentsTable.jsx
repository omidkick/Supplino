// app/(admin)/admin/payments/_components/PaymentsTable.jsx
"use client";

import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import PaymentRow from "./PaymentRow";

function PaymentsTable({ payments }) {
  if (!payments.length) return <Empty resourceName="پرداختی" />;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>شماره فاکتور</th>
        <th>کاربر</th>
        <th>مبلغ</th>
        <th>وضعیت پرداخت</th>
        <th>تاریخ پرداخت</th>
        <th>وضعیت سفارش</th>
        <th>عملیات</th>
        <th>مشاهده</th>
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
