
 //helper
 function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key;
}





// featch category



document.addEventListener("DOMContentLoaded", function () {
    const featureSection = document.querySelector("#feature");

    // Local CORS proxy
    const apiUrl = Api('categories');

    fetch(apiUrl, {
        headers: {
            'lang': 'en',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const categories = data.data.data;
            categories.forEach(category => {
                const div = document.createElement("div");
                div.classList.add("fe-box");
                div.dataset.categoryId = category.id; // Store category ID in data attribute
                div.innerHTML = `
                    <img src="${category.image}" alt="${category.name}">
                    <h6>${category.name}</h6>

                `;
                div.addEventListener("click", () => {
                  
                    localStorage.setItem('selectedCategoryId', category.id);
                    
                    window.location.href = 'category_product.html';
                });
                featureSection.appendChild(div);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));
});



// fetch product




function isUserAuthenticated() {
    return !!localStorage.getItem('token');

}



document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.querySelector("#loading");

    // Show the loading overlay
    loadingOverlay.style.display = "flex";

    const apiUrl = Api('products');
    fetch(apiUrl, {
        headers: {
            'lang': 'en',
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        const products = data.data.data;
        const productListfirst = document.getElementById('product-list-first');
        const productListsecond = document.getElementById('product-list-second');

        if (!productListfirst || !productListsecond) {
            console.error('Element with id "product-list-first" or "product-list-second" not found.');
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
                });
            } else {
                console.error('Expected an array of products but received:', productList);
            }
        };

        // Display initial set of products
        displayProducts(products.slice(0, 8), productListfirst);
        displayProducts(products.slice(8, 16), productListsecond);

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
                console.log('product added to cart');
                
            }

        } else {
            console.error('Failed to add product to cart:', data.message);
        }
    })
    .catch(error => console.error('Error adding product to cart:', error));
};



 

// banner

document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.querySelector("#loading");

    // Show the loading overlay
    loadingOverlay.style.display = "flex";
   
    const apiUrl =Api('banners');
    fetch(apiUrl,{
        headers: {
            'lang':'en',
           'Content-Type': 'application/json'
       },
    }) 
        .then(response => response.json())
        .then(data => {
            const bannerbox1 = document.getElementById('banner-box1');
            const bannerbox2 = document.getElementById('banner-box2');
            const bannerbox3 = document.getElementById('banner');
            const bannerbox4 = document.getElementById('banner-box4');
            const bannerbox5 = document.getElementById('banner-box5');
            const bannerbox6 = document.getElementById('banner-box6');
            const bannerSection = document.getElementById('hero');
            // Check if data is valid and contains the banner image
            if (data.status && Array.isArray(data.data) && data.data.length > 0) {
                const firstBanner = data.data[0]; // Get the first banner
                if (firstBanner && firstBanner.image) {
                    bannerSection.style.backgroundImage = `url('${data.data[0].image}')`;
                    bannerbox1.style.backgroundImage = `url('${data.data[1].image}')`;
                    bannerbox2.style.backgroundImage = `url('${data.data[2].image}')`;
                    bannerbox3.style.backgroundImage = `url('${data.data[3].image}')`;
                    bannerbox4.style.backgroundImage = `url('${data.data[6].image}')`;
                    bannerbox5.style.backgroundImage = `url('${data.data[7].image}')`;
                    bannerbox6.style.backgroundImage = `url('${data.data[8].image}')`;
                }  else {
                    console.error('Banner image URL is missing in the data.');
                }
            } else {
                console.error('Invalid data format or no banners available.');
            }
        })
        .catch(error => console.error('Error fetching banner data:', error));
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

// menu settings
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

