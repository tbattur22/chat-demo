import React, { useState, useEffect } from 'react'
import { type SharedData, User } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import ChatAppLayout from '@/layouts/chat-app-layout';
import ChatContent from './chatContent';
import '../echo.js';

export default function Chat({ friend, curUser, messages }: { friend: User, curUser: User, messages: Object[] }) {
    const { auth } = usePage<SharedData>().props;
    console.log(`Chat():auth:friend:curUser:messages`, auth, friend, curUser, messages);
    const breadcrumbs = [
        { title: "Home", href: "/" },
        { title: "Live Chat", href: "#" }
    ];
    // const messages: Object[] = [
    //     { id: 1, text: "Hi Steve", sender_id: 1 },
    //     { id: 2, text: "Hi Battur", sender_id: 2 },
    //     { id: 3, text: "How are you", sender_id: 1 },
    //     { id: 4, text: "I am good, how are you", sender_id: 2 },
    //     { id: 5, text: "I am good, thanks", sender_id: 1 },
    //     { id: 6, text: "Question from Steve", sender_id: 2 },
    //     { id: 7, text: "Answer from Battur", sender_id: 1 }
    // ];
    const [allMessages, setAllMessages] = useState(messages);

    const sendMessage = (msg: string) => {
        console.log(`Chat():sendMessage():msg`, msg);
        router.post(route('messages.create', friend.id), { message: msg });
    }
    useEffect(() => {
        const channel = window.Echo.channel(`chat.${friend.id}`);
        console.log('useEffect:Chat:channel', channel);
        channel.listen("MessageSent", (newMessage: string) => {
            console.log(`useEffect:Chat:MessageSent event:`, newMessage);
            // setAllMessages((prevAllMessages) => [
            //     ...prevAllMessages,
            //     newMessage.newMessage,
            // ]);
        });
        return () => {
            channel.unsubscribe();
        };
    }, []);

    return (
        <ChatAppLayout breadcrumbs={breadcrumbs}>
            {auth.user && (
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <ChatContent curUser={curUser} friend={friend} messages={allMessages} sendMessage={sendMessage} />
                </div>
            )
            }
        </ChatAppLayout>
    );
}
