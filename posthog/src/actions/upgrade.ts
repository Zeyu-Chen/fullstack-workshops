"use server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";

const RETURN_URL = process.env.NEXT_PUBLIC_APP_URL;

export const upgrade = async () => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: session.user.email!,
    line_items: [{ 
      quantity: 1, 
      price: process.env.STRIPE_PRICE_ID,
    }],
    metadata: {
      userId: session.user.id!,
    },
    success_url: RETURN_URL,
    cancel_url: RETURN_URL,
  });

  return checkout.url;
};
