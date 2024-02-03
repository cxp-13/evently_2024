'use server'
import { currentUser } from "@clerk/nextjs";
import connectToDatabase from "../database";
import Event, { IEvent } from "../database/models/event.model";
import { formatPrice, handleError } from "../utils";
import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types";
import queryString from "query-string";
import Category from "../database/models/category.model";
import User from "../database/models/user.model";
import { Query } from "mongoose";
import { revalidatePath } from "next/cache";


export const createEvent = async ({ userId, event, path }: CreateEventParams) => {
    console.log("createEvent", userId, event, path);

    try {
        await connectToDatabase()
        let newEvent = await Event.create({
            organizer: userId,
            ...event,
            category: event.categoryId
        });

        let eventJSON = JSON.parse(JSON.stringify(newEvent));

        console.log("createEvent success");
        console.log("newEvent", newEvent);
        console.log("eventJSON", eventJSON);


        return eventJSON;
    } catch (error) {
        handleError(error)
    }
};

const populateEvent = async (query: any) => {
    return query
        .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
        .populate({ path: 'category', model: Category, select: '_id name' })
}

export const getEventById = async (eventId: string) => {
    console.log("getEventById", eventId);
    try {
        await connectToDatabase()
        const event = await populateEvent(Event.findById(eventId))
        console.log("event", event);

        if (!event) {
            throw new Error("Event not found")
        }
        return JSON.parse(JSON.stringify(event))
    } catch (error) {
        handleError(error)

    }
};

const getCategoryByName = async (name: string) => {
    const category = await Category.findOne({ name })
    console.log("getCategoryIdByName", category);
    return category
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, categoryName }: GetAllEventsParams) {
    try {
        await connectToDatabase()

        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}


        const category = await getCategoryByName(categoryName)

        console.log("getAllEvents--category", category);


        const categoryCondition = category ? { category: category._id } : {}

        const conditions = {
            $and: [titleCondition, categoryCondition],
        }

        const skipAmount = (Number(page) - 1) * limit

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)



        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        console.log("events", events);


        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventsCount / limit),
        }
    } catch (error) {
        handleError(error)
    }
}

export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
    console.log("getEventById", eventId);
    try {
        await connectToDatabase()
        const deleteEvent = await Event.findByIdAndDelete(eventId)

        if (!deleteEvent) {
            revalidatePath(path)
        }
    } catch (error) {
        handleError(error)
    }
};

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
}: GetRelatedEventsByCategoryParams) {
    try {
        await connectToDatabase()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

// GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
    try {
        await connectToDatabase()

        const conditions = { organizer: userId }
        const skipAmount = (page - 1) * limit

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

export const updateEvent = async ({ userId, event, path }: UpdateEventParams) => {
    try {
        await connectToDatabase()
        const updateEvent = await Event.findByIdAndUpdate(event._id, event, { new: true })
        if (!updateEvent) {
            revalidatePath(path)
        }
        return updateEvent
    } catch (error) {
        handleError(error)
    }
};


