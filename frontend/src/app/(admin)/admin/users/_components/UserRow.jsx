import Table from "@/ui/Table";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { toPersianDigits } from "@/utils/numberFormatter";
import truncateText from "@/utils/trancateText";
import Link from "next/link";
import { HiEye } from "react-icons/hi";
import { HiMiniCheckBadge } from "react-icons/hi2";

function UserRow({ user, index }) {
  const {
    name,
    email,
    phoneNumber,
    Products,
    isActive,
    _id,
    createdAt,
    avatarUrl,
  } = user;

  return (
    <Table.Row>
      <td>
        <span className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 ">
          <img
            src={avatarUrl || "/images/avatar.png"}
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover ring-2 ring-secondary-300"
          />
        </span>
      </td>
      <td>
        <span className="flex items-center justify-center font-bold ">
          {truncateText(name || "--", 20)}
        </span>
      </td>
      <td>{email || "-"}</td>
      <td>
        <div className="flex whitespace-nowrap items-center gap-x-1">
          <span className="text-base">
            {toPersianDigits(phoneNumber || "--")}
          </span>
          <HiMiniCheckBadge className="w-6 h-6 text-success" />
        </div>
      </td>
      {/* <td>
        <div className="flex flex-col gap-y-2 items-center">
          {Products.length === 0 ? (
            <span className="badge badge--danger text-xs">فاقد محصول </span>
          ) : (
            Products.map((p, i) => {
              return (
                <span className=" badge badge--secondary !text-xs" key={i}>
                  {truncateText(p.title || "", 30)}
                </span>
              );
            })
          )}
        </div>
      </td> */}

      <td>
        <span>
          {isActive ? (
            <span className="badge badge--success !text-xs">فعال</span>
          ) : (
            <span className="badge badge--error !text-xs">نافعال</span>
          )}
        </span>
      </td>
      <td>{toLocalDateShort(createdAt)}</td>
      <td>
        <Link
          href={`/admin/users/${_id}`}
          className="flex items-center justify-center"
        >
          <HiEye className="w-6 h-6 text-secondary-400 hover:text-primary-900 transition-all duration-300" />
        </Link>
      </td>
    </Table.Row>
  );
}

export default UserRow;
