"use client";

import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

import { upgrade } from "@/actions/upgrade";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePostHog } from "posthog-js/react";

export default function Home() {
  const posthog = usePostHog();
  const router = useRouter();
  const { data } = useSession();

  const onUpgrade = () => {
    posthog.capture("upgrade_clicked");

    if (!data) {
      posthog.capture("login_redirected");
      return signIn("github");
    }

    upgrade().then((url) => {
      if (url) {
        router.push(url);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            Upgrade
          </CardTitle>
          <CardDescription>
            {data?.user.subscription 
              ? "You are already subscribed" 
              : "Subscribe to unlock premium features"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full"
            onClick={onUpgrade} 
            disabled={!!data?.user?.subscription} 
          >
            Upgrade
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
