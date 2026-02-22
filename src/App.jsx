import { useState, useEffect } from 'react';
import data from './data.json'; // Use relative path for JSON
import './index.css';

// Reference public assets directly via root-relative strings
const addToCartIcon = '/images/icon-add-to-cart.svg';
const removeItemIcon = '/images/icon-remove-item.svg';
const incrementIcon = '/images/icon-increment-quantity.svg';
const decrementIcon = '/images/icon-decrement-quantity.svg';
const carbonNeutralIcon = '/images/icon-carbon-neutral.svg';
const emptyCartImg = '/images/illustration-empty-cart.svg';
const confirmedIcon = '/images/icon-order-confirmed.svg';

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('product_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  useEffect(() => {
    localStorage.setItem('product_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const updateQuantity = (name, delta) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.name === name 
          ? { ...item, quantity: item.quantity + delta } 
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (name) => {
    setCart(cart.filter(item => item.name !== name));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleStartNewOrder = () => {
    setCart([]);
    localStorage.removeItem('product_cart');
    setIsOrderConfirmed(false);
    window.scrollTo(0, 0);
  };

  return (
    <main className="app-container">
      <div className="content-wrapper">
        <section className="products-section">
          <h1 className="main-title">Desserts</h1>
          <div className="product-grid">
            {data.map((dessert) => {
              const cartItem = cart.find(item => item.name === dessert.name);
              return (
                <div key={dessert.name} className="product-card">
                  <div className="image-container">
                    <picture>
                      <source media="(min-width: 1024px)" srcSet={dessert.image.desktop} />
                      <source media="(min-width: 640px)" srcSet={dessert.image.tablet} />
                      <img 
                        src={dessert.image.mobile} 
                        alt={dessert.name} 
                        className={`product-image ${cartItem ? 'active' : ''}`} 
                      />
                    </picture>
                    
                    {!cartItem ? (
                      <button className="add-to-cart-btn" onClick={() => addToCart(dessert)}>
                        <img src={addToCartIcon} alt="" /> Add to Cart
                      </button>
                    ) : (
                      <div className="quantity-control">
                        <button className="qty-btn" onClick={() => updateQuantity(dessert.name, -1)}>
                          <img src={decrementIcon} alt="minus" />
                        </button>
                        <span className="qty-number">{cartItem.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(dessert.name, 1)}>
                          <img src={incrementIcon} alt="plus" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="product-info">
                    <p className="product-category">{dessert.category}</p>
                    <h3 className="product-name">{dessert.name}</h3>
                    <p className="product-price">${dessert.price.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="cart-container">
          <h2 className="cart-title">Your Cart ({cartCount})</h2>
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <img src={emptyCartImg} alt="Empty Cart" />
              <p>Your added items will appear here</p>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.name} className="cart-item">
                    <div className="cart-item-info">
                      <p className="item-name">{item.name}</p>
                      <div className="item-details">
                        <span className="item-qty">{item.quantity}x</span>
                        <span className="item-unit-price">@ ${item.price.toFixed(2)}</span>
                        <span className="item-total-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.name)}>
                      <img src={removeItemIcon} alt="Remove" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-total-section">
                <span>Order Total</span>
                <span className="total-amount">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="carbon-neutral-notice">
                <img src={carbonNeutralIcon} alt="" />
                <p>This is a <span>carbon-neutral</span> delivery</p>
              </div>
              <button className="confirm-order-btn" onClick={() => setIsOrderConfirmed(true)}>
                Confirm Order
              </button>
            </>
          )}
        </aside>
      </div>

      {isOrderConfirmed && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img src={confirmedIcon} alt="" className="modal-icon" />
            <h1 className="modal-headline">Order Confirmed</h1>
            <p className="modal-subtext">We hope you enjoy your food!</p>
            
            <div className="modal-summary-box">
              <div className="summary-scroll-area">
                {cart.map((item) => (
                  <div key={item.name} className="summary-item">
                    <div className="summary-item-content">
                      <img src={item.image.thumbnail} alt="" className="summary-thumb" />
                      <div className="summary-text">
                        <p className="summary-name">{item.name}</p>
                        <div className="summary-prices">
                          <span className="summary-qty">{item.quantity}x</span>
                          <span className="summary-unit">@ ${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="summary-final-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="summary-total-row">
                <span>Order Total</span>
                <span className="summary-grand-total">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button className="start-new-btn" onClick={handleStartNewOrder}>
              Start New Order
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;