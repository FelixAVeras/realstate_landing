(() => {
            const form = document.getElementById('contactForm');
            const button = document.getElementById('formSubmitButton');
            const toast = document.getElementById('formToast');
            const toastIcon = document.getElementById('formToastIcon');
            const toastText = document.getElementById('formToastText');

            let toastTimer;

            function showToast(message, isError = false) {
                window.clearTimeout(toastTimer);

                toastText.textContent = message;
                toastIcon.textContent = isError ? '!' : '✓';
                toast.classList.toggle('is-error', isError);
                toast.classList.add('is-visible');

                toastTimer = window.setTimeout(() => {
                    toast.classList.remove('is-visible');
                }, 5000);
            }

            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                if (!form.reportValidity()) return;

                const originalButtonText = button.textContent.trim();
                button.disabled = true;
                button.textContent = 'Enviando...';

                try {
                    const response = await fetch('send-email.php', {
                        method: 'POST',
                        body: new FormData(form),
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    const result = await response.json().catch(() => ({}));

                    if (!response.ok || !result.success) {
                        throw new Error(
                            result.message || 'No fue posible enviar tu solicitud. Inténtalo nuevamente.'
                        );
                    }

                    form.reset();
                    showToast('¡Formulario enviado exitosamente! Un asesor se pondrá en contacto contigo.');
                } catch (error) {
                    showToast(
                        error.message || 'Ocurrió un error al enviar el formulario. Inténtalo nuevamente.',
                        true
                    );
                } finally {
                    button.disabled = false;
                    button.textContent = originalButtonText;
                }
            });
        })();
