"use client";

import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { RegisterFormValues } from "@/schemas/registerSchema";
import { LoginFormValues } from "@/schemas/loginSchema";
import { useSearchParams, useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Breadcrumb from "@/components/auth/Breadcrumb";
import AuthSwitcher from "@/components/auth/AuthSwitcher";
import {
  registerBuyer,
  login,
  getSessionTokenFromCookie,
  registerSeller,
  getCurrentUser,
} from "@/lib/auth";
import { useAuthContext } from "@/context/AuthContext";
import { isSeller } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { Tag, User } from "lucide-react";
import { UserProfile } from "@/lib/types";

const AuthPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchUser } = useAuthContext();

  const mode = searchParams.get("mode");
  const type = searchParams.get("type");

  const [authMode, setAuthMode] = useState<"login" | "register">(
    mode === "login" ? "login" : "register"
  );
  const [activeType, setActiveType] = useState<"buyer" | "seller">(
    type === "seller" ? "seller" : "buyer"
  );

  useEffect(() => {
    const currentMode = searchParams.get("mode");
    const currentType = searchParams.get("type");

    if (currentMode === "login") {
      setAuthMode("login");
    } else {
      setAuthMode("register");
    }

    if (currentType === "seller") {
      setActiveType("seller");
    } else if (currentType === "buyer") {
      setActiveType("buyer");
    }
  }, [searchParams]);

  // Check if user is already authenticated
  useEffect(() => {
    const sessionToken = getSessionTokenFromCookie();
    if (sessionToken) {
      console.log("User is already authenticated");
      router.push("/marketplace");
    }
  }, [router]);

  const handleAuthMode = (mode: "login" | "register") => {
    setAuthMode(mode);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);

    if (mode === "login") {
      params.delete("type");
    } else if (mode === "register" && !params.has("type")) {
      params.set("type", "buyer");
    }

    router.replace(`/auth?${params.toString()}`, { scroll: false });
  };

  const handleTypeChange = (type: "buyer" | "seller") => {
    setActiveType(type);
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    router.replace(`/auth?${params.toString()}`, { scroll: false });
  };

  const onRegistrationSubmit = async (values: RegisterFormValues) => {
    console.log("Attempting registration with:", values);
    try {
      let response;
      if (activeType === "buyer") {
        response = await registerBuyer(values);
        console.log("Buyer registration response:", response);
      } else if (activeType === "seller") {
        response = await registerSeller(values);
        console.log("Seller registration response:", response);
      }

      if (response && "jwt" in response) {
        console.log("Buyer registration successful! JWT cookie set");
        await fetchUser();
        if (isSeller(response.user)) {
          router.push("/account");
        } else {
          router.push("/marketplace");
        }
      } else {
        console.error("Buyer registration failed:", response);
      }
    } catch (error) {
      console.error("Buyer registration error:", error);
    }
  };

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      console.log("Attempting login with:", values);
      const response = await login(values);
      console.log("Login response:", response);

      if (response && "jwt" in response) {
        const currentUser = await getCurrentUser(response.jwt);
        console.log("Login successful! JWT cookie set");
        await fetchUser();
        console.log("response.user", response.user);
        if (isSeller(currentUser as UserProfile)) {
          router.push("/account");
        } else {
          router.push("/marketplace");
        }
      } else {
        console.error("Login failed - no JWT in response:", response);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen h-full w-full relative pt-30 pb-22 z-1">
      <div className="absolute inset-0 z-[-1] bg-[#e7e7e7]">
        <Image
          src="/auth/bg.png"
          alt="bg"
          fill
          className="object-cover mix-blend-exclusion w-full h-full"
        />
      </div>
      <div className="container mx-auto flex items-start">
        {/* Breadcrumb */}
        <Breadcrumb />

        <div className="mx-auto max-w-170">
          <div className="flex justify-center">
            <Logo href="/" />
          </div>
          <div
            className={`border border-border-foreground ${
              authMode === "login" ? "mt-41" : "mt-6"
            } flex flex-col bg-primary-foreground w-170`}
          >
            <div className="flex flex-col items-center justify-center text-center border-b border-border-foreground">
              <h2 className="font-medium text-2xl mt-3.5 bg-gradient-to-r from-foreground to-gray-secondary bg-clip-text text-transparent">
                Join Esviem Defence
              </h2>
              <p className="mt-2.5 mb-3.5 font-light text-center">
                Access the premier marketplace for weapon
              </p>
            </div>
            <div className="w-full">
              {/* Switcher */}
              <AuthSwitcher
                authMode={authMode}
                onAuthModeChange={handleAuthMode}
              />
              {/* Content */}
              {authMode === "register" && (
                <>
                  <div className="flex flex-col px-3.5">
                    <Label className="mt-6 font-light">Account type</Label>
                    <div className="flex mt-3.5 w-full">
                      {/* Buyer */}
                      <div
                        onClick={() => handleTypeChange("buyer")}
                        className={`border w-full flex flex-col items-center justify-center py-2.5 px-3.5 cursor-pointer transition-colors
                    ${
                      activeType === "buyer"
                        ? "bg-gold-main text-white"
                        : "border-border-foreground bg-transparent text-muted-foreground"
                    }`}
                      >
                        <User className="size-8" strokeWidth={0.5} />
                        <h1 className="mt-2.5 font-lg">Buyer</h1>
                        <p className="mt-1 text-sm text-center font-light max-w-73">
                          Law enforcement, military, security professionals
                        </p>
                      </div>
                      {/* Seller */}
                      <div
                        onClick={() => handleTypeChange("seller")}
                        className={`border w-full flex flex-col items-center justify-center py-2.5 px-3.5 cursor-pointer transition-colors
                    ${
                      activeType === "seller"
                        ? "bg-gold-main text-white"
                        : "border-border-foreground bg-transparent text-muted-foreground"
                    }`}
                      >
                        <Tag className="size-8 rotate-90" strokeWidth={0.5} />
                        <h1 className="mt-2.5 font-lg">Seller</h1>
                        <p className="mt-1 text-sm text-center font-light max-w-73">
                          Law enforcement, military, security professionals
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Forms */}
                  <div className="mt-6">
                    <RegisterForm onSubmit={onRegistrationSubmit} />
                    <div className="text-center flex items-center justify-center py-3.5 border-t border-border-foreground w-full">
                      <p className="text-xs font-light">
                        By creating an account, you agree to comply with all
                        federal, state, and local laws regarding the sale and
                        transfer of tactical equipment.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {authMode === "login" && (
                <>
                  <LoginForm onSubmit={onLoginSubmit} />
                  <div className="text-center flex items-center justify-center border-t border-border-foreground w-full">
                    <p className="text-sm font-light flex py-3.5">
                      Secure authentication with industry-standard encryption
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
