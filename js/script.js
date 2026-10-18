/* =========================================================
   ShopEase Online Store
   Main JavaScript
   ========================================================= */


/* =========================================================
   CART STORAGE
   ========================================================= */

let cart = JSON.parse(localStorage.getItem("shopEaseCart")) || [];

let discount = Number(
    localStorage.getItem("shopEaseDiscount") || 0
);


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "shopEaseDiscount",
        discount
    );

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(name, price, category, image) {

    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: price,
            category: category,
            image: image,
            quantity: 1
        });

    }

    saveCart();

    updateCartCount();

    showCartNotification(name);

}


/* =========================================================
   UPDATE CART COUNT
   ========================================================= */

function updateCartCount() {

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.querySelectorAll(".cart-count")
        .forEach(element => {

            element.textContent = count;

        });

}


/* =========================================================
   CART NOTIFICATION
   ========================================================= */

function showCartNotification(productName) {

    const oldNotification =
        document.querySelector(".cart-notification");

    if (oldNotification) {
        oldNotification.remove();
    }

    const notification =
        document.createElement("div");

    notification.className =
        "cart-notification";

    notification.innerHTML = `
        <i class="bi bi-check-circle-fill"></i>
        ${productName} added to cart
    `;

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.classList.add("hide");

        setTimeout(() => {
            notification.remove();
        }, 300);

    }, 1800);

}


/* =========================================================
   CALCULATE SUBTOTAL
   ========================================================= */

function calculateSubtotal() {

    return cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

}


/* =========================================================
   CALCULATE TOTAL QUANTITY
   ========================================================= */

function calculateQuantity() {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}


/* =========================================================
   CALCULATE DELIVERY
   ========================================================= */

function calculateDelivery(subtotal) {

    if (subtotal === 0) {
        return 0;
    }

    if (subtotal >= 999) {
        return 0;
    }

    return 79;

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    const cartItems =
        document.getElementById("cartItems");

    const emptyCart =
        document.getElementById("emptyCart");

    if (!cartItems) {
        return;
    }


    if (cart.length === 0) {

        cartItems.innerHTML = "";

        if (emptyCart) {
            emptyCart.style.display = "block";
        }

        updateCartSummary();

        return;
    }


    if (emptyCart) {
        emptyCart.style.display = "none";
    }


    cartItems.innerHTML = cart.map(
        (item, index) => {

            const itemTotal =
                item.price * item.quantity;

            return `
                <div class="cart-item">

                    <div class="cart-item-image">

                        <img
                            src="${item.image}"
                            alt="${item.name}">

                    </div>


                    <div class="cart-item-details">

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            ${item.category}
                        </p>

                        <div class="cart-item-price">
                            ₹${item.price.toLocaleString("en-IN")}
                        </div>

                    </div>


                    <div class="quantity-control">

                        <button
                            onclick="changeQuantity(${index}, -1)">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${index}, 1)">
                            +
                        </button>

                    </div>


                    <strong class="cart-line-total">
                        ₹${itemTotal.toLocaleString("en-IN")}
                    </strong>


                    <button
                        class="remove-item"
                        onclick="removeFromCart(${index})"
                        title="Remove item">

                        <i class="bi bi-trash"></i>

                    </button>

                </div>
            `;

        }
    ).join("");


    updateCartSummary();

}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(index, change) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================================
   CART SUMMARY
   ========================================================= */

function updateCartSummary() {

    const subtotal =
        calculateSubtotal();

    const delivery =
        calculateDelivery(subtotal);

    let discountAmount =
        subtotal * (discount / 100);


    if (discountAmount > subtotal) {
        discountAmount = subtotal;
    }


    const total =
        subtotal -
        discountAmount +
        delivery;


    const subtotalElement =
        document.getElementById("cartSubtotal");

    const discountElement =
        document.getElementById("cartDiscount");

    const deliveryElement =
        document.getElementById("cartDelivery");

    const totalElement =
        document.getElementById("cartTotal");

    const itemCountElement =
        document.getElementById("cartItemCount");


    if (subtotalElement) {

        subtotalElement.textContent =
            `₹${subtotal.toLocaleString("en-IN")}`;

    }


    if (discountElement) {

        discountElement.textContent =
            `-₹${discountAmount.toLocaleString("en-IN")}`;

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : `₹${delivery}`;

    }


    if (totalElement) {

        totalElement.textContent =
            `₹${total.toLocaleString("en-IN")}`;

    }


    if (itemCountElement) {

        const quantity =
            calculateQuantity();

        itemCountElement.textContent =
            `${quantity} ${quantity === 1 ? "Item" : "Items"}`;

    }

}


