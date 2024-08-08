// Helper function for API URL
function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key; // Correct API URL
}

document.getElementById('change-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    const data = {  
        current_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
    };
    
    try {
        const response = await fetch(Api('change-password'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token, // Correctly format the token
                'lang': 'en', // Ensure lang is a string
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (result.status) {
            alert('Password changed successfully');
            document.getElementById('change-password-form').reset();
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while changing the password');
    }
});
