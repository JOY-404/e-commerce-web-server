const baseURL = 'http://54.149.19.138:3000';

// pagination for products
const paginatnProducts = document.querySelector('main .pagination');
paginatnProducts.addEventListener('click', (e) => {
    if (e.target.className === 'page') {
        //console.log(e.target.id);
        const page = e.target.id;
        getProducts(page);
    }
});


// Add products & cartItems from server
document.addEventListener('DOMContentLoaded', () => {
    getProducts();
    getCartItems();
});

function getProducts(page) {
    let getUrl = `${baseURL}/products`;
    if (page) getUrl += `?page=${page}`;
    //console.log(getUrl);

    axios.get(getUrl).then(res => {
        const products = res.data.products;
        const currPage = res.data.currPage;
        const hasNextPage = res.data.hasNextPage;
        const hasPrevPage = res.data.hasPrevPage;
        const nextPage = res.data.nextPage;
        const prevPage = res.data.prevPage;
        const lastPage = res.data.lastPage;

        gridItems.innerHTML = '';
        const paginationContainer = document.querySelector('main .pagination');
        paginationContainer.innerHTML = '';

        if (products.length > 0) {

            products.forEach(product => {
                const prodElement = document.createElement('article');
                prodElement.className = 'card product-item';
                prodElement.setAttribute('id', `item${product.id}`);
                prodElement.innerHTML = `<header class="card__header">
                    <h1 class="product__title">
                        ${product.title}
                    </h1>
                </header>
                <div class="card__image">
                    <img src="${product.imageUrl}" alt="${product.title}">
                </div>
                <div class="card__content">
                    <h2 class="product__price"><span>₹ <span>${product.price}</span></span>
                    </h2>
                </div>
                <div class="card__actions">
                    <!-- <a href="" class="btn btn-detail">Details</a> -->
                    <button class="btn btn-cart">Add to Cart</button>
                    <input type="hidden" value="${product.id}">
                </div>`;
                gridItems.appendChild(prodElement);
            });
            let pageInnerHTML = '';
            if (currPage != 1 && prevPage != 1) {
                pageInnerHTML += `<span class='page' id='1'>1</span>`;
                if (prevPage - 1 != 1) pageInnerHTML += '...';
            }
            if (hasPrevPage)
                pageInnerHTML += `<span class='page' id='${prevPage}'>${prevPage}</span>`;
            pageInnerHTML += `<span class='page active' id='${currPage}'>${currPage}</span>`;
            if (hasNextPage)
                pageInnerHTML += `<span class='page' id='${nextPage}'>${nextPage}</span>`;
            if (lastPage != currPage && nextPage != lastPage) {
                if (nextPage + 1 != lastPage) pageInnerHTML += '...';
                pageInnerHTML += `<span class='page' id='${lastPage}'>${lastPage}</span>`;
            }
            paginationContainer.innerHTML = pageInnerHTML;
        }
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

function getCartItems(page) {
    let getUrl = `${baseURL}/cart`;
    if (page) getUrl += `?page=${page}`;

    axios.get(getUrl).then(res => {
        const products = res.data.products;
        const currPage = parseInt(res.data.currPage);
        const hasNextPage = res.data.hasNextPage;
        const hasPrevPage = res.data.hasPrevPage;
        const nextPage = parseInt(res.data.nextPage);
        const prevPage = parseInt(res.data.prevPage);
        const lastPage = parseInt(res.data.lastPage);
        const cartTotPrice = res.data.cartTotPrice;
        const totalQty = res.data.cartTotQty;

        cartItems.innerHTML = '';
        const paginationContainer = document.querySelector('#cart-container .pagination');
        paginationContainer.innerHTML = '';
        if (products.length > 0) {
            products.forEach(product => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-row';
                cartItemElement.setAttribute('id', `cart-item${product.id}`);
                const totAmt = parseFloat(product.price) * parseFloat(product.cartItems.quantity);
                cartItemElement.innerHTML = `<span class='cart-item cart-col'>
                            <img class='cart-img' src="${product.imageUrl}" alt="">
                            <span>${product.title}</span>
                        </span>
                        <span class='cart-price cart-col'>₹&nbsp;<span>${totAmt.toFixed(2)}</span></span>
                        <span class='cart-qty cart-col'>
                            <input type="text" value='${product.cartItems.quantity}' readonly>
                            <button class="btn btn-danger">REMOVE</button>
                        </span>`;
                cartItems.appendChild(cartItemElement);
            });
            let pageInnerHTML = '';
            if (currPage != 1 && prevPage != 1) {
                pageInnerHTML += `<span class='page' id='1'>1</span>`;
                if (prevPage - 1 != 1) pageInnerHTML += '...';
            }
            if (hasPrevPage)
                pageInnerHTML += `<span class='page' id='${prevPage}'>${prevPage}</span>`;
            pageInnerHTML += `<span class='page active' id='${currPage}'>${currPage}</span>`;
            if (hasNextPage)
                pageInnerHTML += `<span class='page' id='${nextPage}'>${nextPage}</span>`;
            if (lastPage != currPage && nextPage != lastPage) {
                if (nextPage + 1 != lastPage) pageInnerHTML += '...';
                pageInnerHTML += `<span class='page' id='${lastPage}'>${lastPage}</span>`;
            }
            paginationContainer.innerHTML = pageInnerHTML;
        }
        // Update Cart Total Amount
        document.getElementById('total-value').innerText = cartTotPrice.toFixed(2);
        // Update cart qty count
        document.querySelector('.cart-number').innerText = totalQty;
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