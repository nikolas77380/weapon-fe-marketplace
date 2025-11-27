import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const Messages = () => {
  const t = useTranslations("Navbar");

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
      </Link>
    </NavigationMenuLink>
  );
};

export default Messages;
