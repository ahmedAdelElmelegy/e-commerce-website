
function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key;
}

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('#cart-items tbody');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const authToken = localStorage.getItem('token');
    const loadingOverlay = document.getElementById('loading');

    if (!authToken) {
        window.location.href = 'signup.html';
        console.log('No token found:', authToken);
        return;
    }

    // Fetch cart items
    const fetchCartItems = () => {
        const apiUrl = Api('carts');
        console.log('Fetching cart items from URL:', apiUrl);

        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }

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
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        });
    };

    // Display cart items
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
            clearIcon.classList.add('fa', 'fa-trash');
            clearIcon.style.cursor = 'pointer';
            clearIcon.title = 'Remove item';

            clearIcon.addEventListener('click', () => {
                removeCartItem(item.id);
            });

            tdAction.appendChild(clearIcon);

            tr.appendChild(tdProduct);
            tr.appendChild(tdPrice);
            tr.appendChild(tdQuantity);
            tr.appendChild(tdSubtotal);
            tr.appendChild(tdAction);

            cartItemsContainer.appendChild(tr);
        });
    };

    // Update cart totals
    const updateCartTotals = (items) => {
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.product.price * item.quantity;
        });
        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }
        if (totalElement) {
            totalElement.textContent = `$${subtotal.toFixed(2)}`;
        }
    };

    // Update cart item quantity
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

    // Remove cart item
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
                fetchCartItems(); // Refresh cart items after removal
            }
        })
        .catch(error => console.error('Error removing cart item:', error));
    };

    // Handle form submission
    const placeOrderButton = document.getElementById('place-order-button');
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', () => {
            const formData = new FormData(document.getElementById('checkout-form'));
            const orderDetails = Object.fromEntries(formData.entries());
            orderDetails.cart_items = Array.from(document.querySelectorAll('#cart-items tbody tr')).map(row => {
                const product = row.querySelector('.product-info h3').textContent;
                const price = parseFloat(row.querySelector('.price').textContent.replace('$', ''));
                const quantity = parseInt(row.querySelector('.quantity').value);
                const total = parseFloat(row.querySelector('.subtotal').textContent.replace('$', ''));
                return { product, price, quantity, total };
            });

            console.log('Order Details:', orderDetails);

            // Submit order
            fetch(Api('orders'), {
                method: 'POST',
                headers: {
                    'lang': 'en',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(orderDetails)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    alert('Order placed successfully!');
                    window.location.href = 'index.html';
                } else {
                    alert('Failed to place order: ' + data.message);
                }
            })
            .catch(error => console.error('Error placing order:', error));
        });
    } else {
        console.error('Place Order button not found');
    }

    fetchCartItems(); 



    document.addEventListener('DOMContentLoaded', () => {
   
        const authToken = localStorage.getItem('token');
    
        const signUpLink = document.querySelector('#navbar a.changeIcon');
    
        if (authToken) {
            signUpLink.innerHTML = '<img src="img/download.png" alt="User" class="profile-image">';
            signUpLink.classList.remove('changeIcon');
            signUpLink.classList.add('profile-link');
        }
    });
});


// if user login or not
document.addEventListener('DOMContentLoaded', () => {
   
    const authToken = localStorage.getItem('token');

    const signUpLink = document.querySelector('#navbar a.changeIcon');

    if (authToken) {
        signUpLink.innerHTML = '<img src="img/download.png" alt="User" class="profile-image">';
        signUpLink.classList.remove('changeIcon');
        signUpLink.classList.add('profile-link');
    }
});