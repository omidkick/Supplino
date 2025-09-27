import http from "./httpService";

export async function addCommentApi(data, options) {
  return http.post("/comment/add", data, options).then(({ data }) => data.data);
}

// ADMIN ONLY - requires admin token
export async function getAllCommentApi(options = {}) {
  return http.get("/admin/comment/list", options).then(({ data }) => data.data);
}

export async function getAllProductCommentsApi(productId) {
  return http
    .get(`/comment/product/${productId}`)
    .then(({ data }) => data.data.comments);
}
export async function deleteCommentApi(id, options = {}) {
  return http
    .delete(`/comment/remove/${id}`, options)
    .then(({ data }) => data.data);
}

export async function likeCommentApi({ id, parentId, parentAnswerId }) {
  return http
    .post(`/comment/like/${id}`, { parentId, parentAnswerId })
    .then(({ data }) => data.data);
}

export async function updateCommentStatusApi({ id, status }, options = {}) {
  return http
    .patch(`/admin/comment/update/${id}`, { status }, options)
    .then(({ data }) => data.data);
}

export async function editCommentTextApi({
  id,
  text,
  parentId,
  parentAnswerId,
}) {
  return http
    .patch(`/comment/edit-text/${id}`, { text, parentId, parentAnswerId })
    .then(({ data }) => data.data);
}

export async function getOneCommentApi(id) {
  return http.get(`/admin/comment/${id}`).then(({ data }) => data.data);
}
