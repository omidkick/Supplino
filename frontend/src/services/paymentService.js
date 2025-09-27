import http from "./httpService";

export async function createPayment() {
  return http.post("/payment/create").then(({ data }) => data.data);
}

export async function getAllPayments(qs = "") {
  return http.get(`/admin/payment/list?${qs}`).then(({ data }) => data.data);
}

export async function getOnePayment(id) {
  return http.get(`/admin/payment/${id}`).then(({ data }) => data.data);
}

export async function updateOrderStatus({ id, data }) {
  return http
    .patch(`/admin/payment/${id}/order-status`, data)
    .then(({ data }) => data.data);
}

export async function getUserPaymentDetail(id) {
  return http.get(`/payment/user/${id}`).then(({ data }) => data.data);
}
