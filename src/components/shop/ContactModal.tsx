"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SellerMeta } from "@/lib/types";

interface MetadataRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellerData: SellerMeta;
}

const ContactModal = ({
  open,
  onOpenChange,
  sellerData,
}: MetadataRequiredDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Information</DialogTitle>
          <DialogDescription className="flex flex-col gap-2 mt-2">
            <p>
              <b>Company Name: </b> {sellerData?.companyName}
            </p>
            <p>
              <b>Phone Numbers: </b> {sellerData?.phoneNumbers}
            </p>
            <p>
              <b>Web Site: </b> {sellerData?.webSite}
            </p>
            <p>
              <b>Country: </b> {sellerData?.country}
            </p>
            <p>
              <b>Address: </b> {sellerData?.address}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="py-2.5 px-6"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
