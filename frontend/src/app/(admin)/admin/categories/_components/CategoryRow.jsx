import Table from "@/ui/Table";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { toPersianDigits } from "@/utils/numberFormatter";
import truncateText from "@/utils/trancateText";
import { highlightTextReact } from "@/utils/highlightText";
import { DeleteCategory, EditCategory } from "./CategoryActionButtons";

function CategoryRow({ category, index, searchTerm = "" }) {
  const { title, createdAt, _id, englishTitle, description, type } = category;

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
        <span>
          {searchTerm
            ? highlightTextReact(truncateText(description, 50), searchTerm)
            : truncateText(description, 50)}
        </span>
      </td>
      <td>
        <span>
          {searchTerm
            ? highlightTextReact(englishTitle, searchTerm)
            : englishTitle}
        </span>
      </td>
      <td>
        <span>{toLocalDateShort(createdAt)}</span>
      </td>
      <td>
        <span className="badge badge--danger">{type}</span>
      </td>
      <td>
        <div className="flex items-center justify-center gap-x-3">
          <DeleteCategory category={category} />
          <EditCategory id={_id} category={category} />
        </div>
      </td>
    </Table.Row>
  );
}

export default CategoryRow;
