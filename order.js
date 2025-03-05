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

document.addEventListener("DOMContentLoaded", function () {
    let cart = [];

    window.addToCart = function (productName, productPrice, productQuantity) {
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += productQuantity; 
            existingItem.price += productPrice * productQuantity; 
        } else {
            cart.push({ name: productName, price: productPrice * productQuantity, quantity: productQuantity }); 
        }
        updateCart(); 
        alert(`${productName} (Quantity: ${productQuantity}) has been added to the cart!`);
    };

    async function loadProducts(category) {
        try {
            const products = await fetchData(`/api/product/getAll?category=${category}`, 'GET');
            console.log('Backend Response:', products);

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
                    `;
                    productsContainer.appendChild(productElement);

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
        updateCart();
    }

    document.getElementById("clear-cart-btn")?.addEventListener("click", () => {
        cart = []; 
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

                for (const item of cart) {
                    await updateProductQuantities(item.name, item.quantity);
                }

                generateReceipt(phoneNumber, cart, totalAmount);

                cart = []; 
                updateCart();
                alert("Order placed successfully...! Thank you for your purchase.");
            } catch (error) {
                console.error('Error during checkout:', error);
                alert("Failed to place the order. Please try again.");
            }
        }
    });

    async function updateProductQuantities(productName, quantity) {
        try {
            const product = await fetchData(`/api/product/getByName?name=${productName}`, 'GET');
            if (!product) {
                console.error('Product not found:', productName);
                return;
            }

            const updatedQuantity = product.quantity - quantity;
            if (updatedQuantity < 0) {
                console.error('Insufficient quantity for:', productName);
                return;
            }

            await fetchData(`/api/product/update/${product.id}`, 'PUT', { quantity: updatedQuantity });
            console.log('Product quantity updated successfully:', productName);
        } catch (error) {
            console.error('Error updating product quantity:', error);
        }
    }

    updateCart(); 
});