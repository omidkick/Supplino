import Breadcrumbs from "@/ui/Breadcrumbs";
import AddCategoryForm from "./components/AddCategoryForm";

function AddCategoryPage() {
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "پنل ادمین",
            href: "/admin",
          },
          {
            label: "دسته بندی ها",
            href: "/admin/categories",
          },
          {
            label: "افزودن دسته بندی جدید",
            href: "/admin/categories/add",
            active: true,
          },
        ]}
      />
      <AddCategoryForm />
    </div>
  );
}

export default AddCategoryPage;
