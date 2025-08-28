import { Shield } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  href: string;
}

const Logo = ({ href }: LogoProps) => {
  return (
    <Link href={href}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div
            className="w-12 h-12 bg-gradient-to-br from-slate-900 via-gray-800 to-black rounded-lg 
            flex items-center justify-center shadow-xl shadow-gray-400/50
            border border-gray-600/50 
            before:absolute before:inset-1 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-md
            after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/20 after:to-transparent after:rounded-lg"
          >
            <div className="relative flex items-center justify-center">
              <Shield className="size-10 text-gray-300" />
              <span className="absolute font-bold text-white z-10">
                E
              </span>
            </div>
          </div>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
        </div>
        <div className="flex flex-col">
          <span
            className="text-xl font-bold bg-gradient-to-r from-gray-700 via-slate-600 to-gray-900 
            bg-clip-text text-transparent"
          >
            Esviem
          </span>
          <span className="text-sm font-semibold text-gray-700 -mt-1">
            Defence
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
