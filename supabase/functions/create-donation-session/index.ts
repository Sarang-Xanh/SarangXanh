import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getBaseUrl = (req: Request) => {
  const origin = req.headers.get("origin");
  return origin || "http://localhost:5173";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
    if (!stripeKey) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const { amount, frequency } = await req.json();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const mode = frequency === "monthly" ? "subscription" : "payment";
    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "SarangXanh Donation",
            },
            unit_amount: Math.round(numericAmount * 100),
            recurring: mode === "subscription" ? { interval: "month" } : undefined,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/donate?status=success`,
      cancel_url: `${baseUrl}/donate?status=cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("Stripe session error:", err);
    return new Response(JSON.stringify({ error: "Failed to create session" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
