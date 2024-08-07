
function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key;
}





document.addEventListener('DOMContentLoaded', () => {
    const productId = localStorage.getItem('selectedProductId');
    const loadingIndicator = document.getElementById('loading');

    if (productId) {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }

        // Fetch product details
        fetch(Api(`products/${productId}`), {
            headers: {
                'lang': 'en',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const product = data.data;
            if (product) {
                // Update the UI with product details
                document.getElementById('MainImg').src = product.image;
                document.getElementById('product-title').textContent = product.name;
                document.getElementById('discountnum').textContent = `${product.discount}%`;
                document.getElementById('product-price').innerHTML = `price: <span>$${product.price}</span>`;
                document.getElementById('product-old-price').innerHTML = `old price: <span>$${product.old_price}</span>`;
                document.getElementById('product-description').textContent = product.description;

                // Display product images
                const smallimgGroup = document.querySelector('.smallimgGroup');
                smallimgGroup.innerHTML = ''; // Clear existing thumbnails
                product.images.forEach(image => {
                    const imgCol = document.createElement('div');
                    imgCol.classList.add('small-img-col');
                    imgCol.innerHTML = `<img src="${image}" width="100%" class="small-img" alt="${product.name}">`;
                    smallimgGroup.appendChild(imgCol);
                });

                // Add click event to thumbnail images
                document.querySelectorAll('.small-img').forEach(thumbnail => {
                    thumbnail.addEventListener('click', event => {
                        document.getElementById('MainImg').src = event.target.src;
                    });
                });

                // Fetch cart items and update button
                fetchCartItems().then(cartItems => {
                    const addToCartButton = document.getElementById('add-to-cart');
                    if (cartItems.some(item => item.product_id === product.id)) {
                        addToCartButton.textContent = 'Product in Cart';
                        addToCartButton.disabled = true; // Disable button if product is in cart
                    } else {
                        // Handle Add to Cart button click
                        addToCartButton.addEventListener('click', () => {
                            if (!isUserAuthenticated()) {
                                window.location.href = 'signup.html';
                            } else {
                                addToCart(product.id, addToCartButton);
                            }
                        });
                    }
                });
            } else {
                alert('Product not found');
            }
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            alert('Error fetching product details');
        })
        .finally(() => {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        });
    } else {
        alert('No product selected');
    }
});
const showAlert = (message) => {
    const alertBox = document.getElementById('alert');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.classList.add('show');
        setTimeout(() => alertBox.classList.remove('show'), 3000); // Hide alert after 3 seconds
    }
};
const addToCart = (productId, button) => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        console.error('No authentication token found.');
        return;
    }

    fetch(Api('carts'), {
        
        method: 'POST',
        headers: {
            'lang': 'en',
            'Content-Type': 'application/json',
            'Authorization': authToken
        },
        
        body: JSON.stringify({ product_id: productId, quantity: 1 })
    })
    .then(response => response.json())
    .then(data => {
        
        if (data.status) {
            console.log('Product added to cart successfully');
            button.textContent = 'Product in Cart';
            
            button.disabled = true; // Disable button after adding to cart
          
            showAlert('Product added to cart'); // Show success alert

        } else {
            console.error('Failed to add product to cart:', data.message);
        }
    })
    .catch(error => console.error('Error adding product to cart:', error));
};















