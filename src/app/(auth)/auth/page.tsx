"use client";

import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { RegisterFormValues } from "@/schemas/registerSchema";
import { SellerFormValues } from "@/schemas/sellerSchema";
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
  }, []);

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
        if (isSeller(currentUser)) {
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
    <div className="h-full w-full mb-20">
      <div className="max-w-xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb />
        <div className="border border-black mt-5 flex flex-col py-7 px-12 rounded-3xl">
          <div className="flex flex-col items-center justify-center text-center">
            <h1
              className="text-xl size-16 font-bold rounded-full border border-black flex items-center 
              justify-center"
            >
              <span>WM</span>
            </h1>
            <h2 className="font-semibold text-2xl font-roboto mt-8">Join WM</h2>
            <p className="mt-3.5 font-roboto text-xl text-[#B1ADAD] max-w-[310px] text-center">
              access the premier marketplace for weapon
            </p>
          </div>
          {/* Switcher */}
          <AuthSwitcher authMode={authMode} onAuthModeChange={handleAuthMode} />
          {/* Content */}
          {authMode === "register" && (
            <>
              <Label className="mt-11">Account type</Label>
              <div className="flex items-center justify-between gap-11 mt-5">
                {/* Buyer */}
                <div
                  onClick={() => handleTypeChange("buyer")}
                  className={`border flex flex-col items-center justify-center pt-2.5 pb-4.5 px-2.5 rounded-md cursor-pointer transition-colors
                    ${
                      activeType === "buyer"
                        ? "border-black bg-gray-primary"
                        : "border-[#D3D3D3] bg-transparent"
                    }`}
                >
                  <Image
                    src="/auth/user-auth.svg"
                    alt="user-auth"
                    width={50}
                    height={50}
                    className="size-8"
                  />
                  <h1 className="mt-1 font-bold">Buyer</h1>
                  <p className="mt-3.5 text-[10px] max-w-[166px] text-center">
                    Law enforcement, military, security professionals
                  </p>
                </div>
                {/* Seller */}
                <div
                  onClick={() => handleTypeChange("seller")}
                  className={`border flex flex-col items-center justify-center pt-2.5 pb-4.5 px-2.5 rounded-md cursor-pointer transition-colors
                    ${
                      activeType === "seller"
                        ? "border-black bg-gray-primary"
                        : "border-[#D3D3D3] bg-transparent"
                    }`}
                >
                  <Image
                    src="/auth/briefcase.svg"
                    alt="user-auth"
                    width={50}
                    height={50}
                    className="size-8"
                  />
                  <h1 className="mt-1 font-bold">Seller</h1>
                  <p className="mt-3.5 text-[10px] max-w-[166px] text-center">
                    Licensed dealers, manufacturers, suppliers
                  </p>
                </div>
              </div>

              {/* Forms */}
              <div className="mt-8">
                <RegisterForm onSubmit={onRegistrationSubmit} />
              </div>
            </>
          )}

          {authMode === "login" && <LoginForm onSubmit={onLoginSubmit} />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
