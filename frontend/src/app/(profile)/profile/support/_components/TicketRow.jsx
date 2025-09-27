import Table from "@/ui/Table";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { toPersianDigits } from "@/utils/numberFormatter";
import Link from "next/link";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DeleteTicket } from "./SupportButtons";
import { hasUnreadMessagesForUser } from "@/utils/ticketUtils";

// Support status styles
const supportStatus = {
  open: {
    label: "باز",
    className: "badge badge--success",
  },
  in_progress: {
    label: "در حال بررسی",
    className: "badge badge--indigo",
  },
  resolved: {
    label: "حل شده",
    className: "badge badge--primary",
  },
  closed: {
    label: "بسته شده",
    className: "badge badge--secondary",
  },
};

// Priority styles
const priorityStyles = {
  low: {
    label: "کم",
    className: "badge badge--gray",
  },
  medium: {
    label: "متوسط",
    className: "badge badge--info",
  },
  high: {
    label: "بالا",
    className: "badge badge--warning",
  },
  urgent: {
    label: "فوری",
    className: "badge badge--error",
  },
};

// Category labels
const categoryLabels = {
  technical: "فنی",
  billing: "مالی",
  general: "عمومی",
  feature_request: "درخواست ویژگی",
  bug: "گزارش خطا",
};

// In TicketRow.jsx
export default function TicketRow({ ticket, index, isReceived = false }) {
  const {
    _id,
    title,
    category,
    priority,
    status,
    createdAt,
    updatedAt,
    messages,
  } = ticket;

  const statusInfo = supportStatus[status] || {
    label: "نامشخص",
    className: "badge badge--warning",
  };

  const priorityInfo = priorityStyles[priority] || {
    label: "نامشخص",
    className: "badge badge--warning",
  };

  const hasUnreadMessages = hasUnreadMessagesForUser(ticket);

  return (
    <Table.Row
      className={
        hasUnreadMessages
          ? "bg-secondary-300 border-r-4 border-primary-800"
          : ""
      }
    >
      <td>
        <span className="text-white bg-primary-800 font-bold py-1.5 px-3 rounded-full">
          {toPersianDigits(index + 1)}
        </span>
      </td>
      <td className="font-medium text-secondary-900">
        <div className="flex items-center">
          {title}
          {hasUnreadMessages && (
            <span className="mr-2 badge badge--error text-xs">جدید</span>
          )}
        </div>
      </td>
      <td>
        <span className="badge badge--outline">
          {categoryLabels[category] || category}
        </span>
      </td>
      <td>
        <span className={priorityInfo.className}>{priorityInfo.label}</span>
      </td>
      <td>
        <span className={statusInfo.className}>{statusInfo.label}</span>
      </td>
      <td>{toLocalDateShort(createdAt)}</td>
      <td>{toLocalDateShort(updatedAt)}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/support/${_id}`}
            className="btn btn--secondary text-xs inline-flex items-center gap-1"
          >
            <EyeIcon className="w-4 h-4" />
            مشاهده
          </Link>

          {/* Show delete button only for user's own tickets (sent) */}
          {!isReceived && <DeleteTicket ticket={ticket} />}
        </div>
      </td>
    </Table.Row>
  );
}
