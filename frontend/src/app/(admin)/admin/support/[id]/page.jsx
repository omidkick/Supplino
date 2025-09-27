"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminSupportActions } from "@/hooks/useSupports";
import Loader from "@/ui/Loader";
import {
  FiArrowRight,
  FiMessageSquare,
  FiUser,
  FiCalendar,
  FiHash,
  FiTag,
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { formatDate } from "@/utils/dateFormatter";
import { toPersianNumbers } from "@/utils/toPersianNumbers";
import Empty from "@/ui/Empty";
import Button from "@/ui/Button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import TextArea from "@/ui/TextArea";
import BackButton from "@/ui/BackButton";
import { IoSend } from "react-icons/io5";

const statusStyles = {
  open: "badge badge--success",
  in_progress: "badge badge--yellow",
  resolved: "badge badge--primary",
  closed: "badge badge--error",
};

const priorityStyles = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-yellow-100 text-yellow-800",
  urgent: "bg-red-100 text-red-800",
};

// Reusable InfoItem component
function InfoItem({ icon: Icon, label, value, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-400 flex-shrink-0" />
      <span className="text-secondary-500 text-xs sm:text-sm">{label}: </span>
      <span className="font-medium text-xs sm:text-sm">{value}</span>
    </div>
  );
}

// Reusable StatusBadge component
function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]} ${className}`}
    >
      {status === "open" && "باز"}
      {status === "in_progress" && "در حال بررسی"}
      {status === "resolved" && "حل شده"}
      {status === "closed" && "بسته شده"}
    </span>
  );
}

// Reusable PriorityBadge component
function PriorityBadge({ priority, className = "" }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[priority]} ${className}`}
    >
      {priority === "low" && "کم"}
      {priority === "medium" && "متوسط"}
      {priority === "high" && "بالا"}
      {priority === "urgent" && "فوری"}
    </span>
  );
}

