const API_URL = 'http://localhost:8080/https://student.valuxapps.com/api/';

function getAuthToken() {
    if(localStorage.getItem('token')==null){
     return   window.location.href ='signup.html ';

    }
    return localStorage.getItem('token');
}

function Api(key) {
    const token = getAuthToken();
    return {
        url: `${API_URL}${key}`,
        headers: {
            'Authorization': token, // Adjust token format as needed
            'Content-Type': 'application/json'
        }
    };
}

// Fetch existing profile data on page load
document.addEventListener('DOMContentLoaded', function() {
    fetch(Api('profile').url, {
        method: 'GET',
        headers: Api('profile').headers
    })
    .then(response => response.json())
    .then(data => {
        if (data.data) {
            document.getElementById('profilePic').src=data.data.image;
            document.getElementById('userEmail').textContent=data.data.email;
            document.getElementById('userName').textContent=data.data.name;
            document.getElementById('userPhone').textContent=data.data.phone;
            document.getElementById('inputEmail').value = data.data.email || '';
            document.getElementById('inputName').value = data.data.name || '';
            document.getElementById('inputPhone').value = data.data.phone || '';
            window.existingEmail = data.data.email || '';
        } else {
            console.error('No data found:', data);
        }
    })
    .catch(error => console.error('Error fetching profile data:', error));
});

function updateProfile() {
const name = document.getElementById('inputName').value.trim();
const phone = document.getElementById('inputPhone').value.trim();
const email = document.getElementById('inputEmail').value.trim(); 

const updatedData = {
email: email, // Ensure email is included
...(name && { name: name }),
...(phone && { phone: phone })
};

if (Object.keys(updatedData).length === 1) { // Only email was included
document.getElementById('message').textContent = 'No changes detected.';
document.getElementById('message').style.color = 'red';
return;
}

console.log('Sending data:', updatedData);

fetch(Api('update-profile').url, {
method: 'PUT',
headers: Api('update-profile').headers,
body: JSON.stringify(updatedData),
})
.then(response => {
if (!response.ok) {
    return response.json().then(errorData => {
        throw new Error(`Error: ${errorData.message}`);
    });
}
return response.json();
})
.then(data => {
if (data.status === false) {
    document.getElementById('message').textContent = `Update failed: ${data.message}`;
    document.getElementById('message').style.color = 'red';
} else {
    document.getElementById('message').textContent = 'Profile updated successfully!';
    document.getElementById('message').style.color = 'green';

    // Update the UI with the new data
    document.getElementById('userName').textContent = name || document.getElementById('userName').textContent;
    document.getElementById('userEmail').textContent = email;
    document.getElementById('userPhone').textContent = phone || document.getElementById('userPhone').textContent;
}
})
.catch(error => {
document.getElementById('message').textContent = `An error occurred: ${error.message}`;
document.getElementById('message').style.color = 'red';
});
}












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
