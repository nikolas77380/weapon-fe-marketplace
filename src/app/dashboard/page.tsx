import { requireAuth } from "@/lib/server-auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import React from "react";
import { redirect } from "next/navigation";
import { isSeller } from "@/lib/utils";

const DashboardPage = async () => {
  const currentUser = await requireAuth();
  if (isSeller(currentUser) && currentUser.metadata === null) {
    redirect("/account");
  }
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
              <LogoutButton />
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
                Welcome, {currentUser.displayName || currentUser.username}!
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
