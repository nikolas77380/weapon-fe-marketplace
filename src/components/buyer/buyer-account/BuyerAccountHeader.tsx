import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/types";
import React from "react";
import BuyerActionCard from "./BuyerActionCard";
import BreadcrumbComponent from "@/components/ui/BreadcrumbComponent";

interface BuyerAccountHeaderProps {
  currentUser: UserProfile;
}

const BuyerAccountHeader = ({ currentUser }: BuyerAccountHeaderProps) => {
  return (
    <div className="flex flex-col">
      <BreadcrumbComponent currentUser={currentUser} className="mt-4 mb-10" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12 border border-gray-300 cursor-pointer">
            <AvatarFallback className="bg-black text-white text-xl">
              {currentUser?.displayName?.charAt(0) ||
                currentUser?.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p className="text-xl font-medium">
            {currentUser?.displayName || currentUser?.username}
          </p>
        </div>
        <div>
          <Button
            variant={"outline"}
            className="p-2.5 text-xl font-medium border-black"
          >
            Browse marketplace
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <BuyerActionCard
          title="Active Inquiries"
          count={2}
          subTitle="Pending responses"
        />
        <BuyerActionCard
          title="Saved Items"
          count={12}
          subTitle="In watchlist"
        />
        <BuyerActionCard
          title="Completed deals"
          count={5}
          subTitle="This year"
        />
      </div>
    </div>
  );
};

export default BuyerAccountHeader;
