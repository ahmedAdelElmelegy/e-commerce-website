function Api(key) {
    return 'http://localhost:8080/https://student.valuxapps.com/api/' + key;
}

document.addEventListener("DOMContentLoaded", function () {
    const productSection = document.querySelector("#productSection");
    const catNameElement = document.querySelector("#catName");
    const selectedCategoryId = localStorage.getItem('selectedCategoryId');

    if (selectedCategoryId) {
        // Local CORS proxy
        const apiUrl = Api(`categories/${selectedCategoryId}`);

        fetch(apiUrl, {
            headers: {
                'lang': 'en',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const category = data.data;
                // Update category name
                catNameElement.textContent = category.name;

                // Fetch cart items and products
                Promise.all([fetchCartItems(), fetchProducts(selectedCategoryId)])
                    .then(([cartItems, products]) => {
                        displayProducts(products, cartItems);
                    })
                    .catch(error => console.error("Error fetching data:", error));
            })
            .catch(error => console.error("Error fetching category:", error));
    } else {
        catNameElement.textContent = 'No category selected.';
        productSection.innerHTML = '<p>No products available.</p>';
    }
});

function fetchCartItems() {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        console.error('No authentication token found.');
        return Promise.resolve([]); // Return an empty array if not authenticated
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
                return data.data.cart_items.map(item => item.product_id); // Return an array of product IDs in the cart
            } else {
                console.error('Error fetching cart items:', data.message);
                return [];
            }
        })
        .catch(error => {
            console.error('Error fetching cart items:', error);
            return [];
        });
}

function fetchProducts(categoryId) {
    const apiUrl = Api(`products?category_id=${categoryId}`);

    return fetch(apiUrl, {
        headers: {
            'lang': 'en',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => data.data.data)
        .catch(error => {
            console.error("Error fetching products:", error);
            return [];
        });
}

function displayProducts(products, cartItems) {
    const productSection = document.querySelector("#productSection");
    productSection.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product-box");
        const isInCart = cartItems.includes(product.id);
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h6>${product.name}</h6>
            <p>Price: ${product.price}</p>
            <a class="cart-link2 ${isInCart ? 'added-to-cart' : ''}" data-product-id="${product.id}">
                ${isInCart ? 'Product in Cart' : 'Add to Cart'}
                <i class="fa-solid ${isInCart ? 'fa-check' : 'fa-cart-shopping'}"></i>
            </a>
        `;
        productSection.appendChild(div);

        // Add event listener to the cart link
        const cartLink = div.querySelector('.cart-link2');
        if (!isInCart) {
            cartLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                if (!isUserAuthenticated()) {
                    console.log('User is not authenticated');
                    window.location.href = 'signup.html';
                } else {
                    addToCart1(product.id, cartLink); // Pass cartLink to update icon
                }
            });
        }
    });
}

function isUserAuthenticated() {
    return !!localStorage.getItem('token'); // Check for token to verify authentication
}

function addToCart1(productId, cartLink) {
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

                // Update the cart link text and style
                cartLink.textContent = 'Product in Cart';
                cartLink.classList.add('added-to-cart');
                cartLink.classList.add('red-button'); // Add red-button class to change the background color to red
            } else {
                console.error('Failed to add product to cart:', data.message);
            }
        })
        .catch(error => console.error('Error adding product to cart:', error));
}
