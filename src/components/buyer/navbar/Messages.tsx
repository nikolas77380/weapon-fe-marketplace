"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUnreadMessagesCount } from "@/hooks/useUnreadMessagesCount";

const Messages = () => {
  const t = useTranslations("Navbar");
  const unreadCount = useUnreadMessagesCount();
  return (
    <NavigationMenuLink asChild className="p-3">
      <Link href="/messages" className="relative inline-block">
        <Tooltip>
          <TooltipTrigger asChild>
            <MessageCircle
              size={20}
              className="text-gold-main cursor-pointer relative"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("messagesToogle")}</p>
          </TooltipContent>
        </Tooltip>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold leading-none text-white shadow-lg transform translate-x-1/2 -translate-y-1/2">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Link>
    </NavigationMenuLink>
  );
};

export default Messages;
