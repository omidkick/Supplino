// app/(admin)/admin/payments/_components/PaymentActionButtons.jsx
"use client";

import ButtonIcon from "@/ui/ButtonIcon";
import Modal from "@/ui/Modal";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { usePaymentActions } from "@/hooks/usePayments";
import { orderStatusLabels } from "@/utils/orderStatusLabels";

function ChangeOrderStatus({ payment }) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    payment.orderStatus || 1
  );

  const { mutateUpdateOrderStatus, isUpdatingOrderStatus } = usePaymentActions(
    payment._id
  );

  const handleStatusChange = () => {
    mutateUpdateOrderStatus({
      id: payment._id,
      data: { orderStatus: parseInt(selectedStatus) },
    });
    setOpen(false);
  };

  return (
    <>
      <ButtonIcon variant="edit" onClick={() => setOpen(true)}>
        <PencilSquareIcon />
      </ButtonIcon>

      <Modal
        title={<span>تغییر وضعیت سفارش</span>}
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-secondary-700 text-sm">
            وضعیت فعلی:{" "}
            <span className={orderStatusLabels[payment.orderStatus]?.className}>
              {orderStatusLabels[payment.orderStatus]?.label}
            </span>
          </p>

          <div className="space-y-3">
            <p className="text-secondary-700 font-medium">انتخاب وضعیت جدید:</p>
            <select
              id="change-status"
              name="change-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 rounded-lg border border-secondary-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              disabled={isUpdatingOrderStatus}
            >
              {Object.entries(orderStatusLabels).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn--outline"
              disabled={isUpdatingOrderStatus}
            >
              لغو
            </button>
            <button
              type="button"
              onClick={handleStatusChange}
              disabled={isUpdatingOrderStatus}
              className="btn btn--primary"
            >
              {isUpdatingOrderStatus ? "در حال بروزرسانی..." : "تایید"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ChangeOrderStatus;
