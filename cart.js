document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Initialize cart from localStorage

    // Function to add a product to the cart
    window.addToCart = function (productName, productPrice, productQuantity) {
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += productQuantity; // Update quantity if the product already exists
            existingItem.price += productPrice * productQuantity; // Update total price
        } else {
            cart.push({ name: productName, price: productPrice * productQuantity, quantity: productQuantity }); // Add new product to cart
        }
        localStorage.setItem("cart", JSON.stringify(cart)); // Save cart to localStorage
        updateCart(); // Update the cart UI
        alert(`${productName} (Quantity: ${productQuantity}) has been added to the cart!`);
    };

    // Function to update the cart UI
    function updateCart() {
        const cartItemsList = document.getElementById("cart-items");
        const totalElement = document.getElementById("total");
        cartItemsList.innerHTML = ""; // Clear the cart items list
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

    // Function to remove an item from the cart
    function removeFromCart(index) {
        cart.splice(index, 1); // Remove the item from the cart
        localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
        updateCart(); // Update the cart UI
    }

    // Clear cart
    document.getElementById("clear-cart-btn")?.addEventListener("click", () => {
        cart = []; // Clear the cart
        localStorage.removeItem("cart"); // Remove cart from localStorage
        updateCart(); // Update the cart UI
    });

    // Initialize the cart UI on page load
    updateCart();
});