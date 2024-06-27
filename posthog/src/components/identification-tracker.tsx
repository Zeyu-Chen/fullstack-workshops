"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePostHog } from "posthog-js/react";
import { useRouter, useSearchParams } from "next/navigation";

export const IdentificationTracker = () => {
  const posthog = usePostHog();
  const { data } = useSession();

  const router = useRouter();
  const params = useSearchParams();

  const loginState = params.get("loginState");

  useEffect(() => {
    if (loginState) {
      if (loginState === "signedIn" && data?.user.id) {
        posthog.identify(data.user.id);
      }

      if (loginState === "signedOut") {
        posthog.reset();
      }

      router.replace("/");
    }
  }, [data?.user.id, loginState, posthog, router]);

  return <></>;
};
