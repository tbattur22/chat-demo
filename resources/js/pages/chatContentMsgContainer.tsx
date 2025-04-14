import { type SharedData, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ChatContentMsgContainer({ msg }: { msg: Object }) {
    const { auth } = usePage<SharedData>().props;
    // console.log(`ChatContentMsgContainer():auth:msg`, auth, msg);

    return (
        <div className="flex items-center mb-2">
            {
                msg?.sender_id === auth.user.id ?
                    <div className="p-2 ml-auto text-white bg-blue-500 rounded-lg" >
                        {msg.text}
                    </div>
                    :
                    <div className="p-2 mr-auto bg-gray-200 rounded-lg">
                        {msg.text}
                    </div>
            }
        </div>
    );
}
