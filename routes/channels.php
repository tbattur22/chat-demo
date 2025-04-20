<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('chat.{id}', function ($user, $id) {
    Log::info("broadcast to chat.{$id}. cur listening user id: {$user->id}");
    return (int) $user->id === (int) $id;
});

Broadcast::channel('home.chat.{id}', function ($user, $id) {
    Log::info("broadcast to home.chat.{$id}. cur listening user id: {$user->id}");
    return (int) $user->id === (int) $id;
});
