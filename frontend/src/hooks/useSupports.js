import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTicket,
  getUserTickets,
  getTicket,
  addReply,
  getAllTickets,
  getAdminTicket,
  addAdminReply,
  updateTicketStatus,
  getTicketStats,
  deleteTicket,
  markTicketAsRead,
  markTicketAsReadAdmin,
} from "@/services/supportService";
import toast from "react-hot-toast";

export const useSupportActions = (ticketId = null, isAdmin = false , queries = "") => {
  const queryClient = useQueryClient();

  // 🔁 Get user tickets
  const {
    data: userTicketsData,
    isLoading: isLoadingUserTickets,
    refetch: refetchUserTickets,
  } = useQuery({
    queryKey: ["get-user-tickets"],
    queryFn: () => getUserTickets(),
    enabled: !isAdmin,
  });

  const { tickets: userTickets, total: userTicketsTotal } =
    userTicketsData || {};

  // 🔁 Get all tickets (admin only)
  const {
    data: allTicketsData,
    isLoading: isLoadingAllTickets,
    refetch: refetchAllTickets,
  } = useQuery({
    queryKey: ["get-all-tickets", queries],
    queryFn: () => getAllTickets(queries),
    enabled: isAdmin,
  });

  const { tickets: allTickets, total: allTicketsTotal } = allTicketsData || {};

  // 🔍 Get single ticket
  const {
    data: singleTicketData,
    isLoading: isLoadingSingleTicket,
    error: singleTicketError,
    refetch: refetchSingleTicket,
  } = useQuery({
    queryKey: ["get-single-ticket", ticketId],
    queryFn: () => (isAdmin ? getAdminTicket(ticketId) : getTicket(ticketId)),
    enabled: !!ticketId,
  });

  const { ticket } = singleTicketData || {};

  // 📊 Get ticket statistics (admin only)
  const {
    data: ticketStats,
    isLoading: isLoadingTicketStats,
    refetch: refetchTicketStats,
  } = useQuery({
    queryKey: ["get-ticket-stats"],
    queryFn: getTicketStats,
    enabled: isAdmin,
  });

  // ➕ Create ticket
  const {
    mutate: mutateCreateTicket,
    isPending: isCreatingTicket,
    error: createTicketError,
  } = useMutation({
    mutationFn: createTicket,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["get-user-tickets"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در ایجاد تیکت");
    },
  });

  // 💬 Add reply (user)
  const {
    mutate: mutateAddReply,
    isPending: isAddingReply,
    error: addReplyError,
  } = useMutation({
    mutationFn: ({ id, message }) => addReply(id, message),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["get-single-ticket", ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-all-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["get-user-tickets"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در ارسال پاسخ");
    },
  });

  // 💬 Add admin reply
  const {
    mutate: mutateAddAdminReply,
    isPending: isAddingAdminReply,
    error: addAdminReplyError,
  } = useMutation({
    mutationFn: ({ id, message }) => addAdminReply(id, message),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["get-single-ticket", ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-all-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["get-ticket-stats"] });
      
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در ارسال پاسخ ادمین");
    },
  });

  // 🔄 Update ticket status (admin)
  const {
    mutate: mutateUpdateTicketStatus,
    isPending: isUpdatingTicketStatus,
    error: updateTicketStatusError,
  } = useMutation({
    mutationFn: ({ id, status }) => updateTicketStatus(id, status),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["get-single-ticket", ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-all-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["get-ticket-stats"] });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "خطا در بروزرسانی وضعیت تیکت"
      );
    },
  });

  // Delete ticket mutation
  const {
    mutate: mutateDeleteTicket,
    isPending: isDeletingTicket,
    error: deleteTicketError,
  } = useMutation({
    mutationFn: deleteTicket,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["get-user-tickets"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در حذف تیکت");
    },
  });

  // Mark as read mutation
const {
  mutate: mutateMarkAsRead,
  isPending: isMarkingAsRead,
  error: markAsReadError,
} = useMutation({
  mutationFn: markTicketAsRead, // Use the user endpoint
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["get-user-tickets"] });
    queryClient.invalidateQueries({
      queryKey: ["get-single-ticket", ticketId],
    });
  },
  onError: (err) => {
    toast.error(err?.response?.data?.message || "خطا در علامت گذاری تیکت");
  },
});
  return {
    // User tickets
    userTickets,
    userTicketsTotal,
    isLoadingUserTickets,
    refetchUserTickets,

    // All tickets (admin)
    allTickets,
    allTicketsTotal,
    isLoadingAllTickets,
    refetchAllTickets,

    // Single ticket
    ticket,
    isLoadingSingleTicket,
    singleTicketError,
    refetchSingleTicket,

    // Ticket stats (admin)
    ticketStats,
    isLoadingTicketStats,
    refetchTicketStats,

    // Mutations
    mutateCreateTicket,
    isCreatingTicket,
    createTicketError,

    mutateAddReply,
    isAddingReply,
    addReplyError,

    mutateAddAdminReply,
    isAddingAdminReply,
    addAdminReplyError,

    mutateUpdateTicketStatus,
    isUpdatingTicketStatus,
    updateTicketStatusError,

    mutateDeleteTicket,
    isDeletingTicket,
    deleteTicketError,

    mutateMarkAsRead,
    isMarkingAsRead,
    markAsReadError,
  };
};

// Custom hook for admin support actions
export const useAdminSupportActions = (ticketId = null) => {
  return useSupportActions(ticketId, true);
};


// Custom hook for latest tickets
export const useLatestTickets = () => {
  return useQuery({
    queryKey: ["latest-tickets"],
    queryFn: () => getAllTickets("sort=latest&limit=5"),
  });
};