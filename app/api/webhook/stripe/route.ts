import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { clerkClient } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/actions/order.actions'
import Stripe from 'stripe';


export async function POST(request: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!


    const reqText = await request.text()
    const reqBody = request.body
    const sig = request.headers.get("stripe-signature")
    let event;
    try {
        console.log("sig", sig);
        console.log("endpointSecret", endpointSecret);
        event = stripe.webhooks.constructEvent(reqText, sig!, endpointSecret);
        console.log("event", event);
    } catch (err) {
        return NextResponse.json({ code: 400, message: `Webhook Error: ${err.message}` })
    }

    // Get the ID and type
    const eventType = event.type

    if (eventType === 'checkout.session.completed') {
        console.log('--------- Order created: --------');

        const { id, data } = event;
        const { metadata, client_reference_id, amount_total, created } = data.object;
        const order = {
            stripeId: id,
            eventId: metadata!.eventId,
            buyerId: client_reference_id!,
            totalAmount: (amount_total! / 100).toString(),
            createdAt: new Date()
        }
        const newOrder = await createOrder(order);
        return NextResponse.json({ message: 'OK', order: newOrder })
    }

    return NextResponse.json({ message: '其他情况' })
}
