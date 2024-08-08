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
// menu settings
document.getElementById('menu').addEventListener('click', function(event) {
    event.preventDefault();
    var menu = document.getElementById('settingsMenu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
});
 // Close the menu if clicked outside of it
document.addEventListener('click', function(event) {
    var menu = document.getElementById('settingsMenu');
    var menuIcon = document.getElementById('menu');
    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.style.display = 'none';
    }
});
// navgate to settings profile
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for each settings item
    document.getElementById('profile_settings').addEventListener('click', function() {
        window.location.href ='profile_settings.html';
    });

    document.getElementById('orders').addEventListener('click', function() {
        window.location.href ='cart.html ';
    });

    document.getElementById('payment_methods').addEventListener('click', function() {
        window.location.href ='check_out.html ';
    });

    
});
// open dialog and make sign out

document.addEventListener('DOMContentLoaded', () => {
    const moreOptions = document.getElementById('logout');
    const dialog = document.getElementById('dialog');
    const logoutConfirm = document.getElementById('logoutConfirm');
    const logoutCancel = document.getElementById('logoutCancel');
    const snackbar = document.getElementById('snackbar');

    moreOptions.addEventListener('click', (e) => {
        e.preventDefault();
        dialog.classList.add('show'); // Show the dialog
    });

    logoutCancel.addEventListener('click', () => {
        dialog.classList.remove('show'); // Hide the dialog
    });

    logoutConfirm.addEventListener('click', () => {
        dialog.classList.remove('show'); // Hide the dialog
        localStorage.removeItem('token');
        window.location.href = 'index.html';
        showSnackbar();
    });

    function showSnackbar() {
        snackbar.classList.add('show');
        setTimeout(() => {
            snackbar.classList.remove('show');
        }, 3000); // Hide after 3 seconds
    }
});
