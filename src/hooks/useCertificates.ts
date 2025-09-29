import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCertificates,
  getCertificatesPublic,
  getCertificatesByUser,
  getCertificatesByProduct,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "@/lib/strapi";
import { queryKeys } from "@/lib/query-keys";

export interface Certificate {
  id: number;
  title: string;
  description?: string;
  certificateType: "product" | "seller";
  issuedBy: string;
  issuedDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  status: "active" | "expired" | "revoked";
  product?: {
    id: number;
    title: string;
  };
  seller?: {
    id: number;
    username: string;
    displayName: string;
  };
  certificateFile?: {
    id: number;
    url: string;
    name: string;
    mime: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificateData {
  title: string;
  description?: string;
  certificateType: "product" | "seller";
  issuedBy: string;
  issuedDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  status?: "active" | "expired" | "revoked";
  product?: number;
  seller?: number;
}

export const useCertificates = (params?: {
  certificateType?: "product" | "seller";
  product?: number;
  seller?: number;
  status?: "active" | "expired" | "revoked";
  scope?: "public" | "auth";
}) => {
  const isPublic = params?.scope === "public";
  const hasUser = !!params?.seller;
  const hasProduct = !!params?.product;

  return useQuery({
    queryKey: queryKeys.certificates.list(params),
    queryFn: () => {
      if (hasUser) return getCertificatesByUser(params!.seller!, params);
      if (hasProduct) return getCertificatesByProduct(params!.product!, params);
      if (isPublic) return getCertificatesPublic(params);
      return getCertificates(params);
    },
  });
};

export const useCreateCertificateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
      files,
    }: {
      data: CreateCertificateData;
      files?: File[];
    }) => createCertificate({ data, files }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.certificates.lists(),
      });
    },
  });
};

export const useUpdateCertificateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateCertificateData>;
    }) => updateCertificate({ id, data }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.certificates.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.certificates.detail(variables.id),
      });
    },
  });
};

export const useDeleteCertificateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteCertificate({ id }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.certificates.lists(),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.certificates.detail(variables.id),
      });
    },
  });
};

// Backward compatibility wrapper
export const useCertificateActions = () => {
  const createMutation = useCreateCertificateMutation();
  const updateMutation = useUpdateCertificateMutation();
  const deleteMutation = useDeleteCertificateMutation();

  return {
    createCertificate: createMutation.mutateAsync,
    updateCertificate: updateMutation.mutateAsync,
    deleteCertificate: (id: number) => deleteMutation.mutateAsync({ id }),
    loading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
};
