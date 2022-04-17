const baseURL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    getOrders();
});

const ordersContainer = document.querySelector('.orders');

function getOrders() {
    let getUrl = `${baseURL}/orders`;

    axios.get(getUrl).then(res => {
        const orders = res.data;
        ordersContainer.innerHTML = '';

        if (orders.length > 0) {
            orders.forEach(order => {
                const orderElement = document.createElement('li');
                orderElement.className = 'orders__item';

                orderElement.innerHTML = `<div class="order-row order-header">
                        <span class="order-col order-date">ORDER PLACED</span>
                        <span class="order-col order-amt">TOTAL</span>
                        <span class="order-col order-id">ORDER #</span>
                    </div>
                    <div class="order-row">
                        <span class="order-col order-date">${formatDate(order.orderDate)}</span>
                        <span class="order-col order-amt">₹ ${order.totalAmt.toFixed(2)}</span>
                        <span class="order-col order-id">${order.id}</span>
                    </div>`;
                const orderItemUL = document.createElement('ul');
                orderItemUL.className = 'orders__products';
                order.products.forEach(product => {
                    console.log(product.orderdetails.totalAmt);
                    const orderItemLI = document.createElement('li');
                    orderItemLI.className = 'orders__products-item';
                    orderItemLI.innerHTML = `<div>
                                <img class='order-img' src="${product.imageUrl}" alt="${product.title}">
                            </div>
                            <div class="orders__products-item-detail">
                                <span class="order-item-name">${product.title}</span>
                                <span class="order-item-qty">Quantity: ${product.orderdetails.quantity}</span>
                                <span class="order-item-amt">₹ ${product.orderdetails.totalAmt.toFixed(2)}</span>
                            </div>`;
                    orderItemUL.appendChild(orderItemLI);
                });
                orderElement.appendChild(orderItemUL);
                ordersContainer.appendChild(orderElement);
            });
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
            console.log(err)
        }
    });
}

function formatDate(date) {
    // use moment.js if any problem arises
    let d = Date.parse(date);
    //let d = new Date(2010, 7, 5);
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return `${da}-${mo}-${ye}`;
}