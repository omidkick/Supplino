// UpdateCommentForm.jsx
"use client";

// Imports
import { useForm } from "react-hook-form";
import RHFSelect from "@/ui/RHFSelect";
import Loading from "@/ui/Loading";
import Button from "@/ui/Button";
import { useRouter } from "next/navigation";
import { useUpdateCommentStatus } from "@/hooks/useComment";

// Options
const options = [
  { _id: 0, title: "رد شده" },
  { _id: 1, title: "در انتظار تایید" },
  { _id: 2, title: "تایید شده" },
];

// UpdateCommentForm.jsx - Add debugging
function UpdateCommentForm({ comment, onClose }) {
  const { updateStatus, isUpdatingStatus } = useUpdateCommentStatus();
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      status: String(comment.status),
    },
  });

  const currentStatus = watch("status");
  const isUnchanged = currentStatus === String(comment.status);

  const onSubmit = (data) => {
    const statusValue = parseInt(data.status);

    updateStatus(
      {
        id: comment._id,
        status: statusValue,
      },
      {
        onSuccess: () => {
          onClose();
          router.refresh();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form space-y-4">
      <RHFSelect
        label="تغییر وضعیت"
        name="status"
        register={register}
        options={options}
        isRequired={true}
        errors={errors}
      />

      {isUpdatingStatus ? (
        <Loading />
      ) : (
        <Button
          variant="primary"
          type="submit"
          className="w-full"
          disabled={isUnchanged}
        >
          تایید
        </Button>
      )}
    </form>
  );
}

export default UpdateCommentForm;
