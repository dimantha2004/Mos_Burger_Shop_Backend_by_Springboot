document.addEventListener("DOMContentLoaded", function () {
    const addProductButton = document.getElementById("add-new-product-btn");
    const appContent = document.querySelector(".app-content");

    addProductButton.addEventListener("click", function () {
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <form id="add-product-form" style="margin-top: 10px; padding: 10px; border: 1px solid #ccc;">
                <h3>Add New Product</h3>
                <input type="text" id="photo-link" placeholder="Photo Link" required>
                <input type="text" id="product-name" placeholder="Product Name" required>
                <input type="number" id="product-price" placeholder="Price" required>
                <button type="submit" id="submit-product-btn">Add Product</button>
                <button type="button" id="cancel-form-btn">Cancel</button>
            </form>
        `;
        appContent.appendChild(formContainer);

        const form = document.getElementById("add-product-form");

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const photoLink = form.querySelector("#photo-link").value;
            const productName = form.querySelector("#product-name").value;
            const productPrice = form.querySelector("#product-price").value;

            if (photoLink && productName && productPrice) {
                const newProduct = document.createElement("div");
                newProduct.classList.add("product");
                newProduct.innerHTML = `
                    <img src="${photoLink}" alt="${productName}">
                    <h4>${productName}</h4>
                    <p>Rs: ${productPrice}</p>
                    <button class="order-btn" data-name="${productName}" data-price="${productPrice}">Order</button>
                `;
                appContent.appendChild(newProduct);
                formContainer.remove();
            } else {
                alert("Please fill in all fields!");
            }
        });

        form.querySelector("#cancel-form-btn").addEventListener("click", () => {
            formContainer.remove();
        });
    });
});