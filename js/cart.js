// 購物車邏輯（localStorage）

const CART_KEY = 'krsu_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === product.id);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.salePrice ?? product.price ?? 0,
      imageUrl: product.imageUrl || '',
      stock: product.stock ?? 999,
      qty
    });
  }
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function updateCartQty(id, qty) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) {
    if (qty <= 0) cart.splice(idx, 1);
    else cart[idx].qty = qty;
  }
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function loadCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = getCartCount();
}
