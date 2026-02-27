// ===========================================
// JANGRA'S HAVELI - COMPLETE SCRIPT.JS
// Your Google Apps Script URL is included!
// ===========================================

// 🔴 YOUR GOOGLE APPS SCRIPT URL - I've put it here for you!
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7i67V8nUnXkL1DbrLTO1B0qAmMks1nm_vGEh7eh0Dyx29oLF6LZ9GY2B5pkt79ah6/exec";

// 🛒 Shopping Cart Array
let cart = [];

// ===========================================
// 1. ADD TO CART FUNCTION
// ===========================================
function addToCart(name, price) {
    // Check if item already in cart
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].quantity++;
            found = true;
            break;
        }
    }
    
    // If not found, add new item
    if (!found) {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Update cart display
    updateCart();
    
    // Show popup message
    showPopup(`✅ ${name} added to cart!`);
    
    // Make confetti!
    createConfetti();
}

// ===========================================
// 2. UPDATE CART DISPLAY
// ===========================================
function updateCart() {
    // Update cart counter
    let totalItems = 0;
    for (let i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity;
    }
    document.getElementById('cartCount').textContent = totalItems;
    
    // Update cart items list
    let cartHtml = '';
    let totalPrice = 0;
    
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        cartHtml += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQuantity(${i}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${i}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${i})">✖</button>
                </div>
            </div>
        `;
        totalPrice += item.price * item.quantity;
    }
    
    // Show empty cart message
    if (cart.length === 0) {
        cartHtml = '<p style="text-align: center; padding: 20px;">🛒 Cart is empty! Add some yummy food!</p>';
    }
    
    // Update HTML
    document.getElementById('cartItems').innerHTML = cartHtml;
    document.getElementById('cartTotal').textContent = '₹' + totalPrice;
}

// ===========================================
// 3. CHANGE QUANTITY
// ===========================================
function changeQuantity(index, change) {
    cart[index].quantity += change;
    
    // Remove if quantity becomes 0
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCart();
}

// ===========================================
// 4. REMOVE ITEM FROM CART
// ===========================================
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
    showPopup('🗑️ Item removed');
}

// ===========================================
// 5. OPEN CART SIDEBAR
// ===========================================
function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
}

// ===========================================
// 6. CLOSE CART SIDEBAR
// ===========================================
function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
}

// ===========================================
// 7. SHOW CHECKOUT FORM
// ===========================================
function showCheckout() {
    if (cart.length === 0) {
        showPopup('❌ Cart is empty! Add some food first!');
        return;
    }
    document.getElementById('checkoutForm').classList.add('show');
}

// ===========================================
// 8. CLOSE CHECKOUT FORM
// ===========================================
function closeCheckout() {
    document.getElementById('checkoutForm').classList.remove('show');
}

// ===========================================
// 9. PLACE ORDER - SENDS EMAIL TO YOU! 📧
// ===========================================
function placeOrder() {
    // Get customer details
    let name = document.getElementById('customerName').value;
    let phone = document.getElementById('customerPhone').value;
    let address = document.getElementById('customerAddress').value;
    
    // Check if all fields are filled
    if (!name || !phone || !address) {
        showPopup('❌ Please fill all details!');
        return;
    }
    
    // Calculate total
    let total = 0;
    for (let item of cart) {
        total += item.price * item.quantity;
    }
    
    // Prepare order data
    let orderData = {
        name: name,
        phone: phone,
        address: address,
        items: cart,
        total: total
    };
    
    // Show loading message
    showPopup('⏳ Sending order to dhruvk.kala@gmail.com...');
    
    // Create a form to send data to Google Apps Script
    let form = document.createElement('form');
    form.method = 'POST';
    form.action = APPS_SCRIPT_URL;
    form.target = 'hiddenFrame';
    
    // Add data as hidden input
    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'data';
    input.value = JSON.stringify(orderData);
    form.appendChild(input);
    
    // Create hidden iframe to receive response
    let iframe = document.createElement('iframe');
    iframe.name = 'hiddenFrame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Submit form
    document.body.appendChild(form);
    form.submit();
    
    // Success message
    showPopup('✅ ORDER PLACED! Email sent to dhruvk.kala@gmail.com! 🎉');
    
    // Clear cart
    cart = [];
    updateCart();
    closeCart();
    closeCheckout();
    
    // Clear input fields
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    
    // Make LOTS of confetti!
    for (let i = 0; i < 5; i++) {
        setTimeout(createConfetti, i * 200);
    }
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
    }, 1000);
}

// ===========================================
// 10. SHOW POPUP MESSAGE
// ===========================================
function showPopup(message) {
    let popup = document.getElementById('popupMessage');
    popup.innerHTML = `<p>${message}</p>`;
    popup.classList.add('show');
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

// ===========================================
// 11. CONFETTI FUNCTIONS 🎉
// ===========================================
function createConfetti() {
    for (let i = 0; i < 30; i++) {
        createConfettiPiece();
    }
}

function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.background = getRandomColor();
    confetti.style.borderRadius = '50%';
    confetti.style.zIndex = '9999';
    confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
    confetti.style.pointerEvents = 'none';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 5000);
}

function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ff9f1c', '#2ecc71', '#f093fb'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ===========================================
// 12. ADD CONFETTI ANIMATION TO PAGE
// ===========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// ===========================================
// 13. WELCOME MESSAGE WHEN PAGE LOADS
// ===========================================
window.onload = function() {
    showPopup('✨ Welcome to Jangra\'s Haveli! ✨');
    
    // Also log to console
    console.log('🎪 Jangra\'s Haveli website loaded!');
    console.log('📧 Emails will go to: dhruvk.kala@gmail.com');
}