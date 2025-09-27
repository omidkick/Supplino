"use client";

import Table from "@/ui/Table";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { formatPrice } from "@/utils/formatPrice";
import { toPersianDigits } from "@/utils/numberFormatter";
import Link from "next/link";
import { HiEye } from "react-icons/hi";
import { usePaymentActions } from "@/hooks/usePayments";
import ChangeOrderStatus from "./PaymentActionButtons";

// Order status mapping
export const orderStatusLabels = {
  1: {
    label: "در حال پردازش",
    className: "badge badge--secondary",
  },
  2: {
    label: "تحویل به پست",
    className: "badge badge--yellow",
  },
  3: {
    label: "تحویل شده",
    className: "badge badge--success",
  },
};

// Payment status mapping
const PAYMENT_STATUS = {
  PENDING: { text: "در انتظار", class: "badge--warning" },
  COMPLETED: { text: "تکمیل شده", class: "badge--success" },
  FAILED: { text: "ناموفق", class: "badge--danger" },
};

function PaymentRow({ payment, index }) {
  const {
    _id,
    invoiceNumber,
    paymentMethod,
    amount,
    status,
    isPaid,
    user,
    createdAt,
    orderStatus,
  } = payment;

  const { isUpdatingOrderStatus } = usePaymentActions(_id);

  return (
    <Table.Row>
      {/* Index */}
      <td>
        <span className="text-white bg-primary-900 font-bold py-1.5 px-3 rounded-full">
          {toPersianDigits(index + 1)}
        </span>
      </td>

      {/* Invoice Number */}
      <td>
        <span className="font-bold text-sm">
          {toPersianDigits(invoiceNumber)}
        </span>
      </td>

      {/* User */}
      <td>
        <div className="flex flex-col">
          <span className="font-medium">{user?.name || "نامشخص"}</span>
          <span className="text-xs text-secondary-500">
            {toPersianDigits(user?.phoneNumber || "")}
          </span>
        </div>
      </td>

      {/* Amount */}
      <td>
        <span className="font-bold text-primary-900">
          {formatPrice(amount)}
        </span>
      </td>

      {/* Payment Status */}
      <td>
        <span
          className={`badge ${
            PAYMENT_STATUS[status]?.class || "badge--secondary"
          }`}
        >
          {PAYMENT_STATUS[status]?.text || status}
        </span>
      </td>


      {/* Payment Date */}
      <td>
        <span className="text-sm">{toLocalDateShort(createdAt)}</span>
      </td>

      {/* Order Status*/}
      <td>
        <span
          className={`${
            orderStatusLabels[orderStatus]?.className ||
            "badge badge--secondary"
          }`}
        >
          {orderStatusLabels[orderStatus]?.label || "نامشخص"}
        </span>
        {isUpdatingOrderStatus && (
          <div className="inline-block ml-2 w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        )}
      </td>


      {/* Actions - change orderStatus*/}
      <td>
        <div className="flex items-center justify-center ">
          <ChangeOrderStatus payment={payment} />
        </div>
      </td>

      {/* View Details */}
      <td>
        <Link
          href={`/admin/payments/${_id}`}
          className="flex items-center justify-center"
        >
          <HiEye className="w-6 h-6 text-secondary-400 hover:text-primary-900 transition-all duration-300" />
        </Link>
      </td>
    </Table.Row>
  );
}

export default PaymentRow;
