"use client"
import { IEvent } from '@/lib/database/models/event.model'
import { SignedOut } from '@clerk/clerk-react'
import { SignedIn, useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Check } from 'lucide-react'
import Checkout from './Checkout'

const CheckoutButton = ({ event }: { event: IEvent }) => {
    const { isSignedIn, user, isLoaded } = useUser()
    const hasEventFinised = new Date() > new Date(event.endDateTime);
    console.log("CheckoutButton--user", user);
    
    const userId = user?.publicMetadata.userId
    return (
        
        <div className='flex items-center gap-3'>
            {
                hasEventFinised ? (
                    <p className='p-2 text-red-400'>Sorry, tickets are no longer available.</p>
                ) : (
                    <>
                        <SignedOut>
                            <Button asChild className='button rounded-full' size={"lg"}>
                                <Link href="/sign-in">
                                    Get Tickets
                                </Link>
                            </Button>
                        </SignedOut>
                        <SignedIn>
                            <Checkout event={event} userId={userId} />
                        </SignedIn>
                    </>
                )
            }
        </div>
    )
}

export default CheckoutButton