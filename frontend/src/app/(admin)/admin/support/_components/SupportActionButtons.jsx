"use client";

import ButtonIcon from "@/ui/ButtonIcon";
import ConfirmDelete from "@/ui/ConfirmDelete";
import Modal from "@/ui/Modal";
import truncateText from "@/utils/trancateText";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminSupportActions } from "@/hooks/useSupports";
import { HiEye } from "react-icons/hi";

// Show Ticket Details
export function ShowDetails({ ticket }) {
  return (
    <Link href={`/admin/support/${ticket._id}`}>
      <ButtonIcon variant="primary" title="مشاهده جزیات">
        <HiEye />
      </ButtonIcon>
    </Link>
  );
}

// Update Ticket Status
export function UpdateTicketStatus({ ticket }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(ticket.status);
  const { mutateUpdateTicketStatus, isUpdatingTicketStatus } =
    useAdminSupportActions();

  const statusId = `status-select-${ticket._id}`;

  const statusOptions = [
    { value: "open", label: "باز", color: "success" },
    { value: "in_progress", label: "در حال بررسی", color: "indigo" },
    { value: "resolved", label: "حل شده", color: "primary" },
    { value: "closed", label: "بسته شده", color: "secondary" },
  ];

  const handleStatusUpdate = () => {
    mutateUpdateTicketStatus(
      { id: ticket._id, status: selectedStatus },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      }
    );
  };

  return (
    <>
      <ButtonIcon
        variant="edit"
        onClick={() => setIsModalOpen(true)}
        title="تغییر وضعیت"
      >
        <ArrowPathIcon />
      </ButtonIcon>

      <Modal
        title={`تغییر وضعیت تیکت: ${truncateText(ticket.title, 25)}`}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor={statusId}
              className="block text-sm font-medium text-secondary-700 mb-2"
            >
              وضعیت جدید
            </label>
            <select
              id={statusId}
              name="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isUpdatingTicketStatus}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-secondary-600 hover:text-secondary-800 disabled:opacity-50"
              disabled={isUpdatingTicketStatus}
            >
              انصراف
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={
                isUpdatingTicketStatus || selectedStatus === ticket.status
              }
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingTicketStatus ? "در حال بروزرسانی..." : "تأیید"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// Delete Ticket
export function DeleteTicket({ ticket }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { mutateDeleteTicket, isDeletingTicket } = useAdminSupportActions();

  return (
    <>
      <ButtonIcon
        variant="red"
        onClick={() => setIsModalOpen(true)}
        title="حذف تیکت"
      >
        <TrashIcon />
      </ButtonIcon>

      <Modal
        title={`حذف تیکت: ${truncateText(ticket.title, 25)}`}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <ConfirmDelete
          resourceName={truncateText(ticket.title, 25)}
          onClose={() => setIsModalOpen(false)}
          onConfirm={(e) => {
            e.preventDefault();
            mutateDeleteTicket(ticket._id, {
              onSuccess: () => {
                setIsModalOpen(false);
                router.refresh();
              },
            });
          }}
          disabled={isDeletingTicket}
        />
      </Modal>
    </>
  );
}

// Main component that exports all action buttons
export function SupportActionButtons({ ticket }) {
  return (
    <div className="flex items-center gap-2">
      <ShowDetails ticket={ticket} />
      <UpdateTicketStatus ticket={ticket} />
      {/* <DeleteTicket ticket={ticket} /> */}
    </div>
  );
}
