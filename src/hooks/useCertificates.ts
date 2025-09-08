import { useState, useEffect } from "react";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "@/lib/strapi";
import { getSessionTokenFromCookie } from "@/lib/auth";

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
}) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCertificates(params);

      if (response?.data) {
        setCertificates(response.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch certificates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [
    params?.certificateType,
    params?.product,
    params?.seller,
    params?.status,
    fetchCertificates,
  ]);

  return {
    certificates,
    loading,
    error,
    refetch: fetchCertificates,
  };
};

export const useCertificateActions = () => {
  const token = getSessionTokenFromCookie();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCertificateAction = async (
    data: CreateCertificateData,
    files?: File[]
  ) => {
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      setLoading(true);
      setError(null);

      const response = await createCertificate({ data, files });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create certificate";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCertificateAction = async (
    id: number,
    data: Partial<CreateCertificateData>
  ) => {
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      setLoading(true);
      setError(null);

      const response = await updateCertificate({ id, data });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update certificate";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificateAction = async (id: number) => {
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      setLoading(true);
      setError(null);

      await deleteCertificate({ id });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete certificate";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCertificate: createCertificateAction,
    updateCertificate: updateCertificateAction,
    deleteCertificate: deleteCertificateAction,
    loading,
    error,
  };
};
