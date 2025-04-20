import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { spawn } from 'child_process';

export function UserInfo({ user, showEmail = false, notSeenNumbers }: { user: User; showEmail?: boolean, notSeenNumbers: number }) {
    // const getInitials = useInitials();

    return (
        <div className="flex flex-col text-center text-sm w-sm m-2 p-2">
            <span className="truncate font-medium">{user.name}</span>
            {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
            {notSeenNumbers && <span className='text-red-400'>{notSeenNumbers} new messages.</span>}
            <Link href={route('chat', user.id)} className='mt-2'>
                <button type="button" className="focus:outline-none cursor-pointer text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Open Chat</button>
            </Link>
        </div>
    );
}
