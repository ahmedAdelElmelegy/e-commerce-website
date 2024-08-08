
function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key;
}

document.addEventListener("DOMContentLoaded", function () {
    fetchContactInfo();
});

function fetchContactInfo() {
    // Local CORS proxy
    const apiUrl = Api('contacts');

    fetch(apiUrl, {
        headers: {
            'lang': 'en',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const contacts = data.data.data;

            const contactElement = document.getElementById('contact');
            const locationElement = document.getElementById('location');
            const socialLinksElement = document.getElementById('social-links');

            contacts.forEach(contact => {
                if (contact.type === 2) {
                    // Email
                    contactElement.innerHTML = `Contact: <a href="mailto:${contact.value}">${contact.value}</a>`;
                } else if (contact.type === 1) {
                    // Phone
                    locationElement.innerHTML = `Phone: <a href="tel:${contact.value}">${contact.value}</a>`;
                } else if (contact.type === 3) {
                    // Social links
                    const socialLink = document.createElement('a');
                    socialLink.href = contact.value;
                    socialLink.target = "_blank";
                    socialLink.innerHTML = `<img src="${contact.image}" alt="${contact.value}">`;
                    socialLinksElement.appendChild(socialLink);
                }
            });
        })
        .catch(error => console.error("Error fetching contact info:", error));
}


document.addEventListener('DOMContentLoaded', () => {
   
    const authToken = localStorage.getItem('token');

    const signUpLink = document.querySelector('#navbar a.changeIcon');

    if (authToken) {
        signUpLink.innerHTML = '<img src="img/download.png" alt="User" class="profile-image">';
        signUpLink.classList.remove('changeIcon');
        signUpLink.classList.add('profile-link');
    }
});
