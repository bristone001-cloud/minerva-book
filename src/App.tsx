import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import StickyCart from './components/StickyCart';
import CheckoutForm from './components/CheckoutForm';
import CartView from './components/CartView';
import CompletionModal from './components/CompletionModal';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export type AppView = 'list' | 'cart' | 'checkout';

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('minerva_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState<AppView>('list');
  const [completedOrder, setCompletedOrder] = useState<{
    phone: string;
    orderId: string;
    totalAmount: number;
    items: CartItem[];
  } | null>(() => {
    const saved = sessionStorage.getItem('minerva_completed_order');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (completedOrder) {
      sessionStorage.setItem('minerva_completed_order', JSON.stringify(completedOrder));
    } else {
      sessionStorage.removeItem('minerva_completed_order');
    }
  }, [completedOrder]);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('minerva_cart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id: string, name: string, delta: number, price: number, imageUrl?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter(item => item.id !== id);
        }
        return prev.map(item => item.id === id ? { ...item, quantity: newQty } : item);
      } else if (delta > 0) {
        return [...prev, { id, name, quantity: delta, price, imageUrl }];
      }
      return prev;
    });
  };

  const removeProduct = (id: string) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 100000 || subtotal === 0 ? 0 : 4000;
  const finalTotal = subtotal + shippingFee;

  const navigateTo = (nextView: AppView) => {
    if ((nextView === 'cart' || nextView === 'checkout') && totalQty === 0) {
      alert('장바구니에 담긴 상품이 없습니다.');
      return;
    }
    setView(nextView);
    window.scrollTo(0, 0);
  };

  if (completedOrder) {
    return <CompletionModal 
      order={completedOrder}
      onReset={() => {
        setCart([]); // Reset cart for fresh start
        setCompletedOrder(null);
        setView('list');
        window.scrollTo(0,0);
      }}
      onReorder={() => {
        // Keep cart, just reset completion state
        setCompletedOrder(null);
        setView('checkout');
        window.scrollTo(0,0);
      }}
    />;
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: totalQty > 0 ? '120px' : '0' }}>
      <Header cartCount={totalQty} onCartClick={() => navigateTo('cart')} onLogoClick={() => setView('list')} />
      
      <main>
        {view === 'list' && (
          <>
            <Hero />
            <ProductList cart={cart} updateQuantity={updateQuantity} />
          </>
        )}

        {view === 'cart' && (
          <CartView 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeProduct={removeProduct}
            subtotal={subtotal}
            shippingFee={shippingFee}
            finalTotal={finalTotal}
            onContinue={() => setView('list')}
            onCheckout={() => navigateTo('checkout')}
          />
        )}

        {view === 'checkout' && (
          <CheckoutForm 
            cart={cart} 
            subtotal={subtotal}
            shippingFee={shippingFee}
            finalTotal={finalTotal}
            onBackToCart={() => setView('cart')}
            onComplete={(phone, orderId, totalAmount) => {
              console.log('Order completed:', { phone, orderId, totalAmount });
              setCompletedOrder({ phone, orderId, totalAmount, items: [...cart] });
              // Prevent back button
              window.history.pushState(null, '', window.location.href);
            }} 
          />
        )}
      </main>
      
      {totalQty > 0 && view === 'list' && (
        <StickyCart 
          cart={cart} 
          totalQty={totalQty}
          onOpenCart={() => setView('cart')}
        />
      )}
    </div>
  );
}

export default App;

