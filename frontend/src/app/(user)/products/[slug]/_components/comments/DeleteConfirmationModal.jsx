import { TrashIcon } from "@heroicons/react/24/outline";
import Button from "@/ui/Button";
import Modal from "@/ui/Modal";

function DeleteConfirmationModal({
  open,
  onClose,
  resourceName,
  disabled,
  onConfirm,
  isDeleting,
}) {
  const handleConfirm = (e) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <Modal open={open} onClose={onClose} title="حذف نظر" size="sm">
      <div>
        <h2 className="font-bold text-base mb-8 text-secondary-700">
          آیا از حذف{" "}
          <span className="text-primary-900 font-extrabold">
            " {resourceName} "
          </span>{" "}
          مطمین هستید؟
        </h2>
        <form onSubmit={handleConfirm}>
          <div className="flex justify-between items-center gap-x-16">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="btn btn--secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              لغو
            </button>

            <Button
              type="submit"
              disabled={disabled}
              variant="danger"
              className="flex gap-x-2 justify-center items-center flex-1"
              loading={disabled}
              loadingColor="#8b2c2c"
            >
              <TrashIcon className="w-5" />
              <span>حذف</span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;
