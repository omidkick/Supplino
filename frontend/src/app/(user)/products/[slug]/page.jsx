import { getAllProducts, getOneProductBySlug } from "@/services/productService";
import Fallback from "@/ui/Fallback";
import Loading from "@/ui/Loading";
import ProductDetails from "./_components/ProductDetails";

// export const dynamic = "force-static"; //owing to use axios, it is used to make SSG.
// export const dynamicParams = false;

// await new Promise((resolve) => setTimeout(resolve, 2000));

// export async function generateStaticParams() {
//   const { products, isLoading } = await getAllProducts();

//   const slugs = products.map((product) => ({ slug: product.slug }));
//   return slugs;
// }

// // dynamic metadata
// export async function generateMetadata({ params }) {
//   const { slug } = await params;
//   const { product } = await getOneProductBySlug(slug);

//   return {
//     title: product.title,
//   };
// }

async function page({ params }) {
  const { slug } = await params;
  const { product, isLoading, error } = await getOneProductBySlug(slug);

  if (isLoading) return <Loader message="در حال بارگزاری محصول ..." />;
  if (error || !product)
    return (
      <Fallback message="محصول یافت نشد" subMessage="لطفاً دوباره تلاش کنید" />
    );

  return <ProductDetails product={product} />;
}

export default page;
