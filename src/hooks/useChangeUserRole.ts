import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserRole } from "@/lib/strapi";
import { ChangeUserRoleResponse } from "@/lib/types";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ChangeUserRoleMutationParams {
  userId: number;
  role: "buyer" | "seller";
}

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  const { fetchUser } = useAuthContext();
  const router = useRouter();

  return useMutation<
    ChangeUserRoleResponse,
    Error,
    ChangeUserRoleMutationParams
  >({
    mutationFn: async ({ userId, role }: ChangeUserRoleMutationParams) => {
      return changeUserRole({ userId, role });
    },
    onSuccess: async (data, variables) => {
      // Invalidate user-related queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      // Invalidate specific user query if it exists
      queryClient.invalidateQueries({
        queryKey: ["user", variables.userId],
      });

      // Invalidate /me endpoint queries
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      // Invalidate any user profile queries
      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
      });

      // Invalidate seller-related queries if role changed to/from seller
      if (variables.role === "seller" || data.previousRole === "seller") {
        queryClient.invalidateQueries({
          queryKey: ["sellers"],
        });
        queryClient.invalidateQueries({
          queryKey: ["seller-meta"],
        });
      }

      // Force refresh current user data to get updated role
      await fetchUser();

      // Redirect to refresh the page and show updated UI
      router.refresh();
    },
    onError: (error) => {
      console.error("Failed to change user role:", error);
    },
  });
};

// Hook for changing user role with additional utilities
export const useUserRoleManagement = () => {
  const changeRoleMutation = useChangeUserRole();

  const changeUserRole = async (userId: number, role: "buyer" | "seller") => {
    return changeRoleMutation.mutateAsync({ userId, role });
  };

  return {
    changeUserRole,
    isLoading: changeRoleMutation.isPending,
    error: changeRoleMutation.error,
    isSuccess: changeRoleMutation.isSuccess,
    isError: changeRoleMutation.isError,
    data: changeRoleMutation.data,
    reset: changeRoleMutation.reset,
  };
};
