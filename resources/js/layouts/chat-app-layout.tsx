import type { PropsWithChildren, ReactNode } from 'react';
import { type SharedData, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Breadcrumbs } from '@/components/breadcrumbs';
import TextLink from '@/components/text-link';

export default function ChatAppLayout({ breadcrumbs, children }: { breadcrumbs: BreadcrumbItemType[], children: ReactNode }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Live Chat Demo">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen h-screen mx-auto flex-col max-w-4xl items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:p-8 dark:bg-[#0a0a0a]">
                <div className="w-full h-20">
                    {auth.user && (
                        <div className="flex m-4 p-4 justify-between gap-4">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                            <div className='flex gap-2'>
                                <div className='px-4 font-medium'>{auth.user.name}</div>
                                <TextLink href={route('logout')} method="post" className="block text-sm no-underline cursor-pointer font-medium">
                                    Log out
                                </TextLink>
                            </div>
                        </div>
                    )}
                </div>
                <div className='w-full'>{children}</div>
            </div>
        </>
    );
}
