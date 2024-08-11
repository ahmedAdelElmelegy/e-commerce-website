function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key; // Correct API URL
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
       // get email value from input
        const email = document.getElementById('email').value;
        // get password value from input

        const password = document.getElementById('password').value;

        const payload = {
            // email
            email: email,
            // password
            password: password
        };

        fetch(Api('login'), {
            method: 'POST',
            headers: {
                'lang': 'en',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }) 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data); // Log the response to verify its structure
// status true?store token go to home:error
            if (data.status) {
                const token = data.data.token;
                console.log('Token:', token);

                // Save the token to localStorage
                localStorage.setItem('token', token);
                form.reset();
                window.location.href = 'index.html';

               
            } else {
                alert('Login failed: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if(error.message=='Login failed: This credentials does not meet any of our records, please make sure you have entered the right credentials'){
                alert('password is wrong')
            }
        });
    });
});
// check login or not


document.addEventListener('DOMContentLoaded', () => {
   
    const authToken = localStorage.getItem('token');

    const signUpLink = document.querySelector('#navbar a.changeIcon');

    if (authToken) {
        signUpLink.innerHTML = '<img src="img/download.png" alt="User" class="profile-image">';
        signUpLink.classList.remove('changeIcon');
        signUpLink.classList.add('profile-link');
    }
});



