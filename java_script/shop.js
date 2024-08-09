function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key;
}
// show dialog
const showAlert = (message) => {
    const alertBox = document.getElementById('alert');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.classList.add('show');
        setTimeout(() => alertBox.classList.remove('show'), 3000); // Hide alert after 3 seconds
    }
};

function isUserAuthenticated() {
    return !!localStorage.getItem('token');

}

document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.querySelector("#loading");

    // Show the loading overlay
    loadingOverlay.style.display = "flex";

    const apiUrl = Api('products');
    let allProducts = [];

    fetch(apiUrl, {
        headers: {
            'lang': 'en',
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        allProducts = data.data.data; // Store all products in a variable
        const productListfirst = document.getElementById('AllProductList');

        if (!productListfirst ) {
            console.error('Element with id "AllProductList" not found.');
            return;
        }

        // Function to display products
        const displayProducts = (productList, container) => {
            container.innerHTML = '';

            if (Array.isArray(productList)) {
                productList.forEach(product => {
                    const proDiv = document.createElement('div');
                    proDiv.classList.add('pro');

                    const img = document.createElement('img');
                    img.src = product.image;
                    img.alt = product.name;

                    const desDiv = document.createElement('div');
                    desDiv.classList.add('des');

                    const brandSpan = document.createElement('span');
                    brandSpan.textContent = 'Brand';

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
                    cartLink.dataset.productId = product.id;
                    const cartIcon = document.createElement('i');
                    cartIcon.classList.add('fa-solid', 'fa-cart-shopping', 'cart');
                    cartLink.appendChild(cartIcon);

                    proDiv.appendChild(img);
                    proDiv.appendChild(desDiv);
                    proDiv.appendChild(cartLink);

                    container.appendChild(proDiv);

                    img.addEventListener('click', () => {
                        localStorage.setItem('selectedProductId', product.id);
                        window.location.href = 'product_details.html';
                    });
                });
            } else {
                console.error('Expected an array of products but received:', productList);
            }
        };

        // Display initial set of products
        displayProducts(allProducts, productListfirst);

        // Search functionality
        const searchInput = document.getElementById('productSearch');
        searchInput.addEventListener('input', () => {
            const searchQuery = searchInput.value.toLowerCase();
            const filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchQuery)
            );
            displayProducts(filteredProducts, productListfirst);
        });

        if (isUserAuthenticated()) {
            const authToken = localStorage.getItem('token');

            fetch(Api('carts'), {
                headers: {
                    'lang': 'en',
                    'Content-Type': 'application/json',
                    'Authorization': authToken
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    const cartItems = data.data.cart_items;

                    // Update icons based on cart items
                    document.querySelectorAll('.cart-link').forEach(link => {
                        const productId = link.dataset.productId;
                        if (cartItems.some(item => item.product.id === parseInt(productId))) {
                            const cartIcon = link.querySelector('i');
                            if (cartIcon) {
                                cartIcon.classList.remove('fa-cart-shopping');
                                cartIcon.classList.add('fa-check');
                            }
                        }
                    });
                }
            })
            .catch(error => console.error('Error fetching cart items:', error));
        }

        document.addEventListener('click', (event) => {
            const cartLink = event.target.closest('.cart-link');
            if (cartLink) {
                event.preventDefault();
                const productId = cartLink.dataset.productId;
                if (!isUserAuthenticated()) {
                    console.log('User is not authenticated');
                    window.location.href = 'signup.html';
                } else {
                    addToCart(productId, cartLink);
                }
            }
        });
    })
    .catch(error => console.error('Error fetching products:', error))
    .finally(() => {
        loadingOverlay.style.display = "none";
    });
});

const addToCart = (productId, cartLink) => {
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
                showAlert('Product added to cart')
                console.log('product added to cart');
                
            }

        } else {
            console.error('Failed to add product to cart:', data.message);
        }
    })
    .catch(error => console.error('Error adding product to cart:', error));
};








//  check if login or not if login change text to image
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
