import http from "./httpService";

export async function getOtp(data) {
  return http.post("/user/get-otp", data).then(({ data }) => data.data);
}

export async function checkOtp(data) {
  return http.post("/user/check-otp", data).then(({ data }) => data.data);
}

export async function completeProfileApi(data) {
  return http
    .post("/user/complete-profile", data)
    .then(({ data }) => data.data);
}

export async function getUserProfile() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return http.get("/user/profile").then(({ data }) => data.data);
}

export async function updateProfile(data) {
  return http.patch("/user/update", data).then(({ data }) => data.data);
}

export async function uploadAvatarApi(file) {
  const formData = new FormData();
  formData.append("avatar", file);

  return http.post(`/user/upload-avatar`, formData);
}

export async function logout() {
  return http.post("/user/logout");
}

// admin related fetches :

export async function getAllUsers(qs, cookies) {
  // Testy Latency
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return http
    .get(`/admin/user/list?${qs}`, {
      headers: {
        Cookie: cookies,
      },
    })
    .then(({ data }) => data.data);
}

export async function getUserProfileByAdmin(userId) {
  return http
    .get(`/admin/user/profile/${userId}`)
    .then(({ data }) => data.data);
}
