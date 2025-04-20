import { useState, useEffect } from 'react'
import { MessageSent, type SharedData, User } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import ChatAppLayout from '@/layouts/chat-app-layout';
import ChatContent from './chatContent';
import { SendMessage, MarkAllMessagesAsSeen } from '@/services/model/ChatMessage';
import '../echo';

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
        SendMessage(csrfToken, friend.id, msg, allMessages, setAllMessages)
            .then((res) => {
                console.log(`Chat:sendMessage():res`, res);
            });
    }

    useEffect(() => {
        const channel = window.Echo.private(`chat.${auth.user.id}`);
        console.log('Chat:useEffect:channel', channel);
        // MarkAllMessagesAsSeen(csrfToken, friend);
        channel.listen("MessageSent", (data: MessageSent) => {
            console.log(`Chat:useEffect:MessageSent event:`, data);
            console.log(`Chat:useEffect:messages before updating`, [...allMessages]);
            setAllMessages([
                ...allMessages,
                data
            ]);
            MarkAllMessagesAsSeen(csrfToken, friend);
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
