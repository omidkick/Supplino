import Table from "@/ui/Table";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { formatPrice } from "@/utils/formatPrice";
import { toPersianDigits } from "@/utils/numberFormatter";
import truncateText from "@/utils/trancateText";
import Link from "next/link";
import { HiEye } from "react-icons/hi";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { DeleteProduct, EditProduct } from "./ProductActionButtons";
import { highlightTextReact } from "@/utils/highlightText"; // Import the utility

function ProductRow({ product, index, searchTerm = "" }) {
  const {
    brand,
    title,
    countInStock,
    discount,
    price,
    offPrice,
    tags,
    category,
    createdAt,
    _id,
  } = product;

  return (
    <Table.Row>
      <td>
        <span className="text-white bg-primary-800 font-bold py-1.5 px-3 rounded-full">
          {toPersianDigits(index + 1)}
        </span>
      </td>
      <td>
        <span className="font-bold">
          {searchTerm
            ? highlightTextReact(truncateText(title, 30), searchTerm)
            : truncateText(title, 30)}
        </span>
      </td>
      <td>
        <span className="badge badge--danger">
          {category?.title
            ? searchTerm
              ? highlightTextReact(category.title, searchTerm)
              : category.title
            : "N/A"}
        </span>
      </td>
      <td>
        <span className="">{formatPrice(price)}</span>
      </td>
      <td>
        <span className="badge badge--error">{toPersianDigits(discount)}%</span>
      </td>
      <td>
        <span className="">{formatPrice(offPrice)}</span>
      </td>

      <td>
        <span>{toPersianDigits(countInStock)}</span>
      </td>

      <td>
        <div className="flex items-center justify-center gap-x-3">
          <DeleteProduct product={product} />
          <EditProduct id={_id} />
        </div>
      </td>

      <td>
        <Link
          href={`/admin/products/${_id}`}
          className="flex items-center justify-center"
        >
          <HiEye className="w-6 h-6 text-secondary-400 hover:text-primary-900 transition-all duration-300" />
        </Link>
      </td>
    </Table.Row>
  );
}

export default ProductRow;
