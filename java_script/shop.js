function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key;
}

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = Api('products');
    let products = [];
    const loadingIndicator = document.getElementById('loading');

    // Show the loading indicator
    loadingIndicator.style.display = 'flex';

    // Fetch products and cart items
    Promise.all([fetch(apiUrl, { headers: { 'lang': 'en', 'Content-Type': 'application/json' } }).then(response => response.json()), fetchCartItems()])
        .then(([productData, cartItems]) => {
            products = productData.data.data; // Access the array of products
            displayProducts(products, cartItems); // Display all products initially
        })
        .catch(error => console.error('Error fetching products or cart items:', error))
        .finally(() => {
            // Hide the loading indicator after data is loaded or an error occurs
            loadingIndicator.style.display = 'none';
        });

    // Event listener for search input
    document.getElementById('search-input').addEventListener('input', debounce((event) => {
        const query = event.target.value.toLowerCase().trim();
        fetchCartItems().then(cartItems => {
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query)
            );
            displayProducts(filteredProducts, cartItems); // Display filtered products
        });
    }, 300)); // Debounce delay (300ms)

    // Function to display products
    const displayProducts = (productList, cartItems) => {
        const productListContainer = document.getElementById('AllProductList');
        productListContainer.innerHTML = ''; // Clear the current list

        // Filter out products already in the cart
        const filteredProducts = productList.filter(product => 
            !cartItems.some(item => item.product_id === product.id)
        );

        if (Array.isArray(filteredProducts)) {
            filteredProducts.forEach(product => {
                const proDiv = document.createElement('div');
                proDiv.classList.add('pro');
                proDiv.dataset.productId = product.id; // Set data attribute for product ID

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
                cartLink.href = '#'; // Update with actual cart URL or functionality
                cartLink.classList.add('cart-link'); // Add a class to target later
                cartLink.dataset.productId = product.id; // Set data attribute for product ID
                const cartIcon = document.createElement('i');
                cartIcon.classList.add('fa-solid', 'fa-cart-shopping', 'cart');

                cartLink.appendChild(cartIcon);

                proDiv.appendChild(img);
                proDiv.appendChild(desDiv);
                proDiv.appendChild(cartLink);

                productListContainer.appendChild(proDiv);

                // Add event listener to image to navigate to product details
                img.addEventListener('click', () => {
                    localStorage.setItem('selectedProductId', product.id);
                    window.location.href = 'product_details.html';
                });

                // Add event listener to cart link
                cartLink.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent default link behavior
                    if (!isUserAuthenticated()) {
                        console.log('User is not authenticated');
                        window.location.href = 'signup.html';
                    } else {
                        addToCart1(product.id, cartLink); // Pass cartLink to update icon
                    }
                });
            });
        } else {
            console.error('Expected an array of products but received:', productList);
        }
    };

    // Function to fetch cart items
    function fetchCartItems() {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            console.error('No authentication token found.');
            return Promise.resolve([]); // Return empty array if no token
        }

        return fetch(Api('carts'), {
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
    const isUserAuthenticated = () => {
        return !!localStorage.getItem('token'); // Check for token to verify authentication
    };
});

// Function to add a product to the cart and update the cart icon
const addToCart1 = (productId, cartLink) => { 
    const authToken = localStorage.getItem('token');
    console.log(authToken);

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
            }
        } else {
            console.error('Failed to add product to cart:', data.message);
        }
    })
    .catch(error => console.error('Error adding product to cart:', error));
};

// Debounce function to limit the rate of function execution
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
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



// open menu
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
