// ===========================
//  KNOTORIOUS — cart.js
//  Cart + Checkout logic
// ===========================

// ---- Cart State ----
let cart = JSON.parse(localStorage.getItem('knot_cart') || '[]');

function saveCart() {
  localStorage.setItem('knot_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  showToast(`✓ ${p.name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function cartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function updateCartUI() {
  const count = cartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ---- Toast ----
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ---- Payment Details ----
function getPaymentDetails(method) {
  const baseDetails = {
    accountName: "Nida Akram",
    whatsapp: "0328-7611968",
    instagram: "@knotorious.handmade",
    instagramLink: "https://www.instagram.com/knotorious.handmade?igsh=dmJiYTY4eXhlODky"
  };
  
  const methodDetails = {
    easypaisa: {
      number: "0332-0457157",
      instructions: "Open Easypaisa app → Send Money → Enter above number → Pay amount"
    },
    jazzcash: {
      number: "0332-0457157",
      instructions: "Open JazzCash app → Send Money → Enter above number → Pay amount"
    },
    sadapay: {
      number: "0332-0457157",
      instructions: "Open SadaPay app → Send Money → Enter above number → Pay amount"
    },
    nayapay: {
      number: "0328-7611968",
      instructions: "Open NayaPay app → Send Money → Enter above number → Pay amount"
    }
  };
  
  return { ...baseDetails, ...methodDetails[method] };
}

function updatePaymentDetails() {
  const method = selectedPayment.toLowerCase();
  const details = getPaymentDetails(method);
  const paymentInfoDiv = document.getElementById('paymentInfo');
  
  if (paymentInfoDiv) {
    paymentInfoDiv.innerHTML = `
      <div style="background: linear-gradient(135deg, #f9f9f9 0%, #fff 100%); padding: 18px; border-radius: 12px; margin-top: 15px; border: 2px solid #ff6b6b; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="font-weight: bold; margin-bottom: 12px; color: #ff6b6b; font-size: 16px;">💳 Payment Details:</div>
        
        <div style="margin-bottom: 10px; padding: 8px; background: #f0f0f0; border-radius: 8px;">
          <span style="font-weight: 600;">👤 Account Name:</span> ${details.accountName}
        </div>
        
        <div style="margin-bottom: 10px; padding: 8px; background: #f0f0f0; border-radius: 8px;">
          <span style="font-weight: 600;">📱 ${method.toUpperCase()} Number:</span> ${details.number}
        </div>
        
        <div style="font-size: 13px; color: #666; margin-top: 8px; padding: 10px; background: #fff3cd; border-radius: 8px; border-left: 3px solid #ffc107;">
          📝 ${details.instructions}
        </div>
        
        <div style="font-size: 13px; margin-top: 12px; padding: 10px; background: #e8f4f8; border-radius: 8px; border-left: 3px solid #17a2b8;">
          📸 After payment, take screenshot and send here:
          <div style="margin-top: 8px; font-weight: 500;">
            • <a href="https://wa.me/923287611968" target="_blank" style="color: #25D366; text-decoration: none; font-weight: bold;">📲 WhatsApp: ${details.whatsapp} - Click to chat</a><br>
            • <a href="${details.instagramLink}" target="_blank" style="color: #E4405F; text-decoration: none; font-weight: bold;">📸 Instagram: ${details.instagram} (DM) - Click to DM</a>
          </div>
        </div>
      </div>
    `;
  }
}

// ---- Checkout Modal ----
let selectedPayment = "EasyPaisa";

function openCheckout() {
  if (cart.length === 0) { showToast('Cart khali hai! Pehle kuch add karo 🛒'); return; }

  const subtotal = cart.reduce((s, i) => {
    const p = PRODUCTS.find(p => p.id === i.id);
    return s + (p?.salePrice || 0) * i.qty;
  }, 0);
  const total = subtotal + 350;

  const itemsHtml = cart.map(i => {
    const p = PRODUCTS.find(p => p.id === i.id);
    return `<div>• ${p?.name} ×${i.qty} = Rs.${((p?.salePrice || 0) * i.qty).toLocaleString()}</div>`;
  }).join('');

  const summary = document.getElementById('checkoutOrderSummary');
  if (summary) {
    summary.innerHTML = `
      <strong>Your Order:</strong>${itemsHtml}
      <div style="margin-top:8px;font-weight:bold">
        Subtotal: Rs.${subtotal.toLocaleString()}<br>
        Delivery: Rs.350<br>
        <span style="font-size:1.05rem;color:var(--pink)">Total: Rs.${total.toLocaleString()}</span>
      </div>
      <small>⏱️ Handmade: 7–14 days</small>`;
  }

  document.getElementById('checkoutModal')?.classList.add('open');
  updatePaymentDetails();
}

// ---- Order Submit → WhatsApp ----
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // Payment method selection
  document.querySelectorAll('.payment-method').forEach(el => {
    el.addEventListener('click', function () {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
      this.classList.add('selected');
      selectedPayment = this.dataset.method;
      document.getElementById('selectedPayment').value = selectedPayment;
      updatePaymentDetails();
    });
  });
  document.querySelector('.payment-method')?.classList.add('selected');

  // Cart button → open checkout
  document.getElementById('cartBtn')?.addEventListener('click', e => { e.preventDefault(); openCheckout(); });
  document.getElementById('drawerCart')?.addEventListener('click', e => { e.preventDefault(); openCheckout(); });

  // Close modal
  document.getElementById('closeCheckoutBtn')?.addEventListener('click', () =>
    document.getElementById('checkoutModal')?.classList.remove('open'));
  document.getElementById('checkoutModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('checkoutModal'))
      document.getElementById('checkoutModal').classList.remove('open');
  });

  // Order form submit
  document.getElementById('orderForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('custName').value.trim();
    const phone   = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const city    = document.getElementById('custCity').value.trim();
    if (!name || !phone || !address || !city) { showToast('Fill all fields first!'); return; }

    const subtotal = cart.reduce((s, i) => {
      const p = PRODUCTS.find(p => p.id === i.id);
      return s + (p?.salePrice || 0) * i.qty;
    }, 0);
    const total = subtotal + 350;
    const itemsList = cart.map(i => {
      const p = PRODUCTS.find(p => p.id === i.id);
      return `${p?.name} ×${i.qty} = Rs.${(p?.salePrice || 0) * i.qty}`;
    }).join('\n');

    const details = getPaymentDetails(selectedPayment.toLowerCase());
    const message = `🛍️ *NEW ORDER - KNOTORIOUS* 🧶\n\n*Customer:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}, ${city}\n\n*Items:*\n${itemsList}\n\n📦 Delivery: Rs.350\n💰 *Total: Rs.${total}*\n💳 Payment: ${selectedPayment}\n\n💵 Payment Details:\nAccount: ${details.accountName}\nNumber: ${details.number}\nWhatsApp: ${details.whatsapp}\nInstagram: ${details.instagram}\n\n📸 After payment, send screenshot on WhatsApp or Instagram DM `;

    window.open(`https://wa.me/923287611968?text=${encodeURIComponent(message)}`, '_blank');
    cart = [];
    saveCart();
    document.getElementById('checkoutModal')?.classList.remove('open');
    showToast('✅ Order sent. KIndly send payment screenshot on whatsapp or instagaram!');
    document.getElementById('orderForm').reset();
  });
});

// Global expose (for inline onclick)
window.addToCart = addToCart;