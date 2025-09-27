"use client";

import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import CouponRow from "./CouponRow";

function CouponsTable({ coupons }) {
  if (!coupons.length) return <Empty resourceName="کد تخفیفی" />;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>کد</th>
        <th>نوع</th>
        <th>مبلغ</th>
        <th>محصولات مشمول</th>
        <th>ظرفیت استفاده شده</th>
        <th>ظرفیت</th>
        <th>تاریخ انقضا</th>
        <th>عملیات</th>
      </Table.Header>
      <Table.Body>
        {coupons.map((coupon, index) => (
          <CouponRow key={coupon._id} coupon={coupon} index={index} />
        ))}
      </Table.Body>
    </Table>
  );
}

export default CouponsTable;
