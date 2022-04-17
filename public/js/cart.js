// Cart - popup
const cartBtn1 = document.getElementById('cart-btn1');
const cartBtn2Mob = document.getElementById('cart-btn2');
const cartClose = document.getElementById('cart-close');

cartBtn1.addEventListener('click', () => {
    backdrop.style.display = 'block';
    cartContainer.classList.add('active');
});

cartBtn2Mob.addEventListener('click', () => {
    // As side nav bar is open - first close it
    backdrop.style.display = 'block';
    sideDrawer.classList.remove('open');
    cartContainer.classList.add('active');
});

cartClose.addEventListener('click', () => {
    backdrop.style.display = 'none';
    cartContainer.classList.remove('active');
});


// Add to Cart Function
const gridItems = document.getElementById('grid-items');
gridItems.addEventListener('click', (e) => {
    // Add to cart button is clicked
    if (e.target.className == 'btn btn-cart') {
        const id = e.target.parentNode.parentNode.id;
        const pid = document.querySelector(`#${id} .card__actions input`).value;

        // POST request to DB with pid
        axios.post(`${baseURL}/cart`, { productId: pid }).then(res => {
            //saveToCartDOM(id);
            const pName = document.querySelector(`#${id} header h1`).innerText;
            showNotification(`${pName} Added to Cart`);
            getCartItems();
        }).catch(err => {
            if (err.response) {
                showNotification(`Oops! Something went wrong! ${err.response.status}`, true);
            }
            else if (err.request) {
                showNotification('Error: No Response From Server', true);
            }
            else {
                showNotification(err.message, true);
            }
        });
    }
});

// Remove Items from Cart function
const cartItems = document.querySelector('.cart-items');
cartItems.addEventListener('click', (e) => {
    //console.log(e.target.className);
    if (e.target.className == 'btn btn-danger') {
        const cartItem = e.target.parentNode.parentNode;
        const pid = cartItem.id.substring(9);

        // POST request to DB with pid
        axios.post(`${baseURL}/cart-delete-item`, { productId: pid }).then(res => {
            let cartPage = document.querySelector('#cart-container .pagination .active').id;
            if (cartItems.childElementCount == 1) cartPage = parseInt(cartPage) - 1;
            getCartItems(cartPage);
            showNotification('Item Removed from Cart');
        }).catch(err => {
            if (err.response) {
                showNotification(`Oops! Something went wrong! ${err.response.status}`, true);
            }
            else if (err.request) {
                showNotification('Error: No Response From Server', true);
            }
            else {
                showNotification(err.message, true);
            }
        });
    }
});


// Pagination for cart
const paginatnCart = document.querySelector('#cart-container .pagination');
paginatnCart.addEventListener('click', (e) => {
    if (e.target.className === 'page') {
        //console.log(e.target.id);
        const page = e.target.id;
        getCartItems(page);
    }
});

// Order checkout function
const btnOrderNow = document.querySelector('.btn-order');
btnOrderNow.addEventListener('click', () => {
    const cartTotAmt = parseFloat(document.getElementById('total-value').innerText);

    if (cartTotAmt > 0) {
        axios.post(`${baseURL}/create-order`, { totAmt: cartTotAmt }).then(res => {
            let msg;
            if (res.data.success == true) {
                cartItems.innerHTML = '';
                const paginationContainer = document.querySelector('#cart-container .pagination');
                paginationContainer.innerHTML = '';
                // Update Cart Total Amount
                document.getElementById('total-value').innerText = (0).toFixed(2);
                // Update cart qty count
                document.querySelector('.cart-number').innerText = 0;

                showNotification(`Order sucessfully placed with order id = ${res.data.orderid}`);
            }
            else showNotification(`Failed to save order details.`, true);
        }).catch(err => {
            if (err.response) {
                showNotification(`Oops! Something went wrong! ${err.response.status}`, true);
            }
            else if (err.request) {
                showNotification('Error: No Response From Server', true);
            }
            else {
                showNotification(err.message, true);
            }
        });
    }
    else {
        showNotification("Your Cart is Empty", true);
    }
});