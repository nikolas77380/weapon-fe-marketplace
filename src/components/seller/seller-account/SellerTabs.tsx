import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shopCategories } from "@/mockup/shop";
import SellerListenedCard from "./SellerListenedCard";

const SellerAccountTabs = () => {
  return (
    <div className="mt-9">
      <Tabs defaultValue="myInquiries">
        <TabsList className="bg-gray-primary gap-5">
          <TabsTrigger value="myInquiries">My listings</TabsTrigger>
          <TabsTrigger value="savedItems">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="myInquiries">
          <div className="mt-15">
            <h1 className="text-xl font-roboto">My Inquiries</h1>
            <p className="text-sm font-medium text-[#C4C2C2] mt-2">
              Manage your product listings and inventory
            </p>
            <div className="mt-3.5 flex flex-col gap-4 items-center w-full">
              {shopCategories.map((category, index) => (
                <SellerListenedCard key={index} category={category} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerAccountTabs;
