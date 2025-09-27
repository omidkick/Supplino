"use client";

import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import SupportRow from "./SupportRow";
import Loading from "@/ui/Loading";

function SupportTable({ tickets, searchTerm = "", statusFilter = "" }) {
  if (!tickets) return <Loading />;
  if (tickets.length === 0) return <Empty resourceName="تیکتی" />;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>کاربر</th>
        <th>عنوان تیکت</th>
        <th>دسته‌بندی</th>
        <th>وضعیت</th>
        <th>تاریخ ایجاد</th>
        <th>عملیات</th>
      </Table.Header>
      <Table.Body>
        {tickets.map((ticket, index) => (
          <SupportRow
            key={ticket._id}
            ticket={ticket}
            index={index}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default SupportTable;