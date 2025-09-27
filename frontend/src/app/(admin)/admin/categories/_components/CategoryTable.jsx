"use client";

import Empty from "@/ui/Empty";
import Table from "@/ui/Table";
import CategoryRow from "./CategoryRow";
import { useSearchParams } from "next/navigation";

function CategoryTable({ categories }) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  if (!categories.length) return <Empty resourceName="دسته بندی" />;

  return (
    <Table>
      <Table.Header>
        <th>#</th>
        <th>عنوان</th>
        <th>توضیحات</th>
        <th>عنوان انگلیسی</th>
        <th>تاریخ ایجاد</th>
        <th>نوع</th>
        <th>عملیات</th>
      </Table.Header>
      <Table.Body>
        {categories.map((category, index) => (
          <CategoryRow 
            key={category._id} 
            category={category} 
            index={index} 
            searchTerm={searchTerm}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default CategoryTable;