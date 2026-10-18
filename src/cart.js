const PROMO_CODE = "SAVE10";
const DISCOUNT_PERCENT = 10;
const DISCOUNT_MIN_SUBTOTAL = 20000;
const FREE_DELIVERY_MIN_SUBTOTAL = 50000;
const DELIVERY_PRICE = 30000;

function assertValidQuantity(quantity, stock) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError("Количество должно быть положительным целым числом");
  }
  if (quantity > stock) {
    throw new RangeError("Количество не может превышать остаток на складе");
  }
}

function addToCart(cart, product, quantity) {
  const existing = cart.find((item) => item.id === product.id);

  if (!existing) {
    assertValidQuantity(quantity, product.stock);
    return [...cart, { ...product, quantity }];
  }

  assertValidQuantity(quantity, Infinity);
  assertValidQuantity(existing.quantity + quantity, product.stock);

  return cart.map((item) =>
    item.id === product.id
      ? { ...item, quantity: item.quantity + quantity }
      : item,
  );
}

function changeQuantity(cart, productId, quantity) {
  const existing = cart.find((item) => item.id === productId);

  if (!existing) {
    assertValidQuantity(quantity, Infinity);
    return cart;
  }

  assertValidQuantity(quantity, existing.stock);

  return cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item,
  );
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);

  const discount =
    promoCode === PROMO_CODE && subtotal >= DISCOUNT_MIN_SUBTOTAL
      ? Math.floor((subtotal * DISCOUNT_PERCENT) / 100)
      : 0;

  const delivery = subtotal < FREE_DELIVERY_MIN_SUBTOTAL ? DELIVERY_PRICE : 0;

  return {
    subtotal,
    discount,
    delivery,
    total: subtotal - discount + delivery,
  };
}

const cartApi = {
  addToCart,
  changeQuantity,
  removeFromCart,
  calculateCartSubtotal,
  calculateOrderTotal,
};

if (typeof module !== "undefined") module.exports = cartApi;
if (typeof window !== "undefined") window.cartApi = cartApi;
