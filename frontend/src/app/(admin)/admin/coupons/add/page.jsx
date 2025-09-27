import Breadcrumbs from "@/ui/Breadcrumbs";
import AddCouponForm from "./components/AddCouponForm";

function AddCouponPage() {
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "پنل ادمین",
            href: "/admin",
          },
          {
            label: "کد های تخفیف",
            href: "/admin/coupons",
          },
          {
            label: "افزودن کد تخفیف جدید",
            href: "/admin/coupons/add",
            active: true,
          },
        ]}
      />
      <AddCouponForm />
    </div>
  );
}

export default AddCouponPage;
