import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  //@ts-ignore
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession(customerId: string) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    allow_promotion_codes: true,
    phone_number_collection: {
      enabled: false,
    },
    line_items: [{
      price: `${import.meta.env.VITE_STRIPE_PRODUCT_ID}`,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${import.meta.env.VITE_APP_URL}`,
    cancel_url: `${import.meta.env.VITE_APP_URL}`,
  });
}

export default stripe;
