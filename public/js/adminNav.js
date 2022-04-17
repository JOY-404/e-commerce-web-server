
// Navigation - hamburger
const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const productContainer = document.getElementById('product-container');

backdrop.addEventListener('click', () => {
    backdrop.style.display = 'none';
    sideDrawer.classList.remove('open');
    productContainer.classList.remove('active');
});

menuToggle.addEventListener('click', () => {
    backdrop.style.display = 'block';
    sideDrawer.classList.add('open');
    productContainer.classList.remove('active');
});