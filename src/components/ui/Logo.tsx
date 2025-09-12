import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/">
      <div className={cn("flex items-center gap-2", className)}>
        <div className="relative">
          <div
            className="w-12 h-12 bg-gradient-to-br from-gold-main to-gray-secondary rounded-lg 
            flex items-center justify-center shadow-lg shadow-gold-main/50
            border border-gold-main/50 
            before:absolute before:inset-1 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-md
            after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/20 after:to-transparent after:rounded-lg"
          >
            <div className="relative flex items-center justify-center">
              <Shield className="size-10 text-white" />
              <span className="absolute font-bold text-white z-10">E</span>
            </div>
          </div>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gold-main/20 to-gray-secondary/20"></div>
        </div>
        <div className="flex flex-col">
          <span
            className="text-xl font-bold bg-gradient-to-r from-gold-main to-gray-secondary
            bg-clip-text text-transparent"
          >
            Esviem
          </span>
          <span className="text-sm font-semibold text-gold-main -mt-1">
            Defence
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
