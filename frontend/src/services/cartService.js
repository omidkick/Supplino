import http from "./httpService";

export function addToCart(productId) {
  return http.post("/cart/add", { productId }).then(({ data }) => data.data);
}

export function decrementFromCart(productId) {
  return http.post("/cart/remove", { productId }).then(({ data }) => data.data);
}

export function addCouponToCart(couponCode) {
  return http
    .post("/cart/coupon", { couponCode })
    .then(({ data }) => data.data);
}
