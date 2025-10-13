"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

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

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleEmailConfirmation } = useAuthContext();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<ConfirmResponse["user"] | null>(null);

  useEffect(() => {
    const confirmEmail = async () => {
      const confirmation = searchParams.get("confirmation");

      if (!confirmation) {
        setStatus("error");
        setMessage("Токен підтвердження відсутній");
        return;
      }

      try {
        const success = await handleEmailConfirmation(confirmation);

        if (success) {
          setStatus("success");
          setMessage("Акаунт успішно підтверджено!");

          // Получаем пользователя из localStorage
          const userData = localStorage.getItem("user");
          if (userData) {
            setUser(JSON.parse(userData));
          }

          // Редирект на главную через 3 секунды
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setStatus("error");
          setMessage("Помилка підтвердження акаунту");

          // Редирект на авторизацию через 5 секунд
          setTimeout(() => {
            router.push("/auth");
          }, 5000);
        }
      } catch (error) {
        console.error("Error confirming email:", error);
        setStatus("error");
        setMessage("Помилка підключення до сервера");

        // Редирект на авторизацию через 5 секунд
        setTimeout(() => {
          router.push("/auth");
        }, 5000);
      }
    };

    confirmEmail();
  }, [searchParams, router, handleEmailConfirmation]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoToAuth = () => {
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            {status === "loading" && (
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            )}
            {status === "success" && (
              <CheckCircle className="h-6 w-6 text-green-600" />
            )}
            {status === "error" && <XCircle className="h-6 w-6 text-red-600" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === "loading" && "Підтвердження email..."}
            {status === "success" && "Акаунт підтверджено!"}
            {status === "error" && "Помилка підтвердження"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Будь ласка, зачекайте..."}
            {status === "success" && "Ваш акаунт успішно активовано"}
            {status === "error" && "Не вдалося підтвердити акаунт"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="text-center">
              <p className="text-gray-600">
                Перевіряємо токен підтвердження...
              </p>
            </div>
          )}

          {status === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {user && status === "success" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Інформація про акаунт:
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Ім&apos;я:</strong> {user.displayName}
                </p>
                <p>
                  <strong>Роль:</strong>{" "}
                  {user.role.type === "buyer" ? "Покупець" : "Продавець"}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            {status === "success" && (
              <>
                <Button onClick={handleGoHome} className="w-full">
                  Перейти на головну
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Автоматичний перехід через 3 секунди...
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <Button
                  onClick={handleGoToAuth}
                  variant="outline"
                  className="w-full"
                >
                  Перейти до авторизації
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Автоматичний перехід через 5 секунд...
                </p>
              </>
            )}
          </div>

          <div className="text-center text-xs text-gray-500">
            <Mail className="h-4 w-4 inline mr-1" />
            esviem-defence
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
