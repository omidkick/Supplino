import Table from "@/ui/Table";
import { toLocalDateShort } from "@/utils/dateFormatter";
import truncateText from "@/utils/trancateText";
import { SupportActionButtons } from "./SupportActionButtons";
import { highlightTextReact } from "@/utils/highlightText";
import { hasUnreadMessagesForAdmin } from "@/utils/ticketUtils";

const statusStyles = {
  open: "badge badge--primary",
  in_progress: "badge badge--yellow",
  resolved: "badge badge--success",
  closed: "badge badge--secondary",
};

const priorityStyles = {
  low: "badge badge--gray",
  medium: "badge badge--info",
  high: "badge badge--warning",
  urgent: "badge badge--error",
};

const categoryLabels = {
  technical: "فنی",
  billing: "مالی",
  general: "عمومی",
  feature_request: "درخواست ویژگی",
  bug: "گزارش خطا",
};

function SupportRow({ ticket, index, searchTerm = "", statusFilter = "" }) {
  const { title, category, status, createdAt, user, messages } = ticket;

  // Check if there are any unread user messages for admin
  const hasUnreadMessages = hasUnreadMessagesForAdmin(ticket);

  return (
    <Table.Row
      className={
        hasUnreadMessages
          ? "!bg-secondary-50 border-r-4 border-r-primary-500"
          : ""
      }
    >
      <td>
        <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 ">
          <img
            src={user?.avatarUrl || "/images/avatar.png"}
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover ring-2 ring-secondary-300"
          />
        </span>
      </td>

      {/* User Info with Avatar */}
      <td>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium text-secondary-900 text-sm">
              {user?.name || "نامشخص"}
            </span>
            <span className="text-secondary-500 text-xs">
              {user?.email || "ایمیل نامشخص"}
            </span>
          </div>
        </div>
      </td>

      <td>
        <div className="flex items-center gap-2">
          <span className="font-bold">
            {searchTerm
              ? highlightTextReact(truncateText(title, 30), searchTerm)
              : truncateText(title, 30)}
          </span>
          {hasUnreadMessages && (
            <span className="whitespace-nowrap px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl bg-rose-600 text-white text-xs">
              جدید
            </span>
          )}
        </div>
      </td>

      <td>
        <span className="badge badge--outline">
          {categoryLabels[category] || category}
        </span>
      </td>

      <td>
        <span className={statusStyles[status]}>
          {status === "open" && "باز"}
          {status === "in_progress" && "در حال بررسی"}
          {status === "resolved" && "حل شده"}
          {status === "closed" && "بسته شده"}
        </span>
      </td>

      <td>{toLocalDateShort(createdAt)}</td>

      <td>
        <div className="flex items-center justify-center gap-x-3">
          <SupportActionButtons ticket={ticket} />
        </div>
      </td>
    </Table.Row>
  );
}

export default SupportRow;