import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Badge, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUnreadChats } from "@/context/UnreadChatsContext";

const Messages = () => {
  const t = useTranslations("Navbar");
  const { unreadChatsCount } = useUnreadChats();

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

        {unreadChatsCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] size-5 rounded-full">
            {unreadChatsCount}
          </Badge>
        )}
      </Link>
    </NavigationMenuLink>
  );
};

export default Messages;
