"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Download, Eye } from "lucide-react";
import {
  useCertificates,
  useCertificateActions,
} from "@/hooks/useCertificates";
import { UserProfile } from "@/lib/types";
import { toast } from "sonner";

interface CertificatesListProps {
  currentUser: UserProfile;
  onRefresh?: () => void;
}

const CertificatesList = ({
  currentUser,
  onRefresh,
}: CertificatesListProps) => {
  const { certificates, loading, error, refetch } = useCertificates({
    certificateType: "seller",
    seller: currentUser.id,
  });
  const { deleteCertificate } = useCertificateActions();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certificate?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteCertificate(id);
      toast.success("Certificate deleted successfully!");
      refetch();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: unknown) {
      console.error("Error deleting certificate:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete certificate: ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "revoked":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading certificates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">Error loading certificates: {error}</div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No certificates uploaded yet.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Your Certificates ({certificates.length})
      </h3>
      <div className="grid gap-4">
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{certificate.title}</CardTitle>
                <Badge className={getStatusColor(certificate.status)}>
                  {certificate.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {certificate.description && (
                <p className="text-gray-600 text-sm">
                  {certificate.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Issued by:</span>
                  <p className="text-gray-600">{certificate.issuedBy}</p>
                </div>
                <div>
                  <span className="font-medium">Issued date:</span>
                  <p className="text-gray-600">
                    {formatDate(certificate.issuedDate)}
                  </p>
                </div>
                {certificate.expiryDate && (
                  <div>
                    <span className="font-medium">Expiry date:</span>
                    <p className="text-gray-600">
                      {formatDate(certificate.expiryDate)}
                    </p>
                  </div>
                )}
                {certificate.certificateNumber && (
                  <div>
                    <span className="font-medium">Certificate #:</span>
                    <p className="text-gray-600">
                      {certificate.certificateNumber}
                    </p>
                  </div>
                )}
              </div>

              {certificate.certificateFile && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(certificate.certificateFile?.url, "_blank")
                    }
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = certificate.certificateFile?.url || "";
                      link.download =
                        certificate.certificateFile?.name || "certificate";
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(certificate.id)}
                    disabled={deletingId === certificate.id}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deletingId === certificate.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CertificatesList;
