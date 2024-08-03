import Stripe from "stripe";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { pointTable, userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const body = await request.text();
    const endpointSecret = process.env.STRIPE_WEBHOOK_KEY!;
    const sig = headers().get("stripe-signature") as string;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      return new Response(`Webhook Error: ${err}`, {
        status: 400,
      });
    }

    const eventType = event.type;
    if (
      eventType === "checkout.session.completed" ||
      eventType === "checkout.session.async_payment_succeeded"
    ) {
      const data = event.data.object;
      const customerEmail = data.customer_details?.email;
      await SubCreated(customerEmail!);
      return new Response("Subscription created", {
        status: 201,
      });
    }
    if (eventType === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Получаем информацию о клиенте
      const customer = await stripe.customers.retrieve(customerId);

      let customerEmail: string | undefined;

      if (customer.deleted !== true) {
        // Клиент существует
        customerEmail = (customer as Stripe.Customer).email!;
      } else {
        // Клиент был удален
        console.log(`Customer ${customerId} was deleted`);
        customerEmail = undefined;
      }

      if (customerEmail) {
        console.log(`Subscription deleted for user: ${customerEmail}`);
        await SubDeleted(customerEmail);
      } else {
        console.log(
          `Subscription deleted for user with unknown email. Customer ID: ${customerId}`
        );
      }

      return new Response("Subscription deleted", {
        status: 200,
      });
    }
    return new Response("Event processed", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Server error", {
      status: 500,
    });
  }
}

async function SubDeleted(email: string) {
  await db
    .update(userTable)
    .set({ role: "free" })
    .where(eq(userTable.email, email));
}

async function SubCreated(email: string) {
  const user_id = await db
    .select({
      id: userTable.id,
    })
    .from(userTable)
    .where(eq(userTable.email, email));
  if (user_id.length === 0) {
    return new Response("User not found", {
      status: 404,
    });
  }
  await db
    .update(userTable)
    .set({ role: "premium" })
    .where(eq(userTable.id, user_id[0].id));
  await db
    .update(pointTable)
    .set({
      point: 700,
      updated_at: new Date().toISOString(),
    })
    .where(eq(pointTable.user_id, user_id[0].id));
}
