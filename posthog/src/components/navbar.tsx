"use client";

import qs from "query-string";
import { usePostHog } from "posthog-js/react";
import { useSession, signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const posthog = usePostHog();
  const { data } = useSession();

  const onClick = () => {
    const callbackUrl = qs.stringifyUrl({
      url: process.env.NEXT_PUBLIC_APP_URL!,
      query: {
        loginState: data ? "signedOut" : "signedIn",
      },
    });

    if (data) {
      posthog.capture("logout_clicked");
      return signOut({ callbackUrl });
    }

    posthog.capture("login_clicked");
    signIn("github", { callbackUrl });
  };

  return (
    <nav className="flex items-center border-b shadow-sm p-4">
      <h1 className="font-bold text-xl">
        Analytics
      </h1>
      <div className="ml-auto">
        <Button onClick={onClick}>
          {data ? "Sign out" : "Sign in"}
        </Button>
      </div>
    </nav>
  );
};
