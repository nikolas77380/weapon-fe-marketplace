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

interface MetadataRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MetadataRequiredDialog = ({
  open,
  onOpenChange,
}: MetadataRequiredDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Company Details Required</DialogTitle>
          <DialogDescription>
            You cannot add a product until you complete your company
            information. Please fill out your company details first.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="py-2.5 px-6">
            Cancel
          </Button>
          <Link href="/account/settings">
            <Button className="py-2.5 px-6">Complete Company Details</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetadataRequiredDialog;
