import { TrashIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

function ConfirmDelete({ resourceName, onClose, disabled, onConfirm }) {
  return (
    <div>
      <h2 className="font-bold text-base mb-8 text-secondary-700">
        آیا از حذف{" "}
        <span className="text-primary-900 font-extrabold">
          " {resourceName} "
        </span>{" "}
        مطمین هستید؟
      </h2>
      <form onSubmit={onConfirm}>
        <div className="flex justify-between items-center gap-x-16">
          <Button
            className="flex-1"
            variant="outline"
            onClick={onClose}
            type="button"
          >
            لغو
          </Button>
          <Button
            type="submit"
            onClick={onConfirm}
            disabled={disabled}
            variant="danger"
            className="flex gap-x-2 justify-center items-center flex-1"
          >
            <TrashIcon className="w-5" />
            <span>حذف</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
export default ConfirmDelete;
