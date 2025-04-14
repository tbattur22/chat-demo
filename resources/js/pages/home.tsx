import { type SharedData, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { UserInfo } from '@/components/user-info';
import ChatContent from './chatContent';
import ChatAppLayout from '@/layouts/chat-app-layout';

export default function Home({ users }: { users: User[] }) {
    const { auth } = usePage<SharedData>().props;
    console.log(`Home():auth:users`, auth, users);
    const breadcrumbs = [
        { title: "Home", href: "/" }
    ];

    return (
        <ChatAppLayout breadcrumbs={breadcrumbs}>
            {auth.user && (
                <div className='grid grid-cols-(--grid-auto) gap-2 m-4 p-4'>
                    {users?.map((user) => {
                        return <UserInfo key={user.id} user={user} showEmail={true} />;
                    })}
                </div>
            )
            }
        </ChatAppLayout>
    );
}
