import Breadcrumbs from "@/ui/Breadcrumbs";
import React from "react";
import { getOneProductById } from "@/services/productService";
import { notFound } from "next/navigation";
import AddProductForm from "../../add/_/AddProductForm";

async function EditProductPage({ params }) {
  const { id } = await params;

  const { product } = await getOneProductById(id);

  if (!product) {
    notFound();
  }
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
            label: "ویرایش محصول",
            href: `/admin/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <AddProductForm productToEdit={product} />
    </div>
  );
}

export default EditProductPage;
