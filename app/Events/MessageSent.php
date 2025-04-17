<?php
 
namespace App\Events;
 
use App\Models\ChatMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
 
class MessageSent implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;
 
    /**
     * Create a new event instance.
     */
    public function __construct(public ChatMessage $message)
    {
    }
 
    public function broadcastWith()
    {
        return [
            'id' => $this->message->id,
            'sender_id' => $this->message->sender_id,
            'receiver_id' => $this->message->receiver_id,
            'text' => $this->message->text,
            'created_at' => $this->message->created_at,
            'updated_at' => $this->message->updated_at
        ];
    }

    public function broadcastQueue(): string
    {
        return 'default';
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // dump("channel: chat.{$this->userId}, message: {$this->message}");
        // return [
        //     new Channel("chat.{$this->userId}"),
        // ];
        return [
            new PrivateChannel("chat.{$this->message->receiver_id}"),
        ];

        // return [
        //     new PrivateChannel("chat.{$this->message->receiver_id}"),
        // ];
    }
}