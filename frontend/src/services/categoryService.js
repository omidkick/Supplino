import http from "./httpService";

export async function getAllCategories(qs, cookies) {
  return http
    .get(`/category/list?${qs}`, {
      headers: {
        Cookie: cookies,
      },
    })
    .then(({ data }) => data.data);
}

export async function getCategoryById(id) {
  return http.get(`/category/${id}`).then(({ data }) => data.data);
}

export async function addNewCategory(data) {
  return http.post("/admin/category/add", data).then(({ data }) => data.data);
}

export async function updateCategory({ id, data }) {
  return http
    .patch(`/admin/category/update/${id}`, data)
    .then(({ data }) => data.data);
}

export async function removeCategory(id) {
  return http
    .delete(`/admin/category/remove/${id}`)
    .then(({ data }) => data.data);
}
