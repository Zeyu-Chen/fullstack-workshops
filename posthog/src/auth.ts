import { eq } from "drizzle-orm";
import NextAuth, { DefaultSession } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GithubProvider from "next-auth/providers/github";

import { db } from "@/db/drizzle";
import { PostHogClient } from "@/lib/posthog";
import { userSubscription } from "@/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      subscription?: typeof userSubscription.$inferSelect;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GithubProvider],
  events: {
    signIn: ({ user, account }) => {
      if (!user?.id) return;

      const posthog = PostHogClient();

      posthog.capture({
        distinctId: user.id,
        event: "login_successful",
        properties: {
          provider: account?.provider,
        }
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      const [subscription] = await db
        .select()
        .from(userSubscription)
        .where(eq(userSubscription.userId, user.id));

      session.user.id = user.id
      session.user.subscription = subscription;
      return session
    },
  }
});
