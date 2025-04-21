<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\ChatMessage;
use App\Models\User;
use App\Events\MessageSent;
use App\Http\Controllers\HomeController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
});

Route::get('/chat/{friend}', [HomeController::class, 'chat'])->middleware(['auth'])->name('chat');

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
        // ->with(['sender', 'receiver'])
        ->orderBy('id', 'asc')
        ->get();
})->middleware(['auth'])->name('messages.get');

Route::post('/messages/{friend}', function (User $friend) {
    // return ["one"=>1];

    $message = ChatMessage::create([
        'sender_id' => auth()->id(),
        'receiver_id' => $friend->id,
        'text' => request()->input('message')
    ]);
    Log::info("Message created and calling broadcast on MessageSent event, message: {$message}");
    broadcast(new MessageSent($message));
    // Route::redirect('chat', $friend->id);
    return $message;
})->name('messages.create');

Route::post('/messages/{sender}/markAllAsSeen', function (User $sender) {

    $res = ChatMessage::markAllMessagesNotSeenAsSeen($sender->id);
 
    return $res;
})->name('messages.markAllAsSeen');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
