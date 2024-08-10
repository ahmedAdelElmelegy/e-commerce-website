
document.addEventListener('DOMContentLoaded', () => {
   
    const authToken = localStorage.getItem('token');

    const signUpLink = document.querySelector('#navbar a.changeIcon');

    if (authToken) {
        signUpLink.innerHTML = '<img src="img/download.png" alt="User" class="profile-image">';
        signUpLink.classList.remove('changeIcon');
        signUpLink.classList.add('profile-link');
    }
});
// menu open
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
// navgate to settings menu 
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
