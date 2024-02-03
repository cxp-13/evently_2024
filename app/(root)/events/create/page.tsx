import EventForm from '@/components/shared/EventForm'
import { auth, useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'

const CreateEvent = () => {
    const authRes = auth()
    console.log("authRes", authRes);
    
    // const curUserId = sessionClaims?.userId as string

    // const { isSignedIn, user, isLoaded } = useUser();
    // const curUserId = user?.publicMetadata.userId || ""
    const curUserId = authRes.sessionClaims!.userId

    // useEffect(()=>{
    //     console.log("user", user);
    //     console.log("authRes", authRes);

        
    // })

    return (
        <>
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <h3 className='wrapper h3-hold text-center sm:text-left '>
                    Create Event
                </h3>
            </section>

            <section className='wrapper py-8'>
                <EventForm userId={curUserId as string} type="Create"/>
            </section>
        </>
    )
}

export default CreateEvent