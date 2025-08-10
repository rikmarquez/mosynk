import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

export const getStripePublishableKey = () => {
  const publishableKey = process.env.STRIPE_PUBLIC_KEY

  if (!publishableKey) {
    throw new Error("STRIPE_PUBLIC_KEY is not set")
  }

  return publishableKey
}