// Reusable UserAvatar component
function UserAvatar({ user, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 sm:w-12 sm:h-12",
    lg: "w-14 h-14 sm:w-16 sm:h-16",
  };

  if (user?.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        alt={user.name}
        width={size === "sm" ? 32 : size === "md" ? 48 : 64}
        height={size === "sm" ? 32 : size === "md" ? 48 : 64}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-secondary-0 shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary-600 flex items-center justify-center text-secondary-0 font-medium text-sm sm:text-base`}
    >
      {user?.name?.charAt(0) || "U"}
    </div>
  );
}

// Reusable MessageBubble component
function MessageBubble({ message, isAdmin, userName, time }) {
  return (
    <div
      className={`flex gap-3 sm:gap-4 ${
        isAdmin ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div className="flex-shrink-0">
        <UserAvatar user={message.user} size="sm" />
      </div>
      <div className="flex-1">
        <div
          className={`p-3 sm:p-4 rounded-2xl ${
            isAdmin
              ? "bg-primary-50 border border-primary-200"
              : "bg-secondary-50 border border-secondary-200"
          }`}
        >
          <div className="mb-2 sm:mb-3">
            <div
              className={`font-medium text-xs sm:text-sm ${
                isAdmin ? "text-primary-700" : "text-secondary-700 text-left"
              }`}
            >
              {isAdmin ? "پشتیبانی" : userName}
            </div>
          </div>
          <p className={`text-secondary-700 text-xs sm:text-sm leading-relaxed ${isAdmin? "":"text-left"}`}>
            {message.message}
          </p>
          <div
            className={`text-xs text-secondary-500 mt-1 sm:mt-2 ${
              isAdmin ? "text-left" : "text-right"
            }`}
          >
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [replyMessage, setReplyMessage] = useState("");

  const {
    ticket,
    isLoadingSingleTicket,
    mutateAddAdminReply,
    isAddingAdminReply,
    mutateUpdateTicketStatus,
    isUpdatingTicketStatus,
    mutateMarkAsRead,
  } = useAdminSupportActions(id);

  // Format message time function
  const formatMessageTime = (dateString) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    const diffInMs = now - messageDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    // If message was sent today
    if (diffInDays === 0) {
      // Check if it's before or after 12 PM
      const isAfterNoon = now.getHours() >= 12 && messageDate.getHours() < 12;

      if (isAfterNoon && messageDate.getHours() < 12) {
        return (
          "دیروز " +
          messageDate.toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }

      // Today - show time
      return messageDate.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays === 1) {
      return (
        "دیروز " +
        messageDate.toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else if (diffInDays < 7) {
      return `${toPersianNumbers(diffInDays)} روز قبل`;
    } else {
      // More than 7 days - show full date
      return messageDate.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  // Handle textarea key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  // Mark ticket as read when component mounts
  useEffect(() => {
    if (id && !isLoadingSingleTicket && ticket) {
      // Check if ticket has unread user messages for admin
      const hasUnreadMessages = ticket.messages?.some(
        (msg) => !msg.isAdmin && !msg.isReadByAdmin
      );
      if (hasUnreadMessages) {
        mutateMarkAsRead(id);
      }
    }
  }, [id, isLoadingSingleTicket, ticket, mutateMarkAsRead]);

  if (isLoadingSingleTicket) {
    return <Loader message="در حال بارگذاری تیکت..." />;
  }

  const statusId = `status-select-${ticket._id}`;

  if (!ticket) return <Empty resourceName="تیکتی" />;

  const handleReply = () => {
    if (!replyMessage.trim()) return;

    mutateAddAdminReply(
      { id, message: replyMessage },
      {
        onSuccess: () => {
          setReplyMessage("");
        },
      }
    );
  };

  const handleStatusChange = (newStatus) => {
    mutateUpdateTicketStatus({ id, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-secondary-100">
      <div className="max-w-6xl mx-auto lg:px-8 py-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BackButton arrowClassName="w-5 h-5" />
            <h1 className="text-xl sm:text-2xl font-bold text-secondary-800">
              {ticket.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Messages */}
          <div className=" order-2 md:order-1 lg:w-2/3 space-y-6">
            {/* Ticket Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary-0 rounded-xl shadow-sm border border-secondary-200 p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <UserAvatar user={ticket.user} />
                <div>
                  <h3 className="font-semibold text-secondary-900 text-base">
                    {ticket.user?.name || "کاربر ناشناس"}
                  </h3>
                  {ticket.user?.phoneNumber && (
                    <p className="text-secondary-500 text-sm">
                      {toPersianNumbers(ticket.user.phoneNumber)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <InfoItem
                  icon={FiTag}
                  label="دسته‌بندی"
                  value={ticket.category}
                />
                <InfoItem
                  icon={FiAlertCircle}
                  label="اولویت"
                  value={<PriorityBadge priority={ticket.priority} />}
                />
                <InfoItem
                  icon={FiCalendar}
                  label="تاریخ ایجاد"
                  value={formatDate(ticket.createdAt)}
                  className="col-span-2"
                />
                <InfoItem
                  icon={FiHash}
                  label="شناسه"
                  value={`#${ticket._id.slice(-6)}`}
                />
              </div>

              {/* Status Selector */}
              <div className="mb-6">
                <label
                  htmlFor={statusId}
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  وضعیت تیکت
                </label>
                <select
                  id={statusId}
                  name="status"
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  disabled={isUpdatingTicketStatus}
                >
                  <option value="open">باز</option>
                  <option value="in_progress">در حال بررسی</option>
                  <option value="resolved">حل شده</option>
                  <option value="closed">بسته شده</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-secondary-800 mb-3">
                  شرح تیکت
                </h4>
                <p className="text-secondary-700 bg-secondary-50 p-4 rounded-lg secondary-0space-pre-wrap text-sm">
                  {ticket.description}
                </p>
              </div>
            </motion.div>

            {/* Messages  */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary-0 rounded-xl shadow-sm border border-secondary-200 p-6 lg:order-2"
            >
              <h2 className="text-xl font-semibold text-secondary-800 mb-6 flex items-center gap-2">
                <FiMessageSquare className="w-5 h-5" />
                مکاتبات
              </h2>

              <div className="space-y-6">
                {ticket.messages.map((message, index) => (
                  <MessageBubble
                    key={index}
                    message={message}
                    isAdmin={message.isAdmin}
                    userName={ticket.user?.name}
                    time={formatMessageTime(message.createdAt)}
                  />
                ))}
              </div>

              {/* Reply Form */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                  پاسخ ادمین
                </h3>
                <TextArea
                  value={replyMessage}
                  id="admin-reply"
                  name="adminReply"
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="پاسخ خود را اینجا بنویسید..."
                  rows={3}
                  className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-sm"
                  disabled={isAddingAdminReply}
                />
                <Button
                  onClick={handleReply}
                  loading={isAddingAdminReply}
                  disabled={!replyMessage.trim() || isAddingAdminReply}
                  className="mt-4 flex items-center gap-2 w-full sm:w-auto"
                  size="sm"
                >
                  <IoSend className="w-4 h-4" />
                  ارسال پاسخ
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Ticket Info */}
          <div className="lg:order-1 lg:w-1/3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary-0 rounded-xl shadow-sm border border-secondary-200 p-6"
            >
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                اطلاعات تیکت
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-secondary-500 mb-1">
                    وضعیت فعلی
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>

                <div>
                  <div className="text-sm text-secondary-500 mb-1">اولویت</div>
                  <PriorityBadge priority={ticket.priority} />
                </div>

                <div>
                  <div className="text-sm text-secondary-500 mb-1">
                    تعداد پیام‌ها
                  </div>
                  <div className="text-secondary-800 font-medium text-sm">
                    {toPersianNumbers(ticket.messages.length)} پیام
                  </div>
                </div>

                <div>
                  <div className="text-sm text-secondary-500 mb-1">
                    آخرین بروزرسانی
                  </div>
                  <div className="text-secondary-800 font-medium text-sm">
                    {formatDate(ticket.updatedAt)}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-secondary-0 rounded-xl shadow-sm border border-secondary-200 p-6"
            >
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                اطلاعات کاربر
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FiUser className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-700 text-sm">
                    {ticket.user?.name || "نامشخص"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-700 text-sm">
                    {ticket.user?.email}
                  </span>
                </div>
                {ticket.user?.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-4 h-4 text-secondary-400" />
                    <span className="text-secondary-700 text-sm">
                      {toPersianNumbers(ticket.user.phoneNumber)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  {ticket.user?.isActive ? (
                    <FiCheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <FiXCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-secondary-700 text-sm">
                    {ticket.user?.isActive ? "حساب فعال" : "حساب غیرفعال"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