/* =========================================================
   APPLY COUPON
   ========================================================= */

function applyCoupon() {

    const couponInput =
        document.getElementById("coupon");

    const couponMessage =
        document.getElementById("couponMessage");


    if (!couponInput || !couponMessage) {
        return;
    }


    const coupon =
        couponInput.value.trim().toUpperCase();


    if (coupon === "SAVE10") {

        discount = 10;

        couponMessage.textContent =
            "Coupon applied successfully. 10% discount added.";

        couponMessage.style.color =
            "#16A34A";

    } else if (coupon === "") {

        discount = 0;

        couponMessage.textContent =
            "Please enter a coupon code.";

        couponMessage.style.color =
            "#DC2626";

    } else {

        discount = 0;

        couponMessage.textContent =
            "Invalid coupon code. Try SAVE10.";

        couponMessage.style.color =
            "#DC2626";

    }


    saveCart();

    updateCartSummary();

    renderCheckoutSummary();

}


/* =========================================================
   PRODUCT FILTER
   ========================================================= */

function filterProducts(category, button) {

    const products =
        document.querySelectorAll(".product-item");

    const buttons =
        document.querySelectorAll(".filter-btn");


    buttons.forEach(btn => {
        btn.classList.remove("active");
    });


    if (button) {
        button.classList.add("active");
    }


    products.forEach(product => {

        const productCategory =
            product.getAttribute("data-category");


        if (
            category === "all" ||
            productCategory === category
        ) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });

}


/* =========================================================
   CHECKOUT SUMMARY
   ========================================================= */

