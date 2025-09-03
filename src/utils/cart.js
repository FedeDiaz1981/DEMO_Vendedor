const KEY = 'calabria_cart_v1';

export function loadCart() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  dispatchEvent(new CustomEvent('cart:updated', { detail: items }));
}

export function addToCart(item) {
  const cart = loadCart();
  // merge by SKU-variant (id + size + color)
  const key = `${item.id}-${item.size}-${item.color}`;
  const existing = cart.find(i => `${i.id}-${i.size}-${i.color}` === key);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function removeFromCart(key) {
  const cart = loadCart().filter(i => `${i.id}-${i.size}-${i.color}` !== key);
  saveCart(cart);
}

export function cartTotal(items = loadCart()) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function clearCart() {
  saveCart([]);
}
