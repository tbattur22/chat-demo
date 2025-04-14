<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\ChatMessage;
use App\Models\User;
use App\Events\MessageSent;

// Route::get('/', function () {
//     return Inertia::render('home');
// })->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('home', [
            "users" => User::whereNot('id', auth()->id())->get()
        ]);
    })->name('home');
});

Route::get('/chat/{friend}', function (User $friend) {
    return Inertia::render('chat', [
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
        ->with(['sender', 'receiver'])
        ->orderBy('id', 'asc')
        ->get()
    ]);
})->middleware(['auth'])->name('chat');

Route::get('/messages/{friend}', function (User $friend) {
    return ChatMessage::query()
        ->where(function ($query) use ($friend) {
            $query->where('sender_id', auth()->id())
                ->where('receiver_id', $friend->id);
        })
        ->orWhere(function ($query) use ($friend) {
            $query->where('sender_id', $friend->id)
                ->where('receiver_id', auth()->id());
        })
        ->with(['sender', 'receiver'])
        ->orderBy('id', 'asc')
        ->get();
})->middleware(['auth'])->name('messages.get');

Route::post('/messages/{friend}', function (User $friend) {
    $message = ChatMessage::create([
        'sender_id' => auth()->id(),
        'receiver_id' => $friend->id,
        'text' => request()->input('message')
    ]);
 
    broadcast(new MessageSent($message));
    Route::redirect('chat', $friend->id);
    // return Inertia::render('chat', [
    //     'friend' => $friend,
    //     'curUser' => Auth()->user(),
    //     'messages' => ChatMessage::query()
    //     ->where(function ($query) use ($friend) {
    //         $query->where('sender_id', auth()->id())
    //             ->where('receiver_id', $friend->id);
    //     })
    //     ->orWhere(function ($query) use ($friend) {
    //         $query->where('sender_id', $friend->id)
    //             ->where('receiver_id', auth()->id());
    //     })
    //     ->with(['sender', 'receiver'])
    //     ->orderBy('id', 'asc')
    //     ->get()
    // ]);
})->name('messages.create');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
