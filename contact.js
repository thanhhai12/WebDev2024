document.querySelector('.contact-left').addEventListener('submit', async function (event) {
    event.preventDefault(); 

    const form = event.target;
    const formData = new FormData(form); 

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.location.href = 'thankyou.html'; 
        } else {
            const errorData = await response.json();
            console.error('Error from API:', errorData);
            alert('There was an error submitting the form. Please try again.');
        }
    } catch (error) {
        console.error('Network or connection error:', error);
        alert('An error occurred. Please check your connection and try again.');
    }
});