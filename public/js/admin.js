const baseURL = 'http://localhost:3000';

const gridItems = document.getElementById('grid-items');
const paginatnProducts = document.querySelector('main .pagination');
const productForm = document.querySelector('.product-form');

// pagination for products
paginatnProducts.addEventListener('click', (e) => {
    if (e.target.className === 'page') {
        //console.log(e.target.id);
        const page = e.target.id;
        getAdminProducts(page);
    }
});

// Add Product - popup
const addProduct1 = document.querySelector('.main-header__item .add-product');
const addProduct2 = document.querySelector('.mobile-nav__item .add-product');
const productClose = document.getElementById('product-close');

addProduct1.addEventListener('click', () => {
    backdrop.style.display = 'block';
    productContainer.classList.add('active');
});

addProduct2.addEventListener('click', () => {
    backdrop.style.display = 'block';
    sideDrawer.classList.remove('open');
    productContainer.classList.add('active');
});

productClose.addEventListener('click', () => {
    backdrop.style.display = 'none';
    productContainer.classList.remove('active');
});

// Add products & cartItems from server
document.addEventListener('DOMContentLoaded', () => {
    getAdminProducts();
});

function getAdminProducts(page) {
    let getUrl = `${baseURL}/admin/products`;
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
                    <button class="btn btn-edit">Edit</button>
                    <button class="btn btn-delete">Delete</button>
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

// Edit/Delete admin products
gridItems.addEventListener('click', (e) => {
    // edit button is clicked
    if (e.target.className == 'btn btn-edit') {
        const id = e.target.parentNode.parentNode.id;
        const pid = document.querySelector(`#${id} .card__actions input`).value;

        axios.get(`${baseURL}/admin/edit-product/${pid}`).then(res => {
            productForm.querySelector('#title').value = res.data.title;
            productForm.querySelector('#imageUrl').value = res.data.imageUrl;
            productForm.querySelector('#price').value = res.data.price;
            productForm.querySelector('#description').innerText = res.data.description;
            productForm.querySelector('#productId').value = pid;
            productForm.querySelector('.btn-add-product').innerText = 'Update Product';
            // Activate popup
            backdrop.style.display = 'block';
            productContainer.classList.add('active');
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
    else if (e.target.className == 'btn btn-delete') {
        // Delete Product
        const id = e.target.parentNode.parentNode.id;
        const pname = document.querySelector(`#${id} .product__title`).innerText;
        const pid = document.querySelector(`#${id} .card__actions input`).value;

        axios.post(`${baseURL}/admin/delete/${pid}`).then(res => {
            if(res.data.success == true) {
                let productPage = document.querySelector('.pagination .active').id;
                if (gridItems.childElementCount == 1) productPage = parseInt(productPage) - 1;
                getAdminProducts(productPage);
                showNotification(`${pname} Deleted Successfully`);
            }
            else if (res.data.msg == "D") {
                showNotification(`Product Already in Use. Cannot be Deleted Now.`, true);
            }
            else {
                showNotification(`Unable to Delete Product`, true);
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
});

// Add/Update admin products
const btnAddProduct = document.querySelector('.btn-add-product');
btnAddProduct.addEventListener('click', () => {
    const pid = productForm.querySelector('#productId').value;
    if (isValidFeilds()) {
        if (pid == '') {
            // add product
            axios.post(`${baseURL}/admin/add-product`, {
                title: productForm.querySelector('#title').value,
                imageUrl: productForm.querySelector('#imageUrl').value,
                price: productForm.querySelector('#price').value,
                description: productForm.querySelector('#description').innerText
            }).then(res => {
                backdrop.style.display = 'none';
                productContainer.classList.remove('active');
                clearEdit();
                getAdminProducts();
                showNotification(`Product Added Successfully`);
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
            // edit product
            axios.post(`${baseURL}/admin/edit-product`, {
                productId: productForm.querySelector('#productId').value,
                title: productForm.querySelector('#title').value,
                imageUrl: productForm.querySelector('#imageUrl').value,
                price: productForm.querySelector('#price').value,
                description: productForm.querySelector('#description').innerText
            }).then(res => {
                backdrop.style.display = 'none';
                productContainer.classList.remove('active');
                clearEdit();
                getAdminProducts();
                showNotification(`Product Updated Successfully`);
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
    }
});

// cancel add products
const btnCancelEdit = document.querySelector('.btn-add-cancel');
btnCancelEdit.addEventListener('click', () => clearEdit());

function clearEdit() {
    productForm.querySelector('#title').value = '';
    productForm.querySelector('#imageUrl').value = '';
    productForm.querySelector('#price').value = '';
    productForm.querySelector('#description').innerText = '';
    productForm.querySelector('#productId').value = '';
    productForm.querySelector('.btn-add-product').innerText = 'Add Product';
}

function isValidFeilds() {
    if (productForm.querySelector('#title').value == '') return false;
    if (productForm.querySelector('#imageUrl').value == '') return false;
    if (productForm.querySelector('#price').value == '') return false;
    return true;
}