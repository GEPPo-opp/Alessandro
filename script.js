document.addEventListener('DOMContentLoaded', (event) => {
    const startSpy = document.getElementById('startSpy');

    startSpy.addEventListener('click', async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('service-worker.js', { scope: './' });
                console.log('Registrazione ServiceWorker avvenuta con successo con scope: ', registration.scope);
                if (registration.active) {
                    registration.active.postMessage({ action: 'startSpying' });
                } else {
                    registration.waiting.postMessage({ action: 'startSpying' });
                }
            } catch (error) {
                console.log('Registrazione ServiceWorker fallita: ', error);
            }
        } else {
            console.log('I service workers non sono supportati.');
        }
    });
});
