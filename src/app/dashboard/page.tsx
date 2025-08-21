"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout, getSessionTokenFromCookie } from "@/lib/auth";

const DashboardPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем аутентификацию при загрузке страницы
  useEffect(() => {
    const sessionToken = getSessionTokenFromCookie();
    if (!sessionToken) {
      console.log("No session token found, redirecting to auth");
      router.push("/auth?mode=login");
    }
  }, [router]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      console.log("Logout successful");
      router.push("/auth?mode=login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleLogout}
                disabled={isLoading}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                {isLoading ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">
                Welcome to your Dashboard
              </h2>
              <p className="text-gray-500">
                This is your personal dashboard. Content will be added here
                soon.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
