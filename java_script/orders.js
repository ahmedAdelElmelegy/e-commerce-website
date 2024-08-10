



document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryContainer = document.querySelector('#order-summary tbody');
    const subtotalElement = document.getElementById('order-subtotal');
    const totalElement = document.getElementById('order-total');
    const paymentMethodElement = document.getElementById('payment-method');
    const authToken = localStorage.getItem('token'); // Assuming token is used for authentication

    if (!authToken) {
        console.error('No authentication token found.');
        return;
    }

    // Define the API endpoint
    const apiUrl = 'http://localhost:8080/https://student.valuxapps.com/api/carts';

    // Fetch cart items from the API
    const fetchCartItems = () => {
        fetch(apiUrl, {
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
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
                const cartSummary = generateCartSummary(cartItems);
                displayOrderItems(cartSummary.items);
                updateOrderSummary(cartSummary);
            } else {
                console.error('Error fetching cart items:', data.message);
            }
        })
        .catch(error => console.error('Error fetching cart items:', error));
    };

    
    const generateCartSummary = (items) => {
        let cartSummary = '';
        let subtotal = 0;
        let total = 0;

        items.forEach(item => {
            const rowSubtotal = item.product.price * item.quantity;
            subtotal += item.product.price;
            total += rowSubtotal;

            cartSummary += `
                <tr>
               <td> <img src="${item.product.image}" alt=""><td>
                    <td>${item.product.name}</td>
                    <td>$${item.product.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>$${rowSubtotal.toFixed(2)}</td>
                </tr>
            `;
        });

        return {
            items: cartSummary,
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2)
        };
    };
    // Display order items in the table
    const displayOrderItems = (summary) => {
        orderSummaryContainer.innerHTML = summary; // Insert cart items HTML
    };

    // Update order totals and payment method
    const updateOrderSummary = (details) => {
        if (subtotalElement) {
            subtotalElement.textContent = `$${details.subtotal}`;
        }
        if (totalElement) {
            totalElement.textContent = `$${details.total}`;
        }
        const orderDetails = JSON.parse(localStorage.getItem('orderSummary'));

        if (paymentMethodElement) {
            if (orderDetails && orderDetails.paymentMethod) {
                paymentMethodElement.innerHTML = `
                    <p><strong>Card Number:</strong> ${orderDetails.paymentMethod.cardNumber}</p>
                    <p><strong>Expiry Date:</strong> ${orderDetails.paymentMethod.expiryDate}</p>
                    <p><strong>CVV:</strong> ${orderDetails.paymentMethod.cvv}</p>
                `;
            } else {
                paymentMethodElement.textContent = 'PayPal';
            }
        }
    };

    fetchCartItems(); // Fetch and display cart items
});
