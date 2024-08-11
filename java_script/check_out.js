// helper
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

    // Update cart totals price
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
   

   
    fetchCartItems(); 






  
});
// replace data to order

document.addEventListener('DOMContentLoaded', function () {
    const paymentMethodSelect = document.getElementById('payment-method');
    const dashboardPayment = document.getElementById('dashboard-payment');
    const placeOrderButton = document.getElementById('place-order-button');
    const submitPaymentButton = document.getElementById('submit-payment');
    const orderConfirmation = document.getElementById('order-confirmation');
    const orderDetails = document.getElementById('order-details');

    // Hide the DashboardPayment by default
    dashboardPayment.classList.remove('show');

    // Show DashboardPayment if "Credit Card" is selected
    paymentMethodSelect.addEventListener('change', function () {
        if (paymentMethodSelect.value === 'credit_card') {
            dashboardPayment.classList.add('show');
        } else {
            dashboardPayment.classList.remove('show');
        }
    });

    // Handle place order button click
    placeOrderButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission

        const paymentMethod = paymentMethodSelect.value;

        if (paymentMethod === 'credit_card') {
            // Display the DashboardPayment
            dashboardPayment.classList.add('show');
        } else if (paymentMethod === 'paypal') {
            // Handle PayPal payment method
            orderConfirmation.style.display = 'block';
            orderDetails.innerHTML = `
                <p><strong>Payment Method:</strong> PayPal</p>
                <p>Your PayPal account will be charged.</p>
            `;
        } else {
            alert('Please select a payment method.');
        }
    });

    // Handle submit payment button click
    submitPaymentButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission

        const cardNumber = document.getElementById('card-number').value || '**** **** **** 1234';
        const expiryDate = document.getElementById('expiry-date').value || '12/24';
        const cvv = document.getElementById('cvv').value || '***';

        // Save payment details to local storage
        localStorage.setItem('paymentDetails', JSON.stringify({
            cardNumber: cardNumber,
            expiryDate: expiryDate,
            cvv: cvv
        }));

        // Display order confirmation
        orderConfirmation.style.display = 'block';
        orderDetails.innerHTML = `
            <p><strong>Payment Method:</strong> Credit Card</p>
            <p><strong>Card Number:</strong> ${cardNumber}</p>
            <p><strong>Expiry Date:</strong> ${expiryDate}</p>
            <p><strong>CVV:</strong> ${cvv}</p>
        `;

        // Optionally, you could hide the dashboard payment form
        dashboardPayment.classList.remove('show');
    });
});
// save orders

// open a new window placed payment method to orders
document.addEventListener('DOMContentLoaded', function () {
    const paymentMethodSelect = document.getElementById('payment-method');
    const dashboardPayment = document.getElementById('dashboard-payment');
    const placeOrderButton = document.getElementById('place-order-button');
    const orderConfirmation = document.getElementById('order-confirmation');
    const orderDetails = document.getElementById('order-details');

    // Hide the DashboardPayment by default
    dashboardPayment.classList.remove('show');

    // Show DashboardPayment if "Credit Card" is selected
    paymentMethodSelect.addEventListener('change', function () {
        if (paymentMethodSelect.value === 'credit_card') {
            dashboardPayment.classList.add('show');
        } else {
            dashboardPayment.classList.remove('show');
        }
    });

    // Handle place order button click
    placeOrderButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission

        const paymentMethod = paymentMethodSelect.value;
        const cartItems = document.querySelectorAll('#cart-items tbody tr');
        let cartSummary = '';
        let subtotal = 0;
        let total = 0;

        // Build the cart summary
        cartItems.forEach(row => {
            const product = row.cells[0].textContent;
            const price = parseFloat(row.cells[1].textContent.replace('$', ''));
            const quantity = parseInt(row.cells[2].textContent);
            const rowTotal = price * quantity;

            subtotal += price;
            total += rowTotal;

            cartSummary += `
                <tr>
                    <td>${product}</td>
                    <td>$${price.toFixed(2)}</td>
                    <td>${quantity}</td>
                    <td>$${rowTotal.toFixed(2)}</td>
                </tr>
            `;
        });

        subtotal = subtotal.toFixed(2);
        total = total.toFixed(2);

        // Save order details to localStorage
        localStorage.setItem('orderSummary', JSON.stringify({
            cartSummary: cartSummary,
            subtotal: subtotal,
            total: total,
            paymentMethod: paymentMethod === 'credit_card' ? {
                cardNumber: document.getElementById('card-number').value || '**** **** **** 1234',
                expiryDate: document.getElementById('expiry-date').value || '12/24',
                cvv: document.getElementById('cvv').value || '***'
            } : null
        }));

        // Open the new window with order details
        window.open('orders.html', '_blank');
    });
});



// change image if user login


  document.addEventListener('DOMContentLoaded', () => {
   
        const authToken = localStorage.getItem('token');
    
        const signUpLink = document.querySelector('#navbar a.changeIcon');
    
        if (authToken) {
            signUpLink.innerHTML = '<img src="img/download.png" alt="User" class="profile-image">';
            signUpLink.classList.remove('changeIcon');
            signUpLink.classList.add('profile-link');
        }
    });