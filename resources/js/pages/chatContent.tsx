import React, { SyntheticEvent, useEffect, useState } from 'react'
import { type SharedData, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import ChatContentMsgContainer from '@/pages/chatContentMsgContainer';

export default function ChatContent({ curUser, friend, messages, sendMessage }: { curUser: User, friend: User, messages: Object[], sendMessage: (msg: string) => void }) {
    const { auth } = usePage<SharedData>().props;
    const [typingMsg, setTypingMsg] = useState('');

    const onTyping = (e: SyntheticEvent) => {
        setTypingMsg(e.target.value);
    }
    const handleSendMessage = () => {
        sendMessage(typingMsg);
        setTypingMsg('');
    }
    useEffect(() => {
        const ele = document.querySelector('div.msg-container');
        ele?.scrollTo(0, ele?.scrollHeight);
    }, [messages]);

    return (
        <div className='flex flex-col justify-end'>
            <div className='mb-16'>{friend.name}</div>
            <div className='flex flex-col justify-end w-full max-h-80'>
                <div data-ref="messagesContainer"
                    className="msg-container w-full p-4 overflow-y-auto
                    ">
                    {messages?.map((msg, i) => {
                        return <ChatContentMsgContainer key={msg.id} msg={msg} />
                    })}
                </div>
            </div>
            <div className="flex items-center">
                <input
                    type="text"
                    value={typingMsg}
                    onChange={onTyping}
                    // @keydown="sendTypingEvent"
                    // @keyup.enter="sendMessage"
                    placeholder="Type a message..."
                    className="flex-1 px-2 py-1 border rounded-lg"
                />
                <button onClick={handleSendMessage}
                    // @click="sendMessage"
                    className="px-4 py-1 ml-2 text-white bg-blue-500 rounded-lg"
                >
                    Send
                </button>
            </div>
            {/* <small v-if="isFriendTyping" className="text-gray-700">
            {{ friend.name }} is typing...
            </small> */}
        </div>
    )
}
