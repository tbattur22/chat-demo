import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();

    return (
        <div className="flex flex-col text-center text-sm w-sm m-2 p-2">
            <span className="truncate font-medium">{user.name}</span>
            {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
            <Link href={route('chat', user.id)}>Click here to chat</Link>
        </div>
    );
}
