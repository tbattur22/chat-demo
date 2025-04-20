<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('home', [
            "users" => User::whereNot('id', auth()->id())->get(),
            'messagesNotSeen' => ChatMessage::getMessagesNotSeen()
        ]);
    }

    public function chat(Request $request, User $friend)
    {
        Log::info('HomeController:chat():friend id:'.$friend->id);
        ChatMessage::markAllMessagesNotSeenAsSeen($friend->id);

        return Inertia::render('chat', [
            'csrfToken' => csrf_token(),
            'friend' => $friend,
            'curUser' => Auth()->user(),
            'messages' => ChatMessage::query()
            ->where(function ($query) use ($friend) {
                $query->where('sender_id', auth()->id())
                    ->where('receiver_id', $friend->id);
            })
            ->orWhere(function ($query) use ($friend) {
                $query->where('sender_id', $friend->id)
                    ->where('receiver_id', auth()->id());
            })
            // ->with(['sender', 'receiver'])
            ->orderBy('id', 'asc')
            ->get()
        ]);    
    }
}