document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.querySelector("#loading");

    if (loadingOverlay) {
        loadingOverlay.style.display = "flex";
    }

    const apiUrl = Api('products');

    fetch(apiUrl, { 
        headers: {
            'lang': 'en',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const products = data.data.data; // Access the array of products
        const productListfirst = document.getElementById('product-list-first');

        if (!productListfirst) { 
            console.error('Element with id "product-list-first" not found.');
            return;
        }

        // Function to check if a product is in the cart
        const isProductInCart = (productId, cartItems) => {
            return cartItems.some(item => item.product_id === productId);
        };

        const displayProducts = (productList, container, cartItems) => {
            container.innerHTML = ''; // Clear the current list

            if (Array.isArray(productList)) {
                productList.forEach(product => {
                    const proDiv = document.createElement('div');
                    proDiv.classList.add('pro');
                    proDiv.dataset.productId = product.id; // Store product ID in a data attribute

                    const img = document.createElement('img');
                    img.src = product.image;
                    img.alt = product.name;

                    const desDiv = document.createElement('div');
                    desDiv.classList.add('des');

                    const brandSpan = document.createElement('span');
                    brandSpan.textContent = 'Brand'; // Replace with actual brand if available

                    const titleH5 = document.createElement('h5');
                    titleH5.textContent = product.name;

                    const starDiv = document.createElement('div');
                    starDiv.classList.add('star');

                    for (let i = 0; i < 5; i++) {
                        const starIcon = document.createElement('i');
                        starIcon.classList.add('fas', 'fa-star');
                        starDiv.appendChild(starIcon);
                    }

                    const priceH4 = document.createElement('h4');
                    priceH4.textContent = `$${product.price}`;

                    desDiv.appendChild(brandSpan);
                    desDiv.appendChild(titleH5);
                    desDiv.appendChild(starDiv);
                    desDiv.appendChild(priceH4);

                    const cartLink = document.createElement('a');
                    cartLink.href = '#';
                    cartLink.classList.add('cart-link');

                    // Add check icon if the product is in the cart
                    const cartIcon = document.createElement('i');
                    if (isProductInCart(product.id, cartItems)) {
                        cartIcon.classList.add('fa-solid', 'fa-check');
                    } else {
                        cartIcon.classList.add('fa-solid', 'fa-cart-shopping', 'cart');
                    }
                    cartLink.appendChild(cartIcon);

                    proDiv.appendChild(img);
                    proDiv.appendChild(desDiv);
                    proDiv.appendChild(cartLink);

                    container.appendChild(proDiv);
                });
            } else {
                console.error('Expected an array of products but received:', productList);
            }
        };

        // Fetch cart items and display products
        fetchCartItems().then(cartItems => {
            displayProducts(products.slice(0, 8), productListfirst, cartItems);
        });

        // Add event listeners for cart links
        document.addEventListener('click', (event) => {
            if (event.target.closest('.cart-link')) {
                event.preventDefault();
                if (!isUserAuthenticated()) {
                    window.location.href = 'signup.html';
                } else {
                    const cartLink = event.target.closest('.cart-link');
                    const productId = event.target.closest('.pro').dataset.productId;
                    addToCart1(productId, cartLink);
                }
            }
        });
    })
    .catch(error => console.error('Error fetching products:', error))
    .finally(() => {
        if (loadingOverlay) {
            loadingOverlay.style.display = "none";
        }
    });
});

// Function to add a product to the cart and update the icon
const addToCart1 = (productId, cartLink) => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        console.error('No authentication token found.');
        return;
    }

    fetch(Api('carts'), {
        method: 'POST',
        headers: {
            'lang': 'en',
            'Content-Type': 'application/json',
            'Authorization': authToken
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            console.log('Product added to cart successfully');
            const cartIcon = cartLink.querySelector('i');
            if (cartIcon) {
                cartIcon.classList.remove('fa-cart-shopping');
                cartIcon.classList.add('fa-check');
                showAlert('Product added to cart'); // Show success alert

            }
        } else {
            console.error('Failed to add product to cart:', data.message);
        }
    })
    .catch(error => console.error('Error adding product to cart:', error));
};

// Function to fetch cart items
function fetchCartItems() {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        console.error('No authentication token found.');
        return Promise.resolve([]); // Return empty array if no token
    }

    const apiUrl = Api('carts');
    console.log('Fetching cart items from URL:', apiUrl);

    return fetch(apiUrl, {
        headers: {
            'lang': 'en',
            'Content-Type': 'application/json',
            'Authorization': authToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            return data.data.cart_items; // Return cart items if successful
        } else {
            console.error('Error fetching cart items:', data.message);
            return []; // Return empty array on error
        }
    })
    .catch(error => {
        console.error('Error fetching cart items:', error);
        return []; // Return empty array on error
    });
}

// Function to check user authentication
const isUserAuthenticated = () => !!localStorage.getItem('token');
