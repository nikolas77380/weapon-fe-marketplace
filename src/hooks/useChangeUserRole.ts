import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserRole } from "@/lib/strapi";
import { getSessionTokenFromCookie } from "@/lib/auth";
import { ChangeUserRoleParams, ChangeUserRoleResponse } from "@/lib/types";

interface ChangeUserRoleMutationParams {
  userId: number;
  role: "buyer" | "seller";
}

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ChangeUserRoleResponse,
    Error,
    ChangeUserRoleMutationParams
  >({
    mutationFn: async ({ userId, role }: ChangeUserRoleMutationParams) => {
      const token = getSessionTokenFromCookie();
      if (!token) {
        throw new Error("Authentication required");
      }

      return changeUserRole({ userId, role, token });
    },
    onSuccess: (data, variables) => {
      // Invalidate user-related queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      // Invalidate specific user query if it exists
      queryClient.invalidateQueries({
        queryKey: ["user", variables.userId],
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

      // Show success message (you can customize this based on your notification system)
      console.log(
        `User role successfully changed from ${data.previousRole} to ${data.newRole}`
      );
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
