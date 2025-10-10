import { useMutation } from "@tanstack/react-query";
import { uploadSellerAvatar } from "@/lib/strapi";
import { getSessionTokenFromCookie } from "@/lib/auth";

interface UploadAvatarParams {
  id: number;
  avatar: File;
}

export const useUploadSellerAvatar = () => {
  return useMutation({
    mutationFn: async ({ id, avatar }: UploadAvatarParams) => {
      const token = getSessionTokenFromCookie();
      if (!token) {
        throw new Error("Authentication required");
      }

      return uploadSellerAvatar({ id, avatar, token });
    },
  });
};
