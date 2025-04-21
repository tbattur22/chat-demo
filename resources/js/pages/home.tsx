import { useEffect, useState } from 'react';
import { type SharedData, User, HomeMsgsNotSeen, MessageSent } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { UserInfo } from '@/components/user-info';
import ChatAppLayout from '@/layouts/chat-app-layout';
import echo from '../echo';

export default function Home({ users, messagesNotSeen }: { users: User[], messagesNotSeen: HomeMsgsNotSeen }) {
    const [homeMsgsNotSeen, setHomeMsgsNotSeen] = useState(messagesNotSeen);
    const { auth } = usePage<SharedData>().props;
    console.log(`Home():auth:users,messagesNotSeen:homeMsgsNotSeen`, auth, users, messagesNotSeen, homeMsgsNotSeen);
    const breadcrumbs = [
        { title: "Home", href: "/" }
    ];
    const calcMsgsNotSeen = (data: MessageSent) => {
        setHomeMsgsNotSeen(prevState => {
            if (prevState[data.sender_id]) {
                return { ...prevState, [data.sender_id]: prevState[data.sender_id] + 1 };
            } else {
                return { ...prevState, [data.sender_id]: 1 };
            }
        });
    }

    useEffect(() => {
        const channel = echo.private(`home.chat.${auth.user.id}`);
        channel.listen("MessageSent", (data: MessageSent) => {
            calcMsgsNotSeen(data);
        });

        return () => {
            channel.stopListening("MessageSent");
        };
    }, []);

    return (
        <ChatAppLayout breadcrumbs={breadcrumbs}>
            {auth.user && (
                <div className='grid grid-cols-(--grid-auto) gap-2 m-4 p-4'>
                    {users?.map((user) => {
                        return <UserInfo key={user.id} user={user} showEmail={true} notSeenNumbers={homeMsgsNotSeen[user.id] ?? null} />;
                    })}
                </div>
            )
            }
        </ChatAppLayout>
    );
}
