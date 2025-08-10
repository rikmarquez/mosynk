import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("Stripe-Signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      
      if (checkoutSession.mode === "subscription") {
        const subscription = await stripe.subscriptions.retrieve(
          checkoutSession.subscription as string
        )
        
        await db.subscription.upsert({
          where: {
            userId: checkoutSession.metadata?.userId!,
          },
          create: {
            userId: checkoutSession.metadata?.userId!,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          update: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })

        // Update user subscription tier
        await db.user.update({
          where: { id: checkoutSession.metadata?.userId! },
          data: { subscriptionTier: "premium" },
        })
      }
      break

    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice
      
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        )
        
        await db.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
      }
      break

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription
      
      await db.subscription.update({
        where: {
          stripeSubscriptionId: deletedSubscription.id,
        },
        data: {
          status: "canceled",
        },
      })

      // Update user subscription tier
      const userSubscription = await db.subscription.findUnique({
        where: { stripeSubscriptionId: deletedSubscription.id },
        include: { user: true },
      })

      if (userSubscription) {
        await db.user.update({
          where: { id: userSubscription.userId },
          data: { subscriptionTier: "free" },
        })
      }
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}