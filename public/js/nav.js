
// Navigation - hamburger
const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const cartContainer = document.getElementById('cart-container');

backdrop.addEventListener('click', () => {
    backdrop.style.display = 'none';
    sideDrawer.classList.remove('open');
    cartContainer.classList.remove('active');
});

menuToggle.addEventListener('click', () => {
    backdrop.style.display = 'block';
    sideDrawer.classList.add('open');
    cartContainer.classList.remove('active');
});