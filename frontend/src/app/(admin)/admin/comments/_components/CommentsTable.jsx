"use client";

import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import CommentRow from "./CommentRow";

function CommentsTable({ comments }) {
  if (!comments.length) return <Empty resourceName="نظری" />;

return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>محتوا</th>
        <th>کاربر</th>
        <th>محصول</th>
        <th>وضعیت</th>
        <th>تاریخ ایجاد</th>
        <th>تعداد پاسخ‌ها</th>
        <th>عملیات</th>
        <th>مشاهده</th>
      </Table.Header>
      <Table.Body>
        {comments.map((comment, index) => (
          <CommentRow key={comment._id} comment={comment} index={index} />
        ))}
      </Table.Body>
    </Table>
  );
}

export default CommentsTable;
