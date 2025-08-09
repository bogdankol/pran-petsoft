import prisma from '@/lib/db'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  if(!signature) return Response.json({message: `No signature provided`}, { status: 400 })

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if(!secret) return Response.json({message: `No secret provided`}, { status: 400 })

  // verify webhook came from stripe, not from other source
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-07-30.basil', // explicitly set version
  })

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: unknown) {
    console.log('Webhook verification failed')
    return Response.json(null, { status: 400 })
  }

  console.log({signature, event})
  // fulfill order
  switch (event.type) {
    case 'checkout.session.completed':
      await prisma.user.update({
        where: {
          email: event.data.object.customer_email!,
        },
        data: {
          hasAccess: true,
        },
      })
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  // return 200 success to stripe, not to us
  return Response.json(null, { status: 200 })
}
