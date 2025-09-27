"use client";

import Table from "@/ui/Table";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { toPersianDigits } from "@/utils/numberFormatter";
import truncateText from "@/utils/trancateText";
import Link from "next/link";
import { HiEye } from "react-icons/hi";
import { ChangeStatusComment, DeleteComment } from "./CommentButtons";

const statusStyle = [
  {
    label: "رد شده",
    className: "badge--danger",
  },
  {
    label: "در انتظار تایید",
    className: "badge--yellow",
  },
  {
    label: "تایید شده",
    className: "badge--success",
  },
];

function CommentRow({ comment, index }) {
  const { _id, content, user, product, status, createdAt, answers } = comment;

  return (
    <Table.Row>
      {/* Index */}
      <td>
        <span className="text-white bg-primary-900 font-bold py-1.5 px-3 rounded-full">
          {toPersianDigits(index + 1)}
        </span>
      </td>

      {/* Content */}
      <td>
        <span className="font-bold">
          {truncateText(content.text || "", 30)}
        </span>
      </td>

      {/* User */}
      <td>
        <span className="font-bold text-primary-900">{user.name}</span>
      </td>

      {/* Product */}
      <td>
        <span className="badge badge--secondary !text-xs">
          {truncateText(product.title || "", 30)}
        </span>
      </td>

      {/* Status */}
      <td>
        <span className={`badge ${statusStyle[status].className}`}>
          {statusStyle[status].label}
        </span>
      </td>

      {/* Created At */}
      <td>
        <span className="text-sm">{toLocalDateShort(createdAt)}</span>
      </td>

      {/* Reply Count */}
      <td>
        <span className="font-bold text-primary-900">
          {toPersianDigits(answers.length)}
        </span>
      </td>

      {/* Actions */}
      <td>
        <div className="flex items-center justify-center gap-x-3">
          <DeleteComment comment={comment} />
          <ChangeStatusComment comment={comment} />

        </div>
      </td>

      {/* View */}
      <td>
        <Link
          href={`/admin/comments/${_id}`}
          className="flex items-center justify-center"
        >
          <HiEye className="w-6 h-6 text-secondary-400 hover:text-primary-900 transition-all duration-300" />
        </Link>
      </td>
    </Table.Row>
  );
}

export default CommentRow;
