


// helper
function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key;
}



// check if user is  authenticated or not
const isUserAuthenticated = () => !!localStorage.getItem('token');










    
    
//    featch product category by select category id
   
    document.addEventListener('DOMContentLoaded', () => {


      
    const selectedCategoryId = localStorage.getItem('selectedCategoryId');
        const loadingOverlay = document.querySelector("#loading");
    
        // Show the loading overlay
        loadingOverlay.style.display = "flex";
    
        const apiUrl = Api(`categories/${selectedCategoryId}`);
        fetch(apiUrl, {
            headers: {
                'lang': 'en',
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            const products = data.data.data;
            const productListfirst = document.getElementById('AllProductList');
         
    // if null
            if (!productListfirst ) {
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
    
                        for (let i = 0; i < 5; i++) { //5 star
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
            displayProducts(products, productListfirst);
          
    
            if (isUserAuthenticated()) {
                const authToken = localStorage.getItem('token');
    //   fetch data to cart by icon
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
                        // if token =null go to sign up
                        window.location.href = 'signup.html';
                        
                    } else {
                        addToCart1(productId, cartLink);
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching products:', error))
        .finally(() => {
            // loading=none
            loadingOverlay.style.display = "none";
        });
    });
    // add product to cart and change button from cart to check
    const addToCart1= (productId, cartLink) => {
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

    
// if user login or not if login make image replacement sign up if not  signup
document.addEventListener('DOMContentLoaded', () => {
   
    const authToken = localStorage.getItem('token');

    const signUpLink = document.querySelector('#navbar a.changeIcon');

    if (authToken) {
        signUpLink.innerHTML = '<img src="img/download.png" alt="User" class="profile-image">';
        signUpLink.classList.remove('changeIcon');
        signUpLink.classList.add('profile-link');
    }
});