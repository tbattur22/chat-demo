<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\MessageSent;
use App\Models\ChatMessage;

use function Laravel\Prompts\text;

class SendMessageCommand extends Command
{
    
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:message';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send message to the chat.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = text('user id to send to?', 'like 1,2,3 and etc');
        $message = text('What is your message?', "some message");
        // $message = new ChatMessage([1, 2, "Hey message"]);
        // $message = "Testing message 22";

        MessageSent::dispatch($userId, $message);
    }
}
