"use client";

import Table from "@/ui/Table";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { formatPrice } from "@/utils/formatPrice";
import { toPersianDigits } from "@/utils/numberFormatter";
import truncateText from "@/utils/trancateText";
import { DeleteCoupon, EditCoupon } from "./CouponButtons";
import { toPersianNumbers } from "@/utils/toPersianNumbers";

function CouponRow({ coupon, index }) {
  const {
    _id,
    amount,
    createdAt,
    code,
    type,
    expireDate,
    usageCount,
    usageLimit,
    productIds,
  } = coupon;

  return (
    <Table.Row>
      {/* Index */}
      <td>
        <span className="text-white bg-primary-900 font-bold py-1.5 px-3 rounded-full">
          {toPersianDigits(index + 1)}
        </span>
      </td>

      {/* code */}
      <td>
        <span className="badge badge--danger font-bold">
          {toPersianDigits(code)}
        </span>
      </td>

      {/* Type */}
      <td>{type === "percentage" ? "درصدی" : "مبلغ ثابت"}</td>

      {/* Amount */}
      <td>
        <span className="font-bold text-primary-900">
          {type === "percentage"
            ? `${toPersianNumbers(amount)} %`
            : formatPrice(amount)}
        </span>
      </td>

      {/* Products */}
      <td>
        <div className="flex flex-col gap-y-2 items-center">
          {productIds.length === 0 ? (
            <span className="badge badge--danger text-xs">فاقد محصول </span>
          ) : (
            productIds.map((p, i) => {
              return (
                <span className=" badge badge--secondary !text-xs" key={i}>
                  {truncateText(p.title || "", 30)}
                </span>
              );
            })
          )}
        </div>
      </td>

      {/* usageCount */}
      <td>{toPersianDigits(usageCount)}</td>

      {/* usageLimit */}
      <td>{toPersianDigits(usageLimit)}</td>

      {/* expireDate */}
      <td>
        <span className="text-sm">{toLocalDateShort(expireDate)}</span>
      </td>

      {/* Actions */}
      <td>
        <div className="flex items-center justify-center gap-x-3">
          <DeleteCoupon coupon={coupon} />
          <EditCoupon id={_id} />
        </div>
      </td>
    </Table.Row>
  );
}

export default CouponRow;
