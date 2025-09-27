"use client";

import { useSupportActions } from "@/hooks/useSupports";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/ui/Button";
import Loading from "@/ui/Loading";
import { toPersianDigits } from "@/utils/numberFormatter";
import {
  ArrowLeftIcon,
  TrashIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import { formatDate, toLocalDateShort } from "@/utils/dateFormatter";
import TextArea from "@/ui/TextArea"; // Fixed casing to match file name
import Modal from "@/ui/Modal";
import ConfirmDelete from "@/ui/ConfirmDelete";
import BackButton from "@/ui/BackButton";
import { FiMessageSquare, FiUser, FiCalendar, FiHash, FiTag, FiAlertCircle, FiMail, FiPhone, FiCheckCircle, FiXCircle } from "react-icons/fi";

const supportStatus = {
  open: { label: "باز", className: "badge badge--success" },
  in_progress: { label: "در حال بررسی", className: "badge badge--indigo" },
  resolved: { label: "حل شده", className: "badge badge--primary" },
  closed: { label: "بسته شده", className: "badge badge--secondary" },
};

const priorityStyles = {
  low: { label: "کم", className: "badge badge--gray" },
  medium: { label: "متوسط", className: "badge badge--info" },
  high: { label: "بالا", className: "badge badge--warning" },
  urgent: { label: "فوری", className: "badge badge--error" },
};

const categoryLabels = {
  technical: "فنی",
  billing: "مالی",
  general: "عمومی",
  feature_request: "درخواست ویژگی",
  bug: "گزارش خطا",
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

// Reusable UserAvatar component
function UserAvatar({ user, isAdmin = false, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-secondary-0 shadow-sm`}
        loading="lazy"
      />
    );
  }
  
  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${
        isAdmin ? "bg-blue-500" : "bg-primary-600"
      } flex items-center justify-center text-secondary-0 font-medium text-sm border-2 border-secondary-0 shadow-sm`}
    >
      {user?.name?.charAt(0) || "U"}
    </div>
  );
}

// Reusable MessageBubble component (aligned with admin style)
function MessageBubble({ message, isAdmin, userName, time }) {
  return (
    <div className={`flex gap-3 sm:gap-4 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}>
      <div className="flex-shrink-0">
        <UserAvatar user={message.user} isAdmin={isAdmin} size="sm" />
      </div>
      <div className="flex-1">
        <div
          className={`p-3 sm:p-4 rounded-2xl ${
            isAdmin
              ? "bg-secondary-50 border border-secondary-200"
              : "bg-primary-50 border border-primary-200"
          } ${
            isAdmin && !message.isReadByUser ? "ring-2 ring-yellow-400" : ""
          }`}
        >
          <div className="mb-2 sm:mb-3">
            <div
              className={`font-medium text-xs sm:text-sm ${
                isAdmin ? "text-primary-700 text-left" : "text-secondary-700"
              }`}
            >
              {isAdmin ? "پشتیبانی" : userName}
            </div>
          </div>
          <p className="text-secondary-700 text-xs sm:text-sm leading-relaxed">
            {message.message}
          </p>
          <div
            className={`text-xs text-secondary-500 mt-1 sm:mt-2 `}
          >
            {time}
          </div>
          {isAdmin && !message.isReadByUser && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                جدید
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Format message time function (same as admin)
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
      return "دیروز " + messageDate.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    
    // Today - show time
    return messageDate.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInDays === 1) {
    return "دیروز " + messageDate.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInDays < 7) {
    return `${toPersianDigits(diffInDays)} روز قبل`;
  } else {
    // More than 7 days - show full date
    return messageDate.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

function TicketDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [replyMessage, setReplyMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    ticket,
    isLoadingSingleTicket,
    mutateAddReply,
    isAddingReply,
    mutateMarkAsRead,
    mutateDeleteTicket,
    isDeletingTicket,
  } = useSupportActions(id);

  // Check for unread admin messages using the new property
  const hasUnreadAdminMessages = useCallback((ticket) => {
    return (
      ticket?.messages?.some((message) => message.isAdmin && !message.isReadByUser) ||
      false
    );
  }, []);

  const canReply = useMemo(() => {
    return (
      ticket && (ticket.status === "open" || ticket.status === "in_progress")
    );
  }, [ticket]);

  // Mark as read when page loads if there are unread admin messages
  useEffect(() => {
    if (ticket && hasUnreadAdminMessages(ticket)) {
      mutateMarkAsRead(id);
    }
  }, [ticket, id, mutateMarkAsRead, hasUnreadAdminMessages]);

  const handleDeleteTicket = useCallback(() => {
    mutateDeleteTicket(id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        router.push("/profile/support");
      },
    });
  }, [id, mutateDeleteTicket, router]);

  const handleReply = useCallback(() => {
    if (!replyMessage.trim()) return;

    mutateAddReply(
      { id, message: replyMessage },
      {
        onSuccess: () => {
          setReplyMessage("");
        },
      }
    );
  }, [replyMessage, id, mutateAddReply]);

  // Handle textarea key press (Enter to submit)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  if (isLoadingSingleTicket) {
    return (
      <div className="min-h-screen bg-secondary-100 flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-secondary-100 flex items-center justify-center">
        <div className="text-center py-12 bg-secondary-0 rounded-lg shadow-sm p-8 max-w-md mx-4">
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <p className="text-secondary-600 mb-6">تیکت یافت نشد</p>
          <Button
            variant="outline"
            onClick={() => router.push("/profile/support")}
            className="flex items-center gap-2 mx-auto"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            بازگشت به لیست تیکت‌ها
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = supportStatus[ticket.status] || supportStatus.open;
  const priorityInfo = priorityStyles[ticket.priority] || priorityStyles.medium;

  return (
    <div className="min-h-screen bg-secondary-100 py-6">
      <div className="max-w-4xl mx-auto lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <BackButton arrowClassName="w-5 h-5" />
            <h1 className="text-xl font-bold text-secondary-800">
              {ticket.title}
            </h1>
          </div>

          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            loading={isDeletingTicket}
            className="flex items-center gap-2"
          >
            <TrashIcon className="w-4 h-4" />
            حذف تیکت
          </Button>
        </div>

        {/* Ticket Info */}
        <div className="bg-secondary-0 rounded-lg shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              <span className={statusInfo.className}>{statusInfo.label}</span>
              <span className={priorityInfo.className}>
                {priorityInfo.label}
              </span>
              <span className="badge badge--outline">
                {categoryLabels[ticket.category] || ticket.category}
              </span>
            </div>
            <div className="text-sm text-secondary-500 flex items-center gap-1">
              <FiHash className="w-4 h-4" />
              {toPersianDigits(ticket._id.slice(-6))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
            <InfoItem 
              icon={FiCalendar} 
              label="تاریخ ایجاد" 
              value={toLocalDateShort(ticket.createdAt)} 
            />
            <InfoItem 
              icon={FiCalendar} 
              label="آخرین بروزرسانی" 
              value={toLocalDateShort(ticket.updatedAt)} 
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-secondary-800 mb-3 flex items-center gap-2">
              <FiMessageSquare className="w-5 h-5" />
              شرح تیکت
            </h2>
            <p className="text-secondary-700 bg-secondary-50 p-4 rounded-lg whitespace-pre-wrap border border-secondary-200">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-secondary-0 rounded-lg shadow-sm border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-800 mb-6 flex items-center gap-2">
            <FiMessageSquare className="w-5 h-5" />
            مکاتبات
          </h2>

          <div className="space-y-6 mb-6">
            {ticket.messages.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                isAdmin={message.isAdmin}
                userName={ticket.user?.name || "شما"}
                time={formatMessageTime(message.createdAt)}
              />
            ))}
          </div>

          {/* Reply Form */}
          {canReply && (
            <div className="border-t pt-6">
              <h3 className="text-md font-semibold text-secondary-800 mb-4 flex items-center gap-2">
                <PaperAirplaneIcon className="w-5 h-5" />
                پاسخ شما
              </h3>
              <TextArea
                id="reply-message"
                name="replyMessage"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="پاسخ خود را اینجا بنویسید..."
                rows={4}
                className="mb-4 border-secondary-300 focus:border-primary-500"
                disabled={isAddingReply}
              />
              <Button
                onClick={handleReply}
                loading={isAddingReply}
                disabled={!replyMessage.trim() || isAddingReply}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                ارسال پاسخ
              </Button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="حذف تیکت"
          size="sm"
        >
          <ConfirmDelete
            resourceName={ticket.title}
            onClose={() => setShowDeleteModal(false)}
            disabled={isDeletingTicket}
            onConfirm={handleDeleteTicket}
          />
        </Modal>
      </div>
    </div>
  );
}

export default TicketDetailsPage;