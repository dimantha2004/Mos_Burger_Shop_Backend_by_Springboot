let cart = [];

function addToCart(productName, productPrice) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.price += productPrice;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItemsList = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    cartItemsList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price.toFixed(2)}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        removeButton.addEventListener('click', () => removeFromCart(index));
        li.appendChild(removeButton);
        cartItemsList.appendChild(li);
        total += item.price;
    });

    totalElement.textContent = `Total: RS: ${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Add event listeners for "Order" buttons
document.querySelectorAll('.order-btn').forEach(button => {
    button.addEventListener('click', function () {
        const productName = this.dataset.name;
        const productPrice = parseFloat(this.dataset.price);
        addToCart(productName, productPrice);
    });
});

// Clear cart
document.getElementById('clear-cart-btn').addEventListener('click', () => {
    cart = [];
    updateCart();
});