"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register?mode=login");
  }, [router]);

  return null;
};

export default LoginPage;
