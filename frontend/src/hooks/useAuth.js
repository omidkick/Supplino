import {
  getAllUsers,
  getUserProfile,
  getUserProfileByAdmin,
} from "@/services/authServices";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = () =>
  useQuery({
    queryKey: ["get-user"],
    queryFn: getUserProfile,
    retry: false,
    refetchOnWindowFocus: true,
  });

export const useGetUsers = () =>
  useQuery({
    queryKey: ["get-users"],
    queryFn: getAllUsers,
    retry: false,
    refetchOnWindowFocus: true,
  });

// ✔️ Single user profile by admin
export const useUserProfileByAdmin = (userId) =>
  useQuery({
    queryKey: ["user-profile-admin", userId],
    queryFn: () => getUserProfileByAdmin(userId),
    enabled: !!userId,
    retry: false,
    refetchOnWindowFocus: false,
  });
