"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle } from "lucide-react";

interface EmailConfirmationNoticeProps {
  email: string;
  showSuccess?: boolean;
}

export default function EmailConfirmationNotice({
  email,
  showSuccess = false,
}: EmailConfirmationNoticeProps) {
  if (showSuccess) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Реєстрація успішна!</strong> Перевірте вашу email та
          підтвердіть акаунт.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-blue-200 bg-blue-50">
      <Mail className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Підтвердження email</strong>
        <br />
        Ми відправили лист підтвердження на <strong>{email}</strong>.<br />
        Будь ласка, перевірте вашу пошту та натисніть на посилання для активації
        акаунту.
      </AlertDescription>
    </Alert>
  );
}
