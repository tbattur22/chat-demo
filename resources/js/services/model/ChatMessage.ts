import { Dispatch, SetStateAction } from "react";
import { type SharedData, User, MessageSent } from '@/types';

export async function SendMessage(csrfToken: string, friendId: number, msg: string, messages: MessageSent[], cb: Dispatch<SetStateAction<MessageSent[]>>) {
    const formData = { message: msg };
    const dataObj = new URLSearchParams(formData);
    console.log(`Chat:SendMessage:token`, csrfToken);
    console.log(`Chat:SendMessage:dataObj toString`, dataObj.toString());
    // formData.append("message", msg);
    // const url = `${window.location.protocol}//${window.location.host}/messages/${friend.id}`;
    const url = route('messages.create', friendId);
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
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const jsonData = await res.json();
        cb([
            ...messages,
            jsonData
        ]);
        return true;
    } catch (ex) {
        throw ex;
    }
}

export async function MarkAllMessagesAsSeen(csrfToken: string, sender: User) {
    const url = route('messages.markAllAsSeen', sender.id);
    console.log(`MarkAllMessagesAsSeen():friend.id`, sender.id);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-TOKEN': csrfToken
        }
    };
    // console.log(`sendMessage():post request url`, url);
    // return false;
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    } catch (ex) {
        throw ex;
    }
}