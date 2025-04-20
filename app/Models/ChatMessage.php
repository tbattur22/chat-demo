<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'text'
    ];

    public static function getMessagesNotSeen()
    {
        $notSeenMsgNumMap = [];
        $messagesNotSeen = ChatMessage::query()
        ->where(function ($query) {
            $query->where('receiver_id', auth()->id())
                ->where('seen_at', null);
        })
        ->orderBy('id', 'asc')
        ->get();

        foreach ($messagesNotSeen as $msg) {
            if (!isset($notSeenMsgNumMap[$msg->sender_id])) {
                $notSeenMsgNumMap[$msg->sender_id] = 1;
            } else {
                $notSeenMsgNumMap[$msg->sender_id] += 1;
            }
        }
        return $notSeenMsgNumMap;
    }

    public static function markAllMessagesNotSeenAsSeen(int $senderId)
    {
        return ChatMessage::where('receiver_id', auth()->id())
        ->where('sender_id', $senderId)->where('seen_at', null)->update(['seen_at' => date('Y-m-d H:m:s')]);
    }
 
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
 
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
