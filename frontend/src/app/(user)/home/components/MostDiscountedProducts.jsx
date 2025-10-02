import MostDiscountedSlider from "./MostDiscountedSlider";

function MostDiscountedProducts({ products }) {
  return (
    <div className="max-w-screen-xl mx-auto my-8 md:px-4">
      {/* Slider */}
      <MostDiscountedSlider products={products} />
    </div>
  );
}

export default MostDiscountedProducts;