function renderCheckoutSummary() {

    const checkoutItems =
        document.getElementById("checkoutItems");


    if (!checkoutItems) {
        return;
    }


    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <div class="text-center py-4">

                <i class="bi bi-cart-x fs-2 text-muted"></i>

                <p class="mt-2">
                    Your cart is empty.
                </p>

                <a href="products.html"
                    class="btn btn-violet btn-sm">
                    Shop Products
                </a>

            </div>
        `;

        updateCheckoutSummary();

        return;
    }


    checkoutItems.innerHTML =
        cart.map(item => {

            const total =
                item.price * item.quantity;

            return `
                <div class="checkout-item">

                    <div class="checkout-item-image">

                        <img
                            src="${item.image}"
                            alt="${item.name}">

                    </div>


                    <div class="checkout-item-details">

                        <h5>
                            ${item.name}
                        </h5>

                        <small>
                            Qty: ${item.quantity}
                        </small>

                    </div>


                    <div class="checkout-item-price">
                        ₹${total.toLocaleString("en-IN")}
                    </div>

                </div>
            `;

        }).join("");


    updateCheckoutSummary();

}


/* =========================================================
   CHECKOUT SUMMARY TOTALS
   ========================================================= */

function updateCheckoutSummary() {

    const subtotal =
        calculateSubtotal();

    const delivery =
        calculateDelivery(subtotal);

    const discountAmount =
        subtotal * (discount / 100);

    const total =
        subtotal -
        discountAmount +
        delivery;


    const subtotalElement =
        document.getElementById("checkoutSubtotal");

    const discountElement =
        document.getElementById("checkoutDiscount");

    const deliveryElement =
        document.getElementById("checkoutDelivery");

    const totalElement =
        document.getElementById("checkoutTotal");


    if (subtotalElement) {

        subtotalElement.textContent =
            `₹${subtotal.toLocaleString("en-IN")}`;

    }


    if (discountElement) {

        discountElement.textContent =
            `-₹${discountAmount.toLocaleString("en-IN")}`;

    }


    if (deliveryElement) {

        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : `₹${delivery}`;

    }


    if (totalElement) {

        totalElement.textContent =
            `₹${total.toLocaleString("en-IN")}`;

    }

}


/* =========================================================
   CHECKOUT VALIDATION
   ========================================================= */

function validateCheckout() {

    let isValid = true;


    const name =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const pincode =
        document.getElementById("pincode");

    const address =
        document.getElementById("address");

    const city =
        document.getElementById("city");

    const state =
        document.getElementById("state");

    const terms =
        document.getElementById("terms");


    clearErrors();


    /* Name */

    if (
        !name.value.trim() ||
        name.value.trim().length < 2
    ) {

        showError(
            "nameError",
            "Please enter a valid name."
        );

        isValid = false;

    }


    /* Email */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailPattern.test(
            email.value.trim()
        )
    ) {

        showError(
            "emailError",
            "Please enter a valid email address."
        );

        isValid = false;

    }


    /* Phone */

    const phonePattern =
        /^[6-9]\d{9}$/;


    if (
        !phonePattern.test(
            phone.value.trim()
        )
    ) {

        showError(
            "phoneError",
            "Enter a valid 10-digit Indian mobile number."
        );

        isValid = false;

    }


    /* Pincode */

    const pincodePattern =
        /^\d{6}$/;


    if (
        !pincodePattern.test(
            pincode.value.trim()
        )
    ) {

        showError(
            "pincodeError",
            "Enter a valid 6-digit PIN code."
        );

        isValid = false;

    }


    /* Address */

    if (
        !address.value.trim() ||
        address.value.trim().length < 10
    ) {

        showError(
            "addressError",
            "Please enter a complete delivery address."
        );

        isValid = false;

    }


    /* City */

    if (
        !city.value.trim() ||
        city.value.trim().length < 2
    ) {

        showError(
            "cityError",
            "Please enter a valid city."
        );

        isValid = false;

    }


    /* State */

    if (!state.value) {

        showError(
            "stateError",
            "Please select a state."
        );

        isValid = false;

    }


    /* Terms */

    if (!terms.checked) {

        showError(
            "termsError",
            "Please accept the terms and conditions."
        );

        isValid = false;

    }


    return isValid;

}


/* =========================================================
   SHOW ERROR
   ========================================================= */

function showError(id, message) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            message;

    }

}


/* =========================================================
   CLEAR ERRORS
   ========================================================= */

function clearErrors() {

    document.querySelectorAll(".field-error")
        .forEach(element => {

            element.textContent = "";

        });

}


/* =========================================================
   PLACE ORDER
   ========================================================= */

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        showCheckoutMessage(
            "Your cart is empty. Please add a product before placing an order.",
            "error"
        );

        return;

    }


    const valid =
        validateCheckout();


    if (!valid) {

        showCheckoutMessage(
            "Please correct the highlighted fields.",
            "error"
        );

        return;

    }


    const orderNumber =
        "SE" +
        Date.now().toString().slice(-6);


    const orderNumberElement =
        document.getElementById("orderNumber");


    if (orderNumberElement) {

        orderNumberElement.textContent =
            orderNumber;

    }


    const modalElement =
        document.getElementById(
            "orderSuccessModal"
        );


    if (modalElement) {

        const modal =
            new bootstrap.Modal(
                modalElement
            );

        modal.show();

    }


    cart = [];

    discount = 0;

    saveCart();

    updateCartCount();

}


/* =========================================================
   CHECKOUT MESSAGE
   ========================================================= */

function showCheckoutMessage(message, type) {

    const element =
        document.getElementById(
            "checkoutMessage"
        );


    if (!element) {
        return;
    }


    element.className =
        `validation-message ${type}`;

    element.textContent =
        message;

}


/* =========================================================
   GO HOME
   ========================================================= */

function goToHome() {

    window.location.href =
        "index.html";

}


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        renderCart();

        renderCheckoutSummary();


        const checkoutForm =
            document.getElementById(
                "checkoutForm"
            );


        if (checkoutForm) {

            checkoutForm.addEventListener(
                "submit",
                placeOrder
            );

        }

    }
);