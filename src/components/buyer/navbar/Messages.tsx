import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Badge, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const Messages = () => {
  const t = useTranslations("Navbar");

  const [unreadMessagesCount, _setUnreadMessagesCount] = useState(0);
  return (
    <NavigationMenuLink asChild className="p-3">
      <Link href="/messages" className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <MessageCircle
              size={20}
              className="text-gold-main cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("messagesToogle")}</p>
          </TooltipContent>
        </Tooltip>

        {unreadMessagesCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] size-5 rounded-full">
            {unreadMessagesCount}
          </Badge>
        )}
      </Link>
    </NavigationMenuLink>
  );
};

export default Messages;
