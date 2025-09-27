import Table from "@/ui/Table";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { toPersianDigits } from "@/utils/numberFormatter";
import { orderStatusLabels } from "@/utils/orderStatusLabels";
import { paymentStatus } from "@/utils/paymentStatus";
import { toPersianNumbersWithComma } from "@/utils/toPersianNumbers";
import truncateText from "@/utils/trancateText";
import Link from "next/link";

export default function PostRow({ payment, index }) {
  const { invoiceNumber, description, createdAt, status, amount, cart, _id } =
    payment;
  const { productDetail } = cart || {};
  const statusInfo = paymentStatus[status] || {
    label: "نامشخص",
    className: "badge badge--gray",
  };

  const orderStatusInfo = orderStatusLabels[payment.orderStatus] || {
    label: "نامشخص",
    className: "badge badge--gray",
  };

  return (
    <Table.Row>
      <td>
        <span className="text-white bg-primary-800 font-bold py-1.5 px-3 rounded-full">
          {toPersianDigits(index + 1)}
        </span>
      </td>
      <td>{truncateText(invoiceNumber)}</td>
      <td>{truncateText(description, 30)}</td>
      <td>
        <div className="flex flex-col gap-y-2 items-start">
          {productDetail.map((p, i) => {
            return (
              <span className=" badge badge--secondary !text-xs" key={p._id}>
                {p.title}
              </span>
            );
          })}
        </div>
      </td>
      <td>{toPersianNumbersWithComma(amount)}</td>
      <td>{toLocalDateShort(createdAt)}</td>
      <td>
        <span className={statusInfo.className}>{statusInfo.label}</span>
      </td>

      <td>
        <span className={orderStatusInfo.className}>
          {orderStatusInfo.label}
        </span>
      </td>
      {/* Add details link column */}
      <td>
        <Link
          href={`/profile/payments/${_id}`}
          className="text-primary-600 hover:text-primary-800 font-medium text-sm"
        >
          مشاهده جزئیات
        </Link>
      </td>
    </Table.Row>
  );
}
