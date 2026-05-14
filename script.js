const cartCountEl = document.getElementById('cart-count');
const addButtons = document.querySelectorAll('.btn-cart');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
let count = 0;

addButtons.forEach((button) => {
  button.addEventListener('click', () => {
    count += 1;
    cartCountEl.textContent = count;
    button.textContent = 'Added';
    button.disabled = true;
    button.style.opacity = '0.85';
    setTimeout(() => {
      button.textContent = 'Add to cart';
      button.disabled = false;
      button.style.opacity = '1';
    }, 1000);
  });
});

mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});
