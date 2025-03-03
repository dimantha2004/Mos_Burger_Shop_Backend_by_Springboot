document.addEventListener("DOMContentLoaded", function () {
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    window.addToCart = function (productName, productPrice, productQuantity) {
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += productQuantity; 
            existingItem.price += productPrice * productQuantity; 
        } else {
            cart.push({ name: productName, price: productPrice * productQuantity, quantity: productQuantity }); 
        }
        localStorage.setItem("cart", JSON.stringify(cart)); 
        updateCart();
        alert(`${productName} (Quantity: ${productQuantity}) has been added to the cart!`);
    };

    function updateCart() {
        const cartItemsList = document.getElementById("cart-items");
        const totalElement = document.getElementById("total");
        cartItemsList.innerHTML = ""; 
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - Rs: ${item.price.toFixed(2)} (Quantity: ${item.quantity})`;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-btn");
            removeButton.addEventListener("click", () => removeFromCart(index));
            li.appendChild(removeButton);
            cartItemsList.appendChild(li);
            total += item.price;
        });

        totalElement.textContent = `Total: Rs: ${total.toFixed(2)}`;
    }

    function removeFromCart(index) {
        cart.splice(index, 1); 
        localStorage.setItem("cart", JSON.stringify(cart)); 
        updateCart(); 
    }

    document.getElementById("clear-cart-btn")?.addEventListener("click", () => {
        cart = [];
        localStorage.removeItem("cart"); 
        updateCart(); 
    });

    document.getElementById("checkout-btn")?.addEventListener("click", async () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Add some products before checking out.");
            return;
        }

        const phoneNumber = prompt("Please enter your phone number:");
        if (!phoneNumber || phoneNumber.trim() === "") {
            alert("Phone number is required to proceed with the checkout.");
            return;
        }

        const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

        const confirmPayment = confirm(`Total Amount: Rs: ${totalAmount.toFixed(2)}\nProceed to payment?`);
        if (confirmPayment) {
            try {
                const orderData = {
                    phonenumber: phoneNumber,
                    totalPrice: totalAmount,
                    orderDate: new Date().toISOString(), 
                    items: cart.map(item => ({
                        productName: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                };

                const response = await fetchData("/api/Order/add", 'POST', orderData);
                console.log('Order saved successfully:', response);

                await updateProductQuantities(cart);

                cart = [];
                localStorage.removeItem("cart");
                updateCart();

                alert("Order placed successfully! Thank you for your purchase.");
            } catch (error) {
                console.error('Error during checkout:', error);
                alert("Failed to place the order. Please try again.");
            }
        }
    });

    async function updateProductQuantities(cart) {
        for (const item of cart) {
            try {
                const product = await fetchData(`/api/product/getByName?name=${item.name}`, 'GET');
                if (product) {
                    const updatedQuantity = product.quantity - item.quantity;
                    await fetchData(`/api/product/updateQuantity/${product.id}`, 'PUT', { quantity: updatedQuantity });

                    const category = product.category;
                    await loadProducts(category);
                }
            } catch (error) {
                console.error('Error updating product quantity:', error);
            }
        }
    }

    updateCart();
});

async function fetchData(endpoint, method, data = null) {
    const backendBaseUrl = "http://localhost:8080";
    const url = `${backendBaseUrl}${endpoint}`;

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text();
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function loadProducts(category) {
    try {
        const products = await fetchData(`/api/product/getAll?category=${category}`, 'GET');
        const categorySection = document.getElementById(category);
        if (categorySection) {
            const productsContainer = categorySection.querySelector(".products");
            productsContainer.innerHTML = ''; 

            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <img src="${product.photoLink}" alt="${product.productName}" width="100">
                    <h4>${product.productName}</h4>
                    <p>Rs: ${product.productPrice}</p>
                    <p class="available-quantity">Available Quantity: ${product.quantity}</p>
                    <button class="order-btn" data-name="${product.productName}" data-price="${product.productPrice}" data-quantity="${product.quantity}">Order</button>
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
                `;
                productsContainer.appendChild(productElement);

                const deleteButton = productElement.querySelector('.delete-btn');
                deleteButton.addEventListener('click', () => deleteProduct(product.id, category));

                const orderButton = productElement.querySelector('.order-btn');
                orderButton.addEventListener('click', () => {
                    const productName = orderButton.getAttribute('data-name');
                    const productPrice = parseFloat(orderButton.getAttribute('data-price'));
                    const availableQuantity = parseInt(orderButton.getAttribute('data-quantity'), 10);

                    const quantity = prompt(`Enter the quantity for ${productName} (Available: ${availableQuantity}):`);
                    if (quantity !== null && !isNaN(quantity) && quantity > 0) {
                        const orderQuantity = parseInt(quantity, 10);
                        if (orderQuantity <= availableQuantity) {
                            addToCart(productName, productPrice, orderQuantity);
                        } else {
                            alert(`You cannot order more than the available quantity (${availableQuantity}).`);
                        }
                    } else {
                        alert("Please enter a valid quantity.");
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}