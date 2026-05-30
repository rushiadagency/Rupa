import React, { useState } from 'react';
import { CartItem, Product, UserProfile } from '../types';
import { X, Plus, Minus, Trash2, ShoppingCart, ShieldCheck, MapPin, Phone, Truck, CheckCircle } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  currentUser: UserProfile;
  onPlaceOrder: (shippingAddress: string, contactPhone: string) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  onUpdateQuantity,
  onRemoveFromCart,
  currentUser,
  onPlaceOrder,
}) => {
  const [shippingAddress, setShippingAddress] = useState(currentUser?.address || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  if (!isOpen) return null;

  // Map cart items to actual product structures
  const cartWithProducts = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  }).filter((item) => item.product !== undefined) as Array<CartItem & { product: Product }>;

  const subtotal = cartWithProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = subtotal > 1500 ? 0 : 99; // Free delivery for orders over ₹1500
  const totalAmount = subtotal + deliveryCharge;

  const handleCheckoutValidation = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!shippingAddress.trim()) {
      setAddressError('Please enter a valid shipping address.');
      valid = false;
    } else {
      setAddressError('');
    }

    if (!contactPhone.trim() || contactPhone.trim().length < 10) {
      setPhoneError('Please enter a valid contact phone number (min 10 digits).');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (valid) {
      const generatedOrderId = `ORD-${Date.now().toString().slice(-6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      onPlaceOrder(shippingAddress, contactPhone);
      setLastPlacedOrderId(generatedOrderId);
      setOrderSuccess(true);
      setIsCheckingOut(false);
    }
  };

  const handleCloseSuccess = () => {
    setOrderSuccess(false);
    setLastPlacedOrderId('');
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 md:p-6">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-sans font-bold text-slate-900">
              {orderSuccess ? 'Order Confirmed!' : `Your Shopping Cart (${cartWithProducts.length})`}
            </h2>
          </div>
          <button
            onClick={orderSuccess ? handleCloseSuccess : onClose}
            id="close-cart-btn"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {orderSuccess ? (
          <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-sans text-slate-900 mb-2">
              Woohoo! order placed successfully!
            </h3>
            <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
              Your order has been recorded. Since you opted for <strong className="text-emerald-700">Cash on Delivery (COD)</strong>, please keep exactly <strong>₹{totalAmount.toLocaleString('en-IN')}</strong> ready at your address during delivery.
            </p>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left w-full max-w-md mb-8 space-y-2.5 text-xs">
              <p className="text-slate-500">
                <span className="font-semibold text-slate-700">Payment Method:</span> Cash on Delivery
              </p>
              <p className="text-slate-500">
                <span className="font-semibold text-slate-700">Shipping to:</span> {shippingAddress}
              </p>
              <p className="text-slate-500">
                <span className="font-semibold text-slate-700">Contact detail:</span> {contactPhone}
              </p>
              <p className="font-bold text-slate-800 border-t border-dashed border-slate-200 pt-2 flex justify-between">
                <span>Total Amount to Pay:</span>
                <span className="font-mono text-emerald-700">₹{totalAmount.toLocaleString('en-IN')}</span>
              </p>
            </div>

            <button
              onClick={handleCloseSuccess}
              id="continue-shopping-success"
              className="w-full max-w-sm bg-slate-900 text-white hover:bg-slate-800 font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow"
            >
              Back to Store
            </button>
          </div>
        ) : (
          /* Normal content */
          <div className="flex-grow overflow-y-auto flex flex-col md:flex-row h-full">
            
            {/* Left side: Cart Items or Empty state */}
            <div className={`p-4 md:p-6 flex-grow flex flex-col ${isCheckingOut ? 'hidden md:flex md:w-1/2 border-r border-slate-100' : 'w-full'}`}>
              {cartWithProducts.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center flex-grow">
                  <ShoppingCart className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-slate-500 font-medium mb-1">Your cart is feeling light!</p>
                  <p className="text-xs text-slate-400 mb-4">Add or select fine items from our curated Indian women's accessories catalog.</p>
                  <button
                    onClick={onClose}
                    className="text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <div className="space-y-4 flex-grow">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Item Selected</p>
                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {cartWithProducts.map((item) => (
                      <div key={item.productId} className="flex gap-3 items-center bg-slate-50 border border-slate-50 rounded-xl p-2.5">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-semibold text-slate-800 truncate mb-0.5">{item.product.name}</h4>
                          <span className="text-xs font-mono font-bold text-slate-900">
                            ₹{item.product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        {/* Adjust qty */}
                        <div className="flex items-center border border-slate-200 bg-white rounded-lg px-1.5 py-0.5 shadow-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:text-indigo-600 transition-colors text-slate-400"
                            id={`decrease-qty-${item.productId}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono text-xs font-bold text-slate-700">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 hover:text-indigo-600 transition-colors text-slate-400 disabled:opacity-30"
                            id={`increase-qty-${item.productId}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => onRemoveFromCart(item.productId)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          id={`remove-item-${item.productId}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Summary math */}
                  <div className="mt-auto border-t border-slate-100 pt-4 space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        Shipping & Delivery
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {subtotal > 1500 ? 'Free' : 'Standard'}
                        </span>
                      </span>
                      <span className="font-mono">
                        {deliveryCharge === 0 ? '₹0' : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-sans text-sm font-bold text-slate-800 border-t border-dashed border-slate-100 pt-2.5">
                      <span>Grand Total</span>
                      <span className="font-mono text-indigo-700 text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>

                    {!isCheckingOut && (
                      <button
                        onClick={() => setIsCheckingOut(true)}
                        id="proceed-checkout-btn"
                        className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow"
                      >
                        Proceed to Checkout
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Checkout credentials form */}
            {(isCheckingOut && cartWithProducts.length > 0) && (
              <div className="p-4 md:p-6 bg-slate-50 flex-grow md:w-1/2 flex flex-col justify-between">
                <form onSubmit={handleCheckoutValidation} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">COD Shipping Credentials</h3>
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="text-xs text-indigo-600 hover:underline md:hidden"
                    >
                      Back to Cart Items
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal">
                    We offer safe regional deliveries. Payment is processed in cash or QR scan at your doorstep upon receipt.
                  </p>

                  {/* Customer Information (Read-only labels) */}
                  <div className="bg-white border border-slate-100 rounded-xl p-3 text-xs space-y-1.5 shadow-xs">
                    <p className="text-slate-400 font-medium">Customer Profile Information</p>
                    <p className="font-semibold text-slate-800">{currentUser?.name || 'Guest User'}</p>
                    <p className="text-slate-500 font-mono">{currentUser?.email || 'guest@example.com'}</p>
                  </div>

                  {/* Shipping address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Shipping Field Address *
                    </label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      id="shipping-address-input"
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden bg-white text-slate-800"
                      placeholder="Street name, House/Flat No, Landmark, City, State, ZIP code"
                      required
                    />
                    {addressError && <p className="text-[10px] text-rose-500 mt-0.5">{addressError}</p>}
                  </div>

                  {/* Contact phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Contact Telephone Number *
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      id="contact-phone-input"
                      className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden bg-white text-slate-800 font-mono"
                      placeholder="e.g. +91 98765 43210"
                      required
                    />
                    {phoneError && <p className="text-[10px] text-rose-500 mt-0.5">{phoneError}</p>}
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100/50 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-800">
                    <Truck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold">Cash on Delivery (COD) Selected</p>
                      <p className="text-[10px] text-emerald-600 leading-normal">
                        Pay safe upon receiving. No pre-payment required. Delivery agent will call you.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="hidden md:block w-1/3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      id="confirm-order-btn"
                      className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" /> Place Cash On Delivery Order
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
