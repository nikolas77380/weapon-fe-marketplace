"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";

export const LogoutButton = () => {
  const { handleLogout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await handleLogout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant="outline"
      className="text-red-600 border-red-600 hover:bg-red-50"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
};
