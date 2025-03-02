document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    const backendBaseUrl = "http://localhost:8080";

    const addProductButtons = document.querySelectorAll(".add-new-product-btn");
    addProductButtons.forEach(button => {
        button.addEventListener("click", function () {
            const category = button.getAttribute("data-category");
            showAddProductForm(category);
        });
    });

    function showAddProductForm(category) {
        const categorySection = document.getElementById(category);
        if (!categorySection) {
            console.error(`Category section not found: ${category}`);
            return;
        }

        const existingForm = categorySection.querySelector("#add-product-form");
        if (existingForm) {
            existingForm.remove();
        }

        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <form id="add-product-form" style="margin-top: 10px; padding: 10px; border: 1px solid #ccc;">
                <h3>Add New Product to ${category}</h3>
                <input type="text" id="photo-link" placeholder="Photo Link" required>
                <input type="text" id="product-name" placeholder="Product Name" required>
                <input type="number" id="product-price" placeholder="Price" required>
                <input type="number" id="product-quantity" placeholder="Quantity" required>
                <button type="submit" id="submit-product-btn">Add Product</button>
                <button type="button" id="cancel-form-btn">Cancel</button>
            </form>
        `;

        categorySection.appendChild(formContainer);

        const form = document.getElementById("add-product-form");

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            const photoLink = document.getElementById("photo-link").value;
            const productName = document.getElementById("product-name").value;
            const productPrice = document.getElementById("product-price").value;
            const productQuantity = document.getElementById("product-quantity").value;

            if (photoLink && productName && productPrice && productQuantity) {
                await addNewProduct(category, photoLink, productName, productPrice, productQuantity);
                formContainer.remove();
            } else {
                alert("Please fill in all fields!");
            }
        });

        document.getElementById("cancel-form-btn").addEventListener("click", () => {
            formContainer.remove();
        });
    }

    async function addNewProduct(category, photoLink, productName, productPrice, productQuantity) {
        const productData = {
            photoLink: photoLink,
            productName: productName,
            productPrice: parseFloat(productPrice),
            quantity: parseInt(productQuantity, 10),
            category: category,
        };

        console.log('Sending product data:', productData);

        try {
            const response = await fetchData("/api/product/add", 'POST', productData);
            console.log('Response from server:', response);
            alert('Product added successfully!');
            loadProducts(category);
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
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

    async function deleteProduct(productId, category) {
        try {
            const response = await fetchData(`/api/product/delete/${productId}`, 'DELETE');
            console.log('Product deleted successfully:', response);
            alert('Product deleted successfully!');
            loadProducts(category);
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        }
    }

    loadProducts("burgers");
    loadProducts("submarines");
    loadProducts("fries");
    loadProducts("pasta");
    loadProducts("chicken");
    loadProducts("beverages");
});