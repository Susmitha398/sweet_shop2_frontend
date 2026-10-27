import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const calculateItemPrice = (sweet, weight) => {
  if (!sweet) return 0;
  const basePrice = sweet.pricePerKg || 500;
  if (!weight) return Math.round(basePrice * 0.52);

  const opt = sweet.weightOptions?.find(o => o.weight === weight);
  if (opt) {
    return Math.round(basePrice * opt.multiplier);
  }
  if (weight === '250g') return Math.round(basePrice * 0.28);
  if (weight === '500g') return Math.round(basePrice * 0.52);
  if (weight === '1kg') return Math.round(basePrice * 1.0);
  return Math.round(basePrice * 0.52);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    localStorage.setItem('royal_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3200);
  };

  const addToCart = (sweet, weight = '500g', quantity = 1) => {
    const unitPrice = calculateItemPrice(sweet, weight);
    const itemKey = `${sweet.id || sweet._id}_${weight}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * unitPrice
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            itemKey,
            sweetId: sweet.id || sweet._id,
            slug: sweet.slug,
            name: sweet.name,
            category: sweet.category,
            image: sweet.image,
            shopLocation: sweet.shopLocation,
            weight,
            unitPrice,
            quantity,
            itemTotal: unitPrice * quantity
          }
        ];
      }
    });

    showToast(`Added ${quantity}x ${sweet.name} (${weight}) to Cart! 🛒`);
  };

  const updateQuantity = (itemKey, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.itemKey === itemKey) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              itemTotal: newQty * item.unitPrice
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemKey) => {
    setCartItems(prev => prev.filter(item => item.itemKey !== itemKey));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SWEET10' || clean === 'ROYAL10') {
      setAppliedPromo({ code: clean, discountPercent: 10 });
      showToast('Promo Code applied: 10% Extra Festive Discount! 🎉');
      return { success: true, message: 'Promo applied! 10% OFF' };
    } else if (clean === 'SWEET20' || clean === 'FESTIVE20') {
      setAppliedPromo({ code: clean, discountPercent: 20 });
      showToast('Mega Offer applied: 20% OFF! 🎊');
      return { success: true, message: 'Promo applied! 20% OFF' };
    } else {
      showToast('Invalid Coupon Code. Try SWEET10', 'error');
      return { success: false, message: 'Invalid promo code' };
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);
  const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 40;
  const discount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        deliveryFee,
        discount,
        totalAmount,
        appliedPromo,
        promoCode,
        setPromoCode,
        applyPromo,
        removePromo,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
