"use client";

import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import Fallback from "@/ui/Fallback";
import TicketRow from "./TicketRow";

function TicketTable({ userTickets, isLoading, isReceived = false }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Fallback />
      </div>
    );
  }

  if (!userTickets || userTickets.length === 0)
    return <Empty resourceName="تیکتی" />;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>عنوان تیکت</th>
        <th>دسته بندی</th>
        <th>اولویت</th>
        <th>وضعیت</th>
        <th>تاریخ ایجاد</th>
        <th>آخرین بروزرسانی</th>
        <th>عملیات</th>
      </Table.Header>
      <Table.Body>
        {userTickets.map((ticket, index) => (
          <TicketRow
            key={ticket._id}
            ticket={ticket}
            index={index}
            isReceived={isReceived}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default TicketTable;
