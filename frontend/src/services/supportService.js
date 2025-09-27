import http from "./httpService";

// User endpoints
export async function createTicket(data) {
  return http.post(`/support/tickets`, data).then(({ data }) => data.data);
}

export async function getUserTickets(qs = "") {
  return http.get(`/support/tickets?${qs}`).then(({ data }) => data.data);
}

export async function getTicket(id) {
  return http.get(`/support/tickets/${id}`).then(({ data }) => data.data);
}

export async function addReply(id, message) {
  return http
    .post(`/support/tickets/${id}/reply`, { message })
    .then(({ data }) => data.data);
}

//! Admin endpoints

// export async function getAllTickets(qs = "") {
//   return http.get(`/admin/support/tickets?${qs}`).then(({ data }) => data.data);
// }

// supportService.js
export async function getAllTickets(qs = "", cookieHeader = "") {
  const config = cookieHeader ? {
    headers: {
      Cookie: cookieHeader
    }
  } : {};
  
  return http.get(`/admin/support/tickets?${qs}`, config).then(({ data }) => data.data);
}


export async function getAdminTicket(id) {
  return http.get(`/admin/support/tickets/${id}`).then(({ data }) => data.data);
}

export async function addAdminReply(id, message) {
  return http
    .post(`/admin/support/tickets/${id}/reply`, { message })
    .then(({ data }) => data.data);
}

export async function updateTicketStatus(id, status) {
  return http
    .patch(`/admin/support/tickets/${id}/status`, { status })
    .then(({ data }) => data.data);
}

export async function getTicketStats() {
  return http.get(`/admin/support/tickets-stats`).then(({ data }) => data.data);
}


// Delete ticket (user)
export async function deleteTicket(id) {
  return http.delete(`/support/tickets/${id}`).then(({ data }) => data.data);
}

// Mark ticket as read (USER)
export async function markTicketAsRead(id) {
  return http
    .patch(`/support/tickets/${id}/mark-read`)
    .then(({ data }) => data.data);
}

// Mark ticket as read (ADMIN)
export async function markTicketAsReadAdmin(id) {
  return http
    .patch(`/admin/support/tickets/${id}/mark-read`)
    .then(({ data }) => data.data);
}