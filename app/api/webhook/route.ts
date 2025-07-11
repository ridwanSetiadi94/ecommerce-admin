import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new NextResponse("Webhook secret not configured.", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.postal_code,
      address?.country,
    ];

    const addressString = addressComponents
      .filter((component): component is string => Boolean(component))
      .join(", ");

    try {
      const order = await prismadb.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || "",
        },
        include: {
          orderItems: true,
        },
      });

      const productIds = order.orderItems.map((item) => item.productId);

      await prismadb.product.updateMany({
        where: {
          id: { in: productIds },
        },
        data: {
          isArchived: true,
        },
      });
    } catch (err) {
      console.error("Database error:", err);
      return new NextResponse("Database update failed", { status: 500 });
    }
  }

  // Return 200 to acknowledge all other event types too
  return new NextResponse(null, { status: 200 });
}
