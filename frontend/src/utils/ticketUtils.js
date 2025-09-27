export function calculateAdminUnreadCount(tickets) {
  if (!tickets || !Array.isArray(tickets)) return 0;

  return tickets.reduce((count, ticket) => {
    const unreadUsersMessages = ticket.messages.filter(
      (msg) => !msg.isAdmin && !msg.isReadByAdmin
    ).length;
    return count + unreadUsersMessages;
  }, 0);
}

export function calculateUserUnreadCount(tickets) {
  if (!tickets || !Array.isArray(tickets)) return 0;

  // Filter tickets that have at least one admin message
  const receivedTickets =
    tickets.filter((ticket) => ticket.messages.some((msg) => msg.isAdmin)) ||
    [];

  // Count unread admin messages for user
  return receivedTickets.reduce((count, ticket) => {
    const unreadAdminMessages = ticket.messages.filter(
      (msg) => msg.isAdmin && !msg.isReadByUser
    ).length;
    return count + unreadAdminMessages;
  }, 0);
}

export function getTicketsWithAdminMessages(tickets) {
  if (!tickets || !Array.isArray(tickets)) return [];

  return (
    tickets.filter((ticket) => ticket.messages.some((msg) => msg.isAdmin)) || []
  );
}

export function getTicketsWithUserMessages(tickets) {
  if (!tickets || !Array.isArray(tickets)) return [];

  return (
    tickets.filter((ticket) => ticket.messages.some((msg) => !msg.isAdmin)) ||
    []
  );
}

export function hasUnreadMessagesForUser(ticket) {
  if (!ticket || !ticket.messages) return false;

  return ticket.messages.some((msg) => msg.isAdmin && !msg.isReadByUser);
}

export function hasUnreadMessagesForAdmin(ticket) {
  if (!ticket || !ticket.messages) return false;

  return ticket.messages.some((msg) => !msg.isAdmin && !msg.isReadByAdmin);
}
