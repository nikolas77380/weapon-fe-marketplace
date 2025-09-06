"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthSwitcherProps {
  authMode: "login" | "register";
  onAuthModeChange: (mode: "login" | "register") => void;
}

const AuthSwitcher = ({ authMode, onAuthModeChange }: AuthSwitcherProps) => {
  return (
    <div className="px-3.5">
      <Tabs
        value={authMode}
        onValueChange={(value) =>
          onAuthModeChange(value as "login" | "register")
        }
        className="w-full mt-6 border border-border-foreground "
      >
        <TabsList className="grid w-full h-11 grid-cols-2 bg-gray-primary">
          <TabsTrigger value="login" className="text-lg font-normal">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="text-lg font-normal">
            Register
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AuthSwitcher;
