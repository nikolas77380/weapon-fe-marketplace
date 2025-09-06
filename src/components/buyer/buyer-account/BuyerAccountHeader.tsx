import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/types";
import React from "react";
import BuyerActionCard from "./BuyerActionCard";
import { FavouriteProduct } from "@/lib/favourites";
import Link from "next/link";
import { FileText, HandHelping, Heart } from "lucide-react";

interface BuyerAccountHeaderProps {
  currentUser: UserProfile;
  favourites: FavouriteProduct[];
}

const BuyerAccountHeader = ({
  currentUser,
  favourites,
}: BuyerAccountHeaderProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-l-2 border-gold-main">
        <p className="text-2xl font-medium ml-5">Buyer Details</p>
        <div>
          <Link
            href={"/marketplace"}
            className="p-2.5 px-5 text-xl font-medium rounded-none bg-gold-main text-white hover:bg-gold-main/90
            duration-300 transition-all"
          >
            Browse marketplace
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col bg-primary-foreground p-5">
          <div className="flex items-center gap-5">
            <Avatar className="size-25 border border-gray-300 cursor-pointer">
              <AvatarFallback className="bg-black text-white text-6xl uppercase">
                {currentUser?.displayName?.charAt(0) ||
                  currentUser?.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-2xl font-medium">
                {currentUser?.displayName || currentUser?.username}
              </p>
              <div className="flex items-center gap-10">
                <div className="flex flex-col mt-3.5">
                  <p className="text-muted-foreground">Email</p>
                  <p>{currentUser?.email}</p>
                </div>
                {currentUser?.metadata?.phoneNumbers && (
                  <div className="flex flex-col mt-3.5">
                    <p className="text-muted-foreground">Phone</p>
                    <p>{currentUser?.metadata?.phoneNumbers}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7.5 mt-7.5">
            <BuyerActionCard
              title="Active Inquiries"
              count={2}
              icons={<FileText className="size-10" strokeWidth={0.5} />}
            />
            <BuyerActionCard
              title="Saved Items"
              count={favourites.length || 0}
              icons={<Heart className="size-10" strokeWidth={0.5} />}
            />
            <BuyerActionCard
              title="Completed deals"
              count={5}
              icons={<HandHelping className="size-10" strokeWidth={0.5} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerAccountHeader;
