"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/productService";
import ProductsTable from "../products/_components/ProductsTable";
import Loading from "@/ui/Loading";
import Empty from "@/ui/Empty";

function LatestProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["latest-products"],
    queryFn: () => getAllProducts("sort=latest&limit=5"),
  });

  if (isLoading) return <Loading />;
  if (!data?.products?.length) return <Empty resourceName="محصولی" />;

  return <ProductsTable products={data.products} />;
}

export default LatestProducts;