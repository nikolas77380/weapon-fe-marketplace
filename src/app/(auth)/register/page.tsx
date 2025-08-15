"use client";

import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState } from "react";
import { BuyerFormValues } from "@/schemas/buyerSchema";
import { SellerFormValues } from "@/schemas/sellerSchema";
import { LoginFormValues } from "@/schemas/loginSchema";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import BuyerForm from "@/components/auth/BuyerForm";
import SellerForm from "@/components/auth/SellerForm";
import Breadcrumb from "@/components/auth/Breadcrumb";
import AuthSwitcher from "@/components/auth/AuthSwitcher";

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [authMode, setAuthMode] = useState<"login" | "register">(
    mode === "login" ? "login" : "register"
  );
  const [activeType, setActiveType] = useState<"buyer" | "seller">("buyer");

  const onBuyerSubmit = (values: BuyerFormValues) => {
    console.log("Buyer submitted:", values);
  };

  const onSellerSubmit = (values: SellerFormValues) => {
    console.log("Seller submitted:", values);
  };

  const onLoginSubmit = (values: LoginFormValues) => {
    console.log("Login submitted:", values);
  };
  return (
    <div className="h-screen w-full">
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
          <AuthSwitcher authMode={authMode} onAuthModeChange={setAuthMode} />
          {/* Content */}
          {authMode === "register" && (
            <>
              <Label className="mt-11">Account type</Label>
              <div className="flex items-center justify-between gap-11 mt-5">
                {/* Buyer */}
                <div
                  onClick={() => setActiveType("buyer")}
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
                  onClick={() => setActiveType("seller")}
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
                {activeType === "buyer" && (
                  <BuyerForm onSubmit={onBuyerSubmit} />
                )}

                {activeType === "seller" && (
                  <SellerForm onSubmit={onSellerSubmit} />
                )}
              </div>
            </>
          )}

          {authMode === "login" && <LoginForm onSubmit={onLoginSubmit} />}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
