// app/admin/coupon/[id]/edit/page.jsx
import EditCouponClient from "./EditCouponClient";

async function EditCouponPage({ params }) {
  const { id } = await params;
  
  return <EditCouponClient id={id} />;
}

export default EditCouponPage;