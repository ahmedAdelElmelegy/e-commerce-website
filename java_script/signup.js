function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key;
}


document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('signup-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const payload = {
            name: name,
            phone: phone,
            email: email,
            password: password
        };

        // Local CORS proxy
       ;

        fetch(Api('register'), {
            method: 'POST',
            headers: {
                 'lang':'en',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                alert('Signup successful!');
                form.reset(); // Reset the form
            } else {
                alert('Signup failed: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Signup failed: ' + error.message);
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

// open dialog and make sign up
