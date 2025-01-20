"use client";

import { useAuthStore } from "@/src/store/useAuthStore";
import { useEffect } from "react";

import { ReactNode } from "react";

export default function ClientApplication({
  children,
}: {
  children: ReactNode;
}) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser().catch((err) => {
      console.log(err);
    });
  }, [fetchUser]);

  return children;
}
