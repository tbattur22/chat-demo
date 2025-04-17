import React, { useState, useEffect } from 'react'
import { type SharedData, User } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import ChatAppLayout from '@/layouts/chat-app-layout';
import ChatContent from './chatContent';
// import '../echo';

export default function Chat({ csrfToken, friend, curUser, messages }: { csrfToken: string, friend: User, curUser: User, messages: Object[] }) {
    const props = usePage<SharedData>().props;
    const auth = props.auth;
    console.log(`Chat():auth:friend:curUser:messages`, auth, friend, curUser, messages);
    const breadcrumbs = [
        { title: "Home", href: "/" },
        { title: "Live Chat", href: "#" }
    ];
    const [allMessages, setAllMessages] = useState(messages);

    const sendMessage = (msg: string) => {
        console.log(`Chat():SendMessage():msg`, msg);
        // router.post(route('messages.create', friend.id), { message: msg });
        const formData = { message: msg };
        const dataObj = new URLSearchParams(formData);
        console.log(`Chat:SendMessage:token`, csrfToken);
        console.log(`Chat:SendMessage:dataObj toString`, dataObj.toString());
        // formData.append("message", msg);
        const url = `${window.location.protocol}//${window.location.host}/messages/${friend.id}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN': csrfToken
            },
            body: dataObj.toString()
        };
        // console.log(`sendMessage():post request url`, url);
        // return false;
        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseData => {
                console.log('Chat:SendMessage:fetch success: calling chat endpoint', responseData);
                // router.visit(route('chat', friend.id));
                setAllMessages([
                    ...allMessages,
                    responseData
                ]);
            })
            .catch(error => {
                console.error('Chat:SendMessage:fetch Error:', error);
            });
    }

    useEffect(() => {
        const channel = window.Echo.private(`chat.${auth.user.id}`);
        console.log('Chat:useEffect:channel', channel);
        channel.listen("MessageSent", (data: Object) => {
            console.log(`Chat:useEffect:MessageSent event:`, data);
            if (data) {
                console.log(`Chat:useEffect:messages before updating`, [...allMessages]);
                setAllMessages([
                    ...allMessages,
                    data
                ]);
            }
        });
        return () => {
            console.log(`Chat:useEffect:unsubscribing from the channel`);
            channel.unsubscribe();
        };
    }, []);

    console.log(`Chat:before render: allMessages:`, allMessages);
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
