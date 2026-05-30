import React, { useState, useEffect } from 'react';
import { Product, Order, UserProfile, CartItem, OrderStatus } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from './data';
import { ProductCard } from './components/ProductCard';
import { CartModal } from './components/CartModal';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { 
  ShoppingBag, Heart, ShieldAlert, Sparkles, Search, SlidersHorizontal, 
  IndianRupee, Library, Phone, MapPin, BadgePercent, ThumbsUp, BookMarked, Layers, User,
  Lock, X
} from 'lucide-react';

export default function App() {
  // Load States from Local Storage or load seed defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rupeestore_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rupeestore_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('rupeestore_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('rupeestore_current_user');
    if (savedUser) return JSON.parse(savedUser);
    // Auto login first user (Rupa Sharma) as default interactive session
    return INITIAL_USERS[0];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rupeestore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('rupeestore_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Role selector
  const [role, setRole] = useState<'user' | 'admin'>('user');

  // Admin Verification state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('rupeestore_admin_authenticated') === 'true';
  });

  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    localStorage.setItem('rupeestore_admin_authenticated', String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.trim() === 'admin@rupeestore.com' && adminPassword === 'welcomeadmin@55') {
      setIsAdminAuthenticated(true);
      setRole('admin');
      setAdminLoginOpen(false);
      setAdminEmail('');
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError('Invalid administrative credentials. Please try again.');
    }
  };

  // UI view controls
  const [activeUserView, setActiveUserView] = useState<'shop' | 'dashboard'>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('rupeestore_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rupeestore_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rupeestore_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rupeestore_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rupeestore_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('rupeestore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rupeestore_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Handle Cart Operations
  const handleAddToCart = (productId: string, qty: number = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        // Enforce inventory stock safety limits
        const totalQty = Math.min(existing.quantity + qty, product.stock);
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: totalQty } : item
        );
      }
      return [...prev, { productId, quantity: Math.min(qty, product.stock) }];
    });
    // Visual feedback
    alert(`"${product.name}" added to shopping cart!`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(quantity, product.stock) } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Wishlist actions
  const handleWishlistToggle = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // Place Call on Delivery Order
  const handlePlaceOrder = (shippingAddress: string, contactPhone: string) => {
    if (!currentUser || cart.length === 0) return;

    // Build unique ID
    const newOrderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems = cart.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      return {
        productId: item.productId,
        name: prod.name,
        price: prod.price,
        quantity: item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal > 1500 ? 0 : 99;

    const newOrder: Order = {
      id: newOrderId,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      items: orderItems,
      totalAmount: subtotal + delivery,
      shippingAddress,
      contactPhone,
      paymentMethod: 'Cash on Delivery',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    // Safe inventory subtraction
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartMatch = cart.find((c) => c.productId === p.id);
        if (cartMatch) {
          return {
            ...p,
            stock: Math.max(0, p.stock - cartMatch.quantity),
          };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart
  };

  // Admin Actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((c) => c.productId !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleUpdateUserProfile = (updatedUser: UserProfile) => {
    // Check if modifying current user
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleDeleteUserProfile = (userId: string) => {
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleResetDatabase = () => {
    localStorage.removeItem('rupeestore_products');
    localStorage.removeItem('rupeestore_orders');
    localStorage.removeItem('rupeestore_users');
    localStorage.removeItem('rupeestore_cart');
    localStorage.removeItem('rupeestore_wishlist');
    
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCart([]);
    setWishlist([]);
    setActiveUserView('shop');
    alert('Local database re-seeded successfully back to 15 standard products and template records!');
  };

  // Dynamic Filtering logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Helper computed variables
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Authenticate session if logout happens
  const logoutSession = () => {
    setCurrentUser(null);
    setActiveUserView('shop');
  };

  const handleQuickLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveUserView('dashboard');
  };

  return (
    <div id="applet-container" className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-600 selection:text-white antialiased flex flex-col justify-between">
      
      {/* Dynamic Promotion Ribbons */}
      <div className="bg-gradient-to-r from-teal-900 via-indigo-900 to-slate-900 text-white text-[11px] py-2 px-4 font-mono text-center flex items-center justify-center gap-2 relative">
        <BadgePercent className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>FAST FESTIVAL VALUE: Free COD Courier Delivery for all local receipts above ₹1,500!</span>
      </div>

      {/* Main Header navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 fill-indigo-200" />
            </div>
            <div>
              <h1 id="brand-title" className="text-sm md:text-base font-extrabold tracking-tight text-slate-900 font-sans">
                RupeeStore
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block -mt-1 font-mono">
                Indian Crafts & Essentials
              </span>
            </div>
          </div>

          {/* Role Switching Interactive Widget */}
          <div className="flex items-center border border-slate-200 bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => {
                setRole('user');
                setActiveUserView('shop');
              }}
              id="switch-role-user"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'user'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Library className="w-3.5 h-3.5 text-indigo-500" />
              <span>Customer View</span>
            </button>
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setRole('admin');
                } else {
                  setAdminLoginOpen(true);
                }
              }}
              id="switch-role-admin"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                role === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs animate-pulse'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>Admin Console</span>
            </button>
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setIsAdminAuthenticated(false);
                  setRole('user');
                  setActiveUserView('shop');
                  alert('Admin session signed out successfully.');
                }}
                className="text-[10px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200/50 px-2 py-1 rounded-lg cursor-pointer"
                title="De-authenticate admin authorization"
              >
                Sign Out Admin
              </button>
            )}
          </div>

          {/* Shopping utilities / User Session Indicators */}
          {role === 'user' && (
            <div className="flex items-center gap-2">
              
              {/* Go to Active Storefront or account */}
              <button
                onClick={() => {
                  if (activeUserView === 'shop') {
                    if (currentUser) {
                      setActiveUserView('dashboard');
                    } else {
                      alert('Please login/select one profile to access user dashboard.');
                    }
                  } else {
                    setActiveUserView('shop');
                  }
                }}
                id="toggle-shop-view"
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  activeUserView === 'dashboard'
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-750 bg-white'
                }`}
              >
                {activeUserView === 'dashboard' ? (
                  <>
                    <Library className="w-3.5 h-3.5" />
                    <span>Back to Shop</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{currentUser ? currentUser.name.split(' ')[0] : 'My Account'}</span>
                  </>
                )}
              </button>

              {/* Wishlist summary count */}
              <button
                onClick={() => {
                  if (currentUser) {
                    setActiveUserView('dashboard');
                    // wait for react cycle
                    setTimeout(() => {
                      const tabWishlist = document.getElementById('tab-wishlist');
                      if (tabWishlist) tabWishlist.click();
                    }, 50);
                  } else {
                    alert('Log in to see saves.');
                  }
                }}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl relative border border-slate-100 text-slate-600"
                title={`${wishlist.length} items wishlisted`}
              >
                <Heart className="w-4 h-4 text-rose-500" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 px-1 min-w-[16px] text-[8px] font-bold text-center -right-1 text-white bg-rose-600 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping bag totals */}
              <button
                onClick={() => setCartOpen(true)}
                id="header-cart-btn"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all relative active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
                  {cartItemCount}
                </span>
              </button>

            </div>
          )}

        </div>
      </header>

      {/* Primary Workspace Body */}
      <main id="main-content" className="max-w-7xl mx-auto w-full px-4 py-8 flex-grow">
        
        {/* CURRENT ACTIVE VIEW SECTOR */}
        {role === 'admin' ? (
          
          /* ADMIN WORKSPACE */
          <AdminPanel
            products={products}
            orders={orders}
            users={users}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateUserProfile={handleUpdateUserProfile}
            onDeleteUserProfile={handleDeleteUserProfile}
            onResetDatabase={handleResetDatabase}
          />

        ) : (

          /* CUSTOMER (USER) WORKSPACE */
          activeUserView === 'dashboard' && currentUser ? (
            
            /* USER ACCOUNT DASHBOARD */
            <div className="space-y-6">
              <div className="mb-4">
                <button
                  onClick={() => setActiveUserView('shop')}
                  className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                >
                  ← Continue Exploring Storefront
                </button>
              </div>
              <UserDashboard
                currentUser={currentUser}
                orders={orders}
                wishlist={wishlist}
                products={products}
                onUpdateProfile={handleUpdateUserProfile}
                onRemoveFromWishlist={handleWishlistToggle}
                onAddToCart={handleAddToCart}
                onLogout={logoutSession}
              />
            </div>

          ) : (

            /* SHOP STOREFRONT */
            <div className="space-y-8">
              
              {/* If no user logged in, provide a quick-login demographic simulator header */}
              {!currentUser && (
                <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-base">👤</span>
                    <div>
                      <p className="font-bold text-amber-900">Demographic Simulation Login Required</p>
                      <p className="text-amber-800 text-[11px]">Since this is a simulated storefront with local storage, please choose a client profile to explore customized dashboards.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {users.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleQuickLogin(item)}
                        className="bg-white hover:bg-slate-50 border border-amber-205 text-amber-900 font-bold px-3 py-1.5 rounded-lg text-[10px] shadow-xs"
                      >
                        Explore as {item.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Curated Visual Promo Hero Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white min-h-[220px] p-6 md:p-12 flex flex-col justify-center shadow-lg border border-slate-800">
                <div className="absolute inset-0 opacity-15 overflow-hidden">
                  <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-300 via-purple-700 to-transparent"></div>
                </div>
                
                <div className="max-w-md relative z-10 space-y-3.5">
                  <div className="inline-flex items-center gap-1 bg-white/10 border border-white/10 rounded-full px-3 py-1 font-mono text-[10px] tracking-wider uppercase font-semibold text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5" /> Authenticated Local Bazaar
                  </div>
                  <h2 className="text-xl md:text-3xl font-extrabold tracking-tight font-sans">
                    Handmade Indian Heritage
                  </h2>
                  <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed">
                    Explore 15 distinct artisanal apparel ranges, premium accessories, and organic ayurvedic selections. Prices range strictly between ₹500 and ₹1,000 for local collection accessibility.
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-emerald-400">✅ Cash On Delivery</span>
                    <span>•</span>
                    <span>✅ Live Admin Management</span>
                  </div>
                </div>
              </div>

              {/* Filtering Controls Panel */}
              <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
                
                {/* Free Search Text */}
                <div className="relative flex-grow min-w-[240px]">
                  <span className="absolute left-3.5 top-2.5 text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 rounded-xl bg-white text-xs text-slate-800"
                    placeholder="Search by product names or materials..."
                  />
                </div>

                {/* Categories filtering bubble select */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Category:
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-650 border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Price range filter (₹500 - ₹1000) */}
                <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                  <div className="text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Budget Limit</span>
                    <span className="font-mono font-bold text-indigo-700">Under ₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="1000"
                    step="20"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-24 md:w-32 accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                </div>

              </div>

              {/* GRID OF DELIBERATE PRODUCTS */}
              <div>
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Curated Indian Women's Accessories</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Showing {filteredProducts.length} premium products in native Rupee rates</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Prices within ₹500 - ₹1,000</span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-slate-150 rounded-2xl">
                    <Library className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold text-sm">No items match your active parameters.</p>
                    <p className="text-xs text-slate-450 mt-1">Try relaxing filters or adjusting budget rates above.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setMaxPrice(1000);
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:underline mt-4"
                    >
                      Reset Store Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isWishlisted={wishlist.includes(product.id)}
                        onWishlistToggle={() => handleWishlistToggle(product.id)}
                        onAddToCart={() => handleAddToCart(product.id)}
                        onViewDetails={() => setSelectedProduct(product)}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          )

        )}

      </main>

      {/* Cart & Checkout popup modal */}
      {currentUser && (
        <CartModal
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          products={products}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          currentUser={currentUser}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {/* Product quick info details modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={selectedProduct !== null}
          onClose={() => setSelectedProduct(null)}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onWishlistToggle={() => handleWishlistToggle(selectedProduct.id)}
          onAddToCart={() => {
            handleAddToCart(selectedProduct.id);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Footer bar */}
      <footer className="bg-slate-900 text-white mt-12 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          
          <div className="space-y-1">
            <p className="font-sans font-bold text-white text-sm">RupeeStore E-Commerce Ltd.</p>
            <p className="leading-relaxed text-[11px]">Sustainably curated regional clothing items, home decors, and organic personal beauty selections.</p>
            <p className="font-mono text-[10px] text-zinc-500">Local GMT time context: 2026-05-29 | Powered by React and local database simulation.</p>
          </div>

          {/* Admin Login Portal Link and Credentials */}
          <div className="flex flex-col items-center md:items-end gap-1.5 bg-slate-850 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <button
                onClick={() => {
                  if (isAdminAuthenticated) {
                    setRole('admin');
                  } else {
                    setAdminLoginOpen(true);
                  }
                }}
                id="footer-admin-login-link"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
              >
                Admin Portal Login
              </button>
            </div>
            <div className="text-[10px] text-slate-400 font-mono text-center md:text-right leading-tight">
              User: <span className="font-semibold text-slate-300">admin@rupeestore.com</span><br />
              Pass: <span className="font-semibold text-slate-300">welcomeadmin@55</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-slate-300 font-medium">
            <span className="flex items-center gap-1">🟢 Genuine Cash on Delivery</span>
            <span>•</span>
            <span className="flex items-center gap-1">🛡️ Admin Secure Console</span>
          </div>

        </div>
      </footer>

      {/* Admin Login Dialog Modal */}
      {adminLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-305 scale-100 flex flex-col text-slate-800">
            
            {/* Modal Header banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white text-center relative">
              <button
                onClick={() => {
                  setAdminLoginOpen(false);
                  setAdminError('');
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-amber-550/10 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-3 border border-amber-500/25">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest font-sans">
                Admin Secure Portal
              </h3>
              <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-wider">
                Authorized Executive Access Only
              </p>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
              
              {/* Alert Message for error logs */}
              {adminError && (
                <div className="p-3 bg-rose-50 border border-rose-250 text-rose-700 rounded-xl text-xs font-semibold flex items-start gap-2">
                  <span className="text-base shrink-0 leading-none">⚠️</span>
                  <span>{adminError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Executive Username (Email)
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@rupeestore.com"
                  className="w-full px-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Executive Password
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full px-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white text-slate-900"
                />
              </div>

              {/* Quick credential filler for demo environment comfort */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600">
                <p className="font-bold text-slate-800 mb-1 flex items-center gap-1 text-[11px]">
                  💡 Portal Passcode Reminder:
                </p>
                <div className="space-y-1 font-mono text-[10px] bg-white p-2 rounded-lg border border-slate-100">
                  <div>User ID: <span className="font-bold text-slate-900">admin@rupeestore.com</span></div>
                  <div>Password: <span className="font-bold text-slate-900">welcomeadmin@55</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAdminEmail('admin@rupeestore.com');
                    setAdminPassword('welcomeadmin@55');
                    setAdminError('');
                  }}
                  className="mt-2 text-[10px] font-bold text-indigo-650 hover:text-indigo-805 hover:underline block cursor-pointer transition-colors"
                >
                  ⚡ Autofill Executive Credentials
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdminLoginOpen(false);
                    setAdminError('');
                  }}
                  className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm text-center cursor-pointer"
                >
                  Authorize Access
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
