"use client";

import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import Fallback from "@/ui/Fallback";
import UserRow from "./UserRow";
import Loader from "@/ui/Loader";

function UsersTable({ users }) {
  if (!users.length) return <Empty resourceName="کاربری" />;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>نام</th>
        <th>ایمیل</th>
        <th>شماره موبایل</th>
        {/* <th>محصولات</th> */}
        <th>وضعیت</th>
        <th>تاریخ عضویت</th>
        <th>مشاهده</th>
      </Table.Header>
      <Table.Body>
        {users.map((user, index) => (
          <UserRow key={user._id} user={user} index={index} />
        ))}
      </Table.Body>
    </Table>
  );
}

export default UsersTable;
