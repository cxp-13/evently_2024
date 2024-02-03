"use server"

import { CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types"
import { redirect } from "next/navigation";
import Order from "../database/models/order.model";
import { handleError } from "../utils";
import connectToDatabase from "../database";
import { ObjectId } from "mongodb";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";

export const checkoutOrder = async (order: CheckoutOrderParams) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // 一美元等于100美分
    const price = order.isFree ? 0 : Number(order.price) * 100;
    console.log("order", order);
    console.log("转化后的price", price);
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: order.eventTitle
                        },
                        unit_amount: price,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                eventId: order.eventId,
            },
            client_reference_id: order.buyerId,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
        });

        console.log("session", session);
        redirect(session.url);
    } catch (error) {
        throw error
    }
}

export const createOrder = async (order: CreateOrderParams) => {
    try {
        console.log("createOrder", order);
        const newOrder = await Order.create({
            ...order,
            event: order.eventId,
            buyer: order.buyerId,
        });
        return JSON.parse(JSON.stringify(newOrder));
    } catch (error) {
        handleError(error)
    }
}

// GET ORDERS BY EVENT
export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
    try {
        await connectToDatabase()

        if (!eventId) throw new Error('Event ID is required')
        const eventObjectId = new ObjectId(eventId)

        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'buyer',
                    foreignField: '_id',
                    as: 'buyer',
                },
            },
            {
                $unwind: '$buyer',
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'event',
                    foreignField: '_id',
                    as: 'event',
                },
            },
            {
                $unwind: '$event',
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    createdAt: 1,
                    eventTitle: '$event.title',
                    eventId: '$event._id',
                    buyer: {
                        $concat: ['$buyer.firstName', ' ', '$buyer.lastName'],
                    },
                },
            },
            {
                $match: {
                    $and: [{ eventId: eventObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }],
                },
            },
        ])
        console.log("orders", orders);
        return JSON.parse(JSON.stringify(orders))
    } catch (error) {
        handleError(error)
    }
}

// GET ORDERS BY USER
export async function getOrdersByUser({ userId, limit = 3, page }: GetOrdersByUserParams) {
    try {
        await connectToDatabase()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { buyer: userId }

        const orders = await Order.distinct('event.title')
            .find(conditions)
            .sort({ createdAt: "desc" })
            .skip(skipAmount)
            .limit(limit)
            .populate({
                path: 'event',
                model: Event,
                populate: {
                    path: 'organizer',
                    model: User,
                    select: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1
                    }
                }
            })
        // 使用distinct的原因是因为每个event有多个ticket。只筛选出event的数组并统计user买的数量 
        const ordersCount = await Order.distinct('event._id').countDocuments(conditions)
        console.log("=========getOrdersByUser=======");
        
        console.log("orders", orders, "ordersCount", ordersCount, "limit", limit);
        return { data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) }
    } catch (error) {
        handleError(error)
    }
}
