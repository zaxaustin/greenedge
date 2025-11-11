const form = document.getElementById('reservationForm');
const status = document.getElementById('reservationStatus');

if (form) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!status) return;

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    status.textContent = 'Sending your reservation...';

    try {
      const response = await fetch('/.netlify/functions/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const result = await response.json();
      status.textContent = result.message || 'Reservation received! A crew member will confirm within 24 hours.';
      form.reset();
    } catch (error) {
      console.error(error);
      status.textContent = 'We could not process your reservation right now. Please try again soon.';
    }
  });
}
