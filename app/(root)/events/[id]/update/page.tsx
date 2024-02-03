import EventForm from '@/components/shared/EventForm'
import { getEventById } from '@/lib/actions/event.actions'
import { UpdateEventParams } from '@/types'
import { auth } from '@clerk/nextjs'
import React from 'react'

type UpdateEventProps = {
    params: {
        id: string;
    }
}

const UpdateEvent = async ({ params: { id } }: UpdateEventParams) => {

    const event = await getEventById(id)

    const { sessionClaims } = auth()

    const userId = sessionClaims?.userId as string

    return (
        <>
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <h3 className='wrapper h3-hold text-center sm:text-left '>
                    Update Event
                </h3>
            </section>
            <section className='wrapper py-8'>
                <EventForm userId={userId} type="Update" event={event} eventId={event._id}/>
            </section>
        </>
    )
}

export default UpdateEvent