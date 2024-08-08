function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key;
}

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-table tbody'); // Use the correct container
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const authToken = localStorage.getItem('token'); // Use 'token' directly
    const loadingOverlay = document.getElementById('loading'); // Get the loading overlay element

    if (!authToken) {
        window.location.href = 'signup.html';
        console.log('No token found:', authToken);
        return;
    }

    const fetchCartItems = () => {
        const apiUrl = Api('carts');
        console.log('Fetching cart items from URL:', apiUrl);

        // Show the loading indicator
        loadingOverlay.style.display = 'flex';

        fetch(apiUrl, {
            headers: {
                'lang': 'en',
                'Content-Type': 'application/json',
                'Authorization': authToken,
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            if (data.status) {
                const cartItems = data.data.cart_items;
                displayCartItems(cartItems);
                updateCartTotals(cartItems);
            } else {
                console.error('Error fetching cart items:', data.message);
            }
        })
        .catch(error => console.error('Error fetching cart items:', error))
        .finally(() => {
            // Hide the loading indicator after data is loaded or an error occurs
            loadingOverlay.style.display = 'none';
        });
    };

    const displayCartItems = (items) => {
        cartItemsContainer.innerHTML = ''; // Clear existing rows

        items.forEach(item => {
            const tr = document.createElement('tr');

            const tdProduct = document.createElement('td');
            const divProductInfo = document.createElement('div');
            divProductInfo.classList.add('product-info');
            const img = document.createElement('img');
            img.src = item.product.image;
            img.alt = item.product.name;
            const h3 = document.createElement('h3');
            h3.classList.add('cart-title');
            h3.textContent = item.product.name;
            divProductInfo.appendChild(img);
            divProductInfo.appendChild(h3);
            tdProduct.appendChild(divProductInfo);

            const tdPrice = document.createElement('td');
            tdPrice.classList.add('price');
            tdPrice.textContent = `$${item.product.price.toFixed(2)}`;

            const tdQuantity = document.createElement('td');
            const selectQty = document.createElement('select');
            selectQty.classList.add('quantity');
            selectQty.name = 'quantity';
            for (let i = 1; i <= 10; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                if (i === item.quantity) {
                    option.selected = true;
                }
                selectQty.appendChild(option);
            }
            selectQty.addEventListener('change', (event) => {
                updateCartItemQuantity(item.id, event.target.value);
            });
            tdQuantity.appendChild(selectQty);

            const tdSubtotal = document.createElement('td');
            tdSubtotal.classList.add('subtotal');
            tdSubtotal.textContent = `$${(item.product.price * item.quantity).toFixed(2)}`;

            const tdAction = document.createElement('td');
            const clearIcon = document.createElement('i');
            clearIcon.classList.add('fa', 'fa-trash'); // FontAwesome trash icon
            clearIcon.style.cursor = 'pointer'; // Make the icon look clickable
            clearIcon.title = 'Remove item'; // Tooltip for the icon

            clearIcon.addEventListener('click', () => {
                removeCartItem(item.id);
            });

            tdAction.appendChild(clearIcon);

            tr.appendChild(tdProduct);
            tr.appendChild(tdPrice);
            tr.appendChild(tdQuantity);
            tr.appendChild(tdSubtotal);
            tr.appendChild(tdAction); // Add the action column

            cartItemsContainer.appendChild(tr);
        });
    };

    const updateCartTotals = (items) => {
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.product.price * item.quantity;
        });
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${subtotal.toFixed(2)}`;
    };

    const updateCartItemQuantity = (itemId, newQuantity) => {
        const apiUrl = Api(`carts/${itemId}`);
        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'lang': 'en',
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify({ quantity: newQuantity })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                fetchCartItems(); // Refresh cart items after update
            }
        })
        .catch(error => console.error('Error updating cart item quantity:', error));
    };

    const removeCartItem = (itemId) => {
        const apiUrl = Api(`carts/${itemId}`);
        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'lang': 'en',
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                console.log('Item removed from cart successfully');
                fetchCartItems(); // Refresh cart items after removal
            } else {
                console.error('Failed to remove item from cart:', data.message);
            }
        })
        .catch(error => console.error('Error removing item from cart:', error));
    };

    fetchCartItems();
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

// go to check out
 document.getElementById('checkout').addEventListener('click',()=>{
    window.location.href = 'check_out.html';


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
