import http from "./httpService";

export async function getAllProducts(qs, cookies) {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return http
    .get(`/product/list?${qs}`, {
      headers: {
        Cookie: cookies,
      },
    })
    .then(({ data }) => data.data);

  // return fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/list?${qs}`, {
  //   cache: "no-store",
  // })
  //   .then((res) => res.json())
  //   .then(({ data }) => data);
}

export async function getOneProductBySlug(slug) {
  return http.get(`/product/slug/${slug}`).then(({ data }) => data.data);
}

export async function getOneProductById(id) {
  return http.get(`/product/${id}`).then(({ data }) => data.data);
}

export async function likeProduct(id) {
  return http.post(`/product/like/${id}`).then(({ data }) => data.data);
}
export async function toggleBookmark(id) {
  return http.post(`/product/bookmark/${id}`).then(({ data }) => data.data);
}

// admin relate function
export async function addProduct(data) {
  return http.post(`/admin/product/add`, data).then(({ data }) => data.data);
}

export async function removeProduct(id) {
  return http
    .delete(`/admin/product/remove/${id}`)
    .then(({ data }) => data.data);
}

// export async function updateProduct({ productId, data }) {
//   console.log({ data });
//   return http
//     .patch(`/admin/product/update/${productId}`, data)
//     .then(({ data }) => data.data);
// }

export async function updateProduct({ id, data }) {
  return http
    .patch(`/admin/product/update/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => data.data);
}
