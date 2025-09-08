import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSendbirdSDK } from "@/hooks/useSendbird";
import { Link, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Badge, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Messages = () => {
  const { utils, isReady } = useSendbirdSDK();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    // Проверяем, что SDK готов перед выполнением запросов
    if (!isReady || !utils) {
      return;
    }

    const fetchUnreadMessagesCount = async () => {
      try {
        const result = await utils.getUnreadCount();
        if (result?.success) {
          setUnreadMessagesCount(Number(result.count) || 0);
        }
      } catch (error) {
        console.error("Error fetching unread messages count:", error);
      }
    };

    fetchUnreadMessagesCount();

    const interval = setInterval(fetchUnreadMessagesCount, 60000);

    return () => clearInterval(interval);
  }, [utils, isReady]);
  return (
    <NavigationMenuLink asChild className="p-3">
      <Link href="/messages" className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <MessageCircle size={22} className="text-gray-400 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Messages</p>
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
