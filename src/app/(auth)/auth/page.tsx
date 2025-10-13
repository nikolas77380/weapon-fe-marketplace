"use client";

// import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { RegisterFormValues } from "@/schemas/registerSchema";
import { LoginFormValues } from "@/schemas/loginSchema";
import { useSearchParams, useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthSwitcher from "@/components/auth/AuthSwitcher";
import {
  // registerBuyer,
  login,
  getSessionTokenFromCookie,
  registerSeller,
  // getCurrentUser,
} from "@/lib/auth";
import { useAuthContext } from "@/context/AuthContext";
// import { isSeller } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
// import { Tag, User } from "lucide-react";
// import { UserProfile } from "@/lib/types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const AuthPage = () => {
  const t = useTranslations("Auth");

  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchUser } = useAuthContext();

  const mode = searchParams.get("mode");
  // const type = searchParams.get("type");

  const [authMode, setAuthMode] = useState<"login" | "register">(
    mode === "login" ? "login" : "register"
  );
  // Always seller - buyer type removed
  // const [activeType, setActiveType] = useState<"buyer" | "seller">(
  //   type === "seller" ? "seller" : "buyer"
  // );
  // const activeType = "seller";

  useEffect(() => {
    const currentMode = searchParams.get("mode");
    const currentType = searchParams.get("type");

    // Remove type parameter from URL if present - always seller
    if (currentType) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("type");
      router.replace(`/auth?${params.toString()}`, { scroll: false });
      return;
    }

    if (currentMode === "login") {
      setAuthMode("login");
    } else {
      setAuthMode("register");
    }

    // Type switching removed - always seller
    // if (currentType === "seller") {
    //   setActiveType("seller");
    // } else if (currentType === "buyer") {
    //   setActiveType("buyer");
    // }
  }, [searchParams, router]);

  // Check if user is already authenticated
  useEffect(() => {
    const sessionToken = getSessionTokenFromCookie();
    if (sessionToken) {
      console.log("User is already authenticated");
      router.push("/");
    }
  }, [router]);

  const handleAuthMode = (mode: "login" | "register") => {
    setAuthMode(mode);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);

    // Type parameter removed - always seller
    // if (mode === "login") {
    //   params.delete("type");
    // } else if (mode === "register" && !params.has("type")) {
    //   params.set("type", "buyer");
    // }
    params.delete("type");

    router.replace(`/auth?${params.toString()}`, { scroll: false });
  };

  // Type switching removed - always seller
  // const handleTypeChange = (type: "buyer" | "seller") => {
  //   setActiveType(type);
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set("type", type);
  //   router.replace(`/auth?${params.toString()}`, { scroll: false });
  // };

  const onRegistrationSubmit = async (
    values: RegisterFormValues
  ): Promise<void> => {
    console.log("Attempting registration with:", values);
    try {
      // Always register as seller
      // let response;
      // if (activeType === "buyer") {
      //   response = await registerBuyer(values);
      //   console.log("Buyer registration response:", response);
      // } else if (activeType === "seller") {
      //   response = await registerSeller(values);
      //   console.log("Seller registration response:", response);
      // }

      const response = await registerSeller(values);
      console.log("Seller registration response:", response);

      if (response && "jwt" in response) {
        console.log("Registration successful! JWT cookie set");
        await fetchUser();
        // if (isSeller(response.user)) {
        //   router.push("/account");
        // } else {
        //   router.push("/marketplace");
        // }
        router.push("/account");
      } else {
        console.error("Registration failed:", response);
        toast.error(t("toasts.registrationFailed"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t("toasts.registrationFailed"));
    }
  };

  const onLoginSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      console.log("Attempting login with:", values);
      const response = await login(values);
      console.log("Login response:", response);

      if (response && "jwt" in response) {
        // const currentUser = await getCurrentUser(response.jwt);
        console.log("Login successful! JWT cookie set");
        await fetchUser();
        console.log("response.user", response.user);
        // Always redirect to account - only sellers can login
        // if (isSeller(currentUser as UserProfile)) {
        //   router.push("/account");
        // } else {
        //   router.push("/marketplace");
        // }
        router.push("/account");
      } else {
        console.error("Login failed - no JWT in response:", response);
        toast.error(t("toasts.invalidCredentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t("toasts.loginFailed"));
    }
  };

  return (
    <div className="min-h-screen h-full w-full relative pt-4 sm:pt-6 pb-8 sm:pb-12 lg:pb-16 z-1">
      <div className="absolute inset-0 z-[-1] bg-[#f2eeee]">
        <Image
          src="/auth/bg.png"
          alt="bg"
          fill
          className="object-cover mix-blend-exclusion w-full h-full"
        />
      </div>
      <div className="container mx-auto px-layout sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-0">
          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-170">
            <div className="flex items-center justify-between lg:justify-center w-full mb-4 lg:mb-0">
              {/* Пустой div для выравнивания на мобильных */}
              <div className="lg:hidden w-8"></div>
              <div className="flex justify-center">
                <Logo />
              </div>
              {/* Language Switcher на мобильных */}
              <div className="lg:hidden">
                <LanguageSwitcher classNameSelectTrigger="shadow-none border-[#f1eded] bg-[#f1eded]" />
              </div>
            </div>
            <div
              className={`border border-border-foreground rounded-sm ${
                authMode === "login" ? "mt-6 lg:mt-41" : "mt-4 lg:mt-6"
              } flex bg-background flex-col w-full lg:w-170 mx-auto`}
            >
              <div className="flex flex-col items-center justify-center text-center border-b 
              border-border-foreground px-4 sm:px-6">
                <h2 className="font-medium text-xl sm:text-2xl mt-3.5 bg-gradient-to-r from-foreground to-gray-secondary bg-clip-text text-transparent">
                  {t("titleMain")}
                </h2>
                <p className="mt-2.5 mb-3.5 font-light text-center text-sm sm:text-base">
                  {t("descriptionMain")}
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
                    {/* Type switcher removed - always seller registration */}
                    {/* <div className="flex flex-col px-4 sm:px-6 lg:px-3.5">
                      <Label className="mt-6 font-light text-sm sm:text-base">
                        {t("register.accountType")}
                      </Label>
                      <div className="flex flex-col sm:flex-row mt-3.5 w-full gap-2 sm:gap-0">
                        <div
                          onClick={() => handleTypeChange("buyer")}
                          className={`border w-full flex flex-col items-center justify-center py-3 sm:py-2.5 px-3 sm:px-3.5 cursor-pointer transition-colors
                    ${
                      activeType === "buyer"
                        ? "bg-gold-main text-white"
                        : "border-border-foreground bg-transparent text-muted-foreground"
                    }`}
                        >
                          <User
                            className="size-6 sm:size-8"
                            strokeWidth={0.5}
                          />
                          <h1 className="mt-2 sm:mt-2.5 font-medium text-sm sm:text-base">
                            {t("register.buyer")}
                          </h1>
                          <p className="mt-1 text-xs sm:text-sm text-center font-light max-w-full sm:max-w-73">
                            {t("register.userDescription")}
                          </p>
                        </div>
                        <div
                          onClick={() => handleTypeChange("seller")}
                          className={`border w-full flex flex-col items-center justify-center py-3 sm:py-2.5 px-3 sm:px-3.5 cursor-pointer transition-colors
                    ${
                      activeType === "seller"
                        ? "bg-gold-main text-white"
                        : "border-border-foreground bg-transparent text-muted-foreground"
                    }`}
                        >
                          <Tag
                            className="size-6 sm:size-8 rotate-90"
                            strokeWidth={0.5}
                          />
                          <h1 className="mt-2 sm:mt-2.5 font-medium text-sm sm:text-base">
                            {t("register.seller")}
                          </h1>
                          <p className="mt-1 text-xs sm:text-sm text-center font-light max-w-full sm:max-w-73">
                            {t("register.userDescription")}
                          </p>
                        </div>
                      </div>
                    </div> */}

                    {/* Forms */}
                    <div className="mt-6">
                      <RegisterForm onSubmit={onRegistrationSubmit} />
                      <div className="text-center flex items-center justify-center py-3.5 border-t border-border-foreground w-full px-4 sm:px-6">
                        <p className="text-xs sm:text-sm font-light text-center">
                          {t("register.footerDescripotion")}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {authMode === "login" && (
                  <>
                    <LoginForm onSubmit={onLoginSubmit} />
                    {/* <div className="text-center flex items-center justify-center border-t border-border-foreground w-full px-4 sm:px-6">
                      <p className="text-xs sm:text-sm font-light flex py-3.5 text-center">
                        {t("login.footerDescripotion")}
                      </p>
                    </div> */}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Language Switcher - только на десктопе */}
          <div className="hidden lg:flex lg:justify-start lg:max-w-[200px] w-full lg:mt-0">
            <LanguageSwitcher classNameSelectTrigger="shadow-none border-[#f1eded] bg-[#f1eded]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
