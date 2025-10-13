import { useState } from "react";

interface ConfirmResponse {
  jwt: string;
  user: {
    id: number;
    email: string;
    username: string;
    displayName: string;
    confirmed: boolean;
    role: {
      id: number;
      name: string;
      type: string;
    };
  };
  message: string;
}

export const useEmailConfirmation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmEmail = async (
    confirmationToken: string
  ): Promise<ConfirmResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
        }/api/auth/email-confirmation?confirmation=${confirmationToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Сохраняем JWT токен и пользователя в localStorage
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt);
        }

        return data;
      } else {
        const errorMessage =
          data.error || data.message || "Помилка підтвердження акаунту";
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = "Помилка підключення до сервера";
      setError(errorMessage);
      console.error("Error confirming email:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    confirmEmail,
    isLoading,
    error,
  };
};
