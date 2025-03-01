let lastOrderNumber = parseInt(localStorage.getItem('lastOrderNumber')) || 0;

function saveOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }

    lastOrderNumber++;
    localStorage.setItem('lastOrderNumber', lastOrderNumber);

    const orderId = lastOrderNumber.toString().padStart(4, '0');
    const order = {
        id: orderId,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        timestamp: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    cart = [];
    updateCart();
    alert(`Order ${orderId} saved successfully!`);
}

document.getElementById('save-order-btn').addEventListener('click', saveOrder);