console.log(`echo.js start running`);
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (!window.Pusher) {
    window.Pusher = Pusher;
}

if (!window.Echo) {
    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });
}

console.log(`echo.js end running: window.Echo`, window.Echo);