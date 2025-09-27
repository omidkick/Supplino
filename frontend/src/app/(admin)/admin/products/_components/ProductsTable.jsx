"use client";

import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import ProductRow from "./ProductRow";
import { useSearchParams } from "next/navigation";

function ProductsTable({ products }) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  if (!products.length) return <Empty resourceName="محصولی" />;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>عنوان</th>
        <th>دسته بندی</th>
        <th>قیمت</th>
        <th>تخفیف</th>
        <th>قیمت با تخفیف</th>
        <th>موجودی</th>
        <th>عملیات</th>
        <th>مشاهده</th>
      </Table.Header>
      <Table.Body>
        {products.map((product, index) => (
          <ProductRow
            key={product._id}
            product={product}
            index={index}
            searchTerm={searchTerm}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default ProductsTable;
