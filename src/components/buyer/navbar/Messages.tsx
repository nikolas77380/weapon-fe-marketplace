import { useSendbirdSDK } from "@/hooks/useSendbird";
import { Link, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Badge, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Messages = () => {
  const { utils } = useSendbirdSDK();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      const result = await utils?.getUnreadCount();
      console.log(result);
      if (result?.success) {
        setUnreadMessagesCount(result.count);
      }
    };
    fetchUnreadMessagesCount();
  }, [utils]);
  console.log(unreadMessagesCount);
  return (
    <NavigationMenuLink asChild className="p-3">
      <Link href="/messages" className="relative">
        <MessageCircle size={22} className="text-gray-400 cursor-pointer" />
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
