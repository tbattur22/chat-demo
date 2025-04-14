<?php
 
namespace App\Events;
 
use App\Models\ChatMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
 
class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;
 
    public $message;
    public $userId;
    /**
     * Create a new event instance.
     */
    public function __construct($userId, string $message)
    {
        $this->userId =  $userId;
        $this->message = $message;
    }
 
    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        dump("channel: chat.{$this->userId}, message: {$this->message}");
        return [
            new Channel("chat.{$this->userId}"),
        ];
        return [
            new PrivateChannel("chat.{$this->userId}"),
        ];

        // return [
        //     new PrivateChannel("chat.{$this->message->receiver_id}"),
        // ];
    }
}