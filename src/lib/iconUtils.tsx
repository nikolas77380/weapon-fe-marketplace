import {
  BadgeCheck,
  MessageSquare,
  Share2,
  Search,
  Users,
  Handshake,
} from "lucide-react";

export type IconName =
  | "BadgeCheck"
  | "Share2"
  | "MessageSquare"
  | "Search"
  | "Users"
  | "Handshake";

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const getIcon = (name: IconName, props?: IconProps) => {
  const defaultProps: IconProps = {
    size: 30,
    className: "text-[#c29e8a]",
    strokeWidth: 1.5,
    ...props,
  };

  switch (name) {
    case "BadgeCheck":
      return <BadgeCheck {...defaultProps} />;
    case "Share2":
      return <Share2 {...defaultProps} />;
    case "MessageSquare":
      return <MessageSquare {...defaultProps} />;
    case "Search":
      return <Search {...defaultProps} />;
    case "Users":
      return <Users {...defaultProps} />;
    case "Handshake":
      return <Handshake {...defaultProps} />;
    default:
      return <BadgeCheck {...defaultProps} />;
  }
};