import { CheckCircle, Clock4, XCircle } from "lucide-react";
import { VerificationStatus } from "@/types/seller-status";

export const getStatusConfig = (status: VerificationStatus) => {
  switch (status) {
    case "Verified":
      return {
        icon: <CheckCircle size={16} className="text-green-600" />,
        text: "Verified",
        textColor: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-400",
        hoverColor: "hover:bg-green-100",
      };
    case "Not Verified":
      return {
        icon: <XCircle size={16} className="text-red-500" />,
        text: "Not Verified",
        textColor: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-400",
        hoverColor: "hover:bg-red-100",
      };
    default:
      return {
        icon: <Clock4 size={16} className="text-orange-500" />,
        text: "Verification Pending",
        textColor: "text-orange-500",
        bgColor: "bg-[#FCF8D1]",
        borderColor: "border-yellow-400",
        hoverColor: "hover:bg-yellow-200",
      };
  }
};
