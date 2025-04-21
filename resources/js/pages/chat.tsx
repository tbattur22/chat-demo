import { useState, useEffect } from 'react'
import { MessageSent, type SharedData, User } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import ChatAppLayout from '@/layouts/chat-app-layout';
import ChatContent from './chatContent';
import { SendMessage, MarkAllMessagesAsSeen } from '@/services/model/ChatMessage';
import echo from '../echo';

export default function Chat({ csrfToken, friend, curUser, messages }: { csrfToken: string, friend: User, curUser: User, messages: MessageSent[] }) {
    const props = usePage<SharedData>().props;
    const auth = props.auth;
    // console.log(`Chat():auth:friend:curUser:messages`, auth, friend, curUser, messages);
    const breadcrumbs = [
        { title: "Home", href: "/" },
        { title: "Live Chat", href: "#" }
    ];
    const [allMessages, setAllMessages] = useState(messages);

    const sendMessage = (msg: string) => {
        SendMessage(csrfToken, friend.id, msg, allMessages, setAllMessages)
            .then((res) => {
                console.log(`Chat:sendMessage():res`, res);
            });
    }

    useEffect(() => {
        const channel = echo.private(`chat.${auth.user.id}`);
        channel.listen("MessageSent", (data: MessageSent) => {
            setAllMessages(prevState => {
                return [...prevState, data];
            });
            MarkAllMessagesAsSeen(csrfToken, friend);
        });
        return () => {
            channel.stopListening('MessageSent');
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
