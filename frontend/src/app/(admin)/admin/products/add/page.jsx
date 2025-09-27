import Breadcrumbs from "@/ui/Breadcrumbs";
import React from "react";
import AddProductForm from "./_/AddProductForm";

function AddProductPage() {
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "پنل ادمین",
            href: "/admin",
          },
          {
            label: "محصولات",
            href: "/admin/products",
          },
          {
            label: "افزودن محصول",
            href: "/admin/products/add",
            active: true,
          },
        ]}
      />
      <AddProductForm />
    </div>
  );
}

export default AddProductPage;
