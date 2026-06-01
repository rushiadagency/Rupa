import React, { useState, useEffect } from 'react';
import { Product, Order, UserProfile, CartItem, OrderStatus } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from './data';
import { ProductCard } from './components/ProductCard';
import { CartModal } from './components/CartModal';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import { BlogView } from './components/BlogView';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { 
  testSupabaseConnection,
  fetchProducts,
  fetchOrders,
  fetchUsers,
  upsertProduct,
  deleteProductFromDb,
  upsertOrder,
  upsertUser,
  deleteUserFromDb
} from './supabaseService';
import { 
  ShoppingBag, Heart, ShieldAlert, Sparkles, Search, SlidersHorizontal, 
  IndianRupee, Library, Phone, MapPin, BadgePercent, ThumbsUp, BookMarked, Layers, User,
  Lock, X, Database, Star, MessageSquare
} from 'lucide-react';

export default function App() {
  // Supabase State Logger
  const [dbState, setDbState] = useState<{
    loading: boolean;
    connected: boolean | null;
    message: string;
  }>({
    loading: true,
    connected: null,
    message: 'Testing connection to Supabase...'
  });

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

  // Fetch Supabase records asynchronously on page mount
  useEffect(() => {
    async function initSupabaseData() {
      // Test connectivity
      const status = await testSupabaseConnection();
      setDbState({
        loading: false,
        connected: status.connected,
        message: status.message
      });

      // Fetch products, orders, and users from live Supabase Tables
      try {
        const dbProducts = await fetchProducts();
        setProducts(dbProducts);

        const dbOrders = await fetchOrders();
        setOrders(dbOrders);

        const dbUsers = await fetchUsers();
        setUsers(dbUsers);

        // Adjust active user profile sequence
        const savedUser = localStorage.getItem('rupeestore_current_user');
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            setCurrentUser(parsed);
          } catch (_) {
            if (dbUsers.length > 0) setCurrentUser(dbUsers[0]);
          }
        } else if (dbUsers.length > 0) {
          setCurrentUser(dbUsers[0]);
        }
      } catch (err) {
        console.warn("Async Supabase syncing warning:", err);
      }
    }

    initSupabaseData();
  }, []);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('rupeestore_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Carousel/Slide configuration for RupeeStore Theme
  const [carouselIndex, setCarouselIndex] = useState(0);
  const HERO_SLIDES = [
    {
      tag: "#style2026",
      title: "new arrivals",
      description: "It has roots in a piece of classical Latin literature from 45 BC.",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1400&auto=format&fit=crop",
      linkText: "EXPLORE NOW",
      categoryFilter: "All"
    },
    {
      tag: "#jewelscraft",
      title: "fine artifacts",
      description: "Intricately designed traditional Indian handcrafted gold jewelry art.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
      linkText: "SHOP JEWELRY",
      categoryFilter: "Jewelry"
    },
    {
      tag: "#heritagezari",
      title: "luxury scarves",
      description: "Premium pure zari, wool, and hand-embroidered heritage pashminas.",
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop",
      linkText: "DISCOVER WEAVES",
      categoryFilter: "Scarves & Shawls"
    }
  ];

  // User reviews state
  const [reviews, setReviews] = useState<{ id: string; name: string; product: string; rating: number; text: string; date: string; verified: boolean }[]>(() => {
    const saved = localStorage.getItem('rupeestore_reviews');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'rev-1',
        name: 'Deepika Sharma',
        product: 'Pure Mulberry Silk Scarf',
        rating: 5,
        text: 'The texture is absolute bliss! Extremely premium fabric, feels like royalty. Excellent cash on delivery speed and beautiful handloom weaving detail.',
        date: '2026-05-28',
        verified: true
      },
      {
        id: 'rev-2',
        name: 'Arjun Khanna',
        product: 'German Silver Jhumka Earrings',
        rating: 5,
        text: 'Exquisite traditional design. The engraving and antique oxidization work on the silver casting is incredible, looks much more expensive.',
        date: '2026-05-24',
        verified: true
      },
      {
        id: 'rev-3',
        name: 'Priya Mehta',
        product: 'Vintage Kutchi Embroidered Clutch',
        rating: 5,
        text: 'Absolutely magnificent embroidery! Pairs perfectly with festive attire. Highly recommend RupeeStore for high-quality regional heritage craft products.',
        date: '2026-05-19',
        verified: true
      },
      {
        id: 'rev-4',
        name: 'Karan Malhotra',
        product: 'Kolhapuri Leather Chappals',
        rating: 4,
        text: 'Robust pure leather build, beautiful hand-stitched detailing. Just needs a few wearings to break it in properly. Excellent support from their team.',
        date: '2026-05-11',
        verified: true
      }
    ];
  });

  const saveReviews = (newReviews: typeof reviews) => {
    setReviews(newReviews);
    localStorage.setItem('rupeestore_reviews', JSON.stringify(newReviews));
  };

  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewProduct, setNewReviewProduct] = useState('Pure Mulberry Silk Scarf');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitMessage, setReviewSubmitMessage] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) {
      alert("Please fill in both your name and review feedback!");
      return;
    }
    const created = {
      id: `rev-${Date.now()}`,
      name: newReviewName.trim(),
      product: newReviewProduct,
      rating: newReviewRating,
      text: newReviewText.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true
    };
    const updated = [created, ...reviews];
    saveReviews(updated);
    
    // Clear state inputs
    setNewReviewName('');
    setNewReviewText('');
    setNewReviewRating(5);
    setReviewSubmitMessage("Thank you! Your verified purchase review has been published successfully.");
    setTimeout(() => {
      setReviewSubmitMessage('');
    }, 5000);
  };

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
  const [activeUserView, setActiveUserView] = useState<'shop' | 'dashboard' | 'blog' | 'womens'>('shop');
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
  const handlePlaceOrder = async (shippingAddress: string, contactPhone: string) => {
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
    const updatedProducts = products.map((p) => {
      const cartMatch = cart.find((c) => c.productId === p.id);
      if (cartMatch) {
        return {
          ...p,
          stock: Math.max(0, p.stock - cartMatch.quantity),
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart

    // Sync to Supabase in parallel
    upsertOrder(newOrder).then(ok => {
      if (!ok) console.warn("Supabase failed: could not write order record");
    });
    
    for (const p of updatedProducts) {
      const cartMatch = cart.find((c) => c.productId === p.id);
      if (cartMatch) {
         upsertProduct(p).catch(console.error);
      }
    }
  };

  // Admin Actions
  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    const ok = await upsertProduct(newProduct);
    if (!ok) console.warn("Supabase failed: could not add product");
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    const ok = await upsertProduct(updatedProduct);
    if (!ok) console.warn("Supabase failed: could not update product");
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((c) => c.productId !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));
    const ok = await deleteProductFromDb(productId);
    if (!ok) console.warn("Supabase failed: could not delete product");
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    let targetOrder: Order | null = null;
    setOrders((prev) => prev.map((o) => {
      if (o.id === orderId) {
        targetOrder = { ...o, status };
        return targetOrder;
      }
      return o;
    }));
    
    setTimeout(() => {
      if (targetOrder) {
        upsertOrder(targetOrder).then(ok => {
          if (!ok) console.warn("Supabase failed: could not update order status");
        });
      }
    }, 50);
  };

  const handleUpdateUserProfile = async (updatedUser: UserProfile) => {
    // Check if modifying current user
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    const ok = await upsertUser(updatedUser);
    if (!ok) console.warn("Supabase failed: could not update user profile");
  };

  const handleDeleteUserProfile = async (userId: string) => {
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    const ok = await deleteUserFromDb(userId);
    if (!ok) console.warn("Supabase failed: could not delete user");
  };

  const handleResetDatabase = async () => {
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
    
    alert('Local database reset. Refreshing Supabase records with starting presets...');
    
    if (dbState.connected) {
      try {
        for (const p of INITIAL_PRODUCTS) await upsertProduct(p);
        for (const u of INITIAL_USERS) await upsertUser(u);
        for (const o of INITIAL_ORDERS) await upsertOrder(o);
        alert('Supabase connected database fully synchronized with default presets!');
      } catch (e) {
        console.error("Upsert seed error:", e);
      }
    }
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
    <div id="applet-container" className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-zinc-950 selection:text-white antialiased flex flex-col justify-between">
      
      {/* Promos strip - Neutral Elegant luxury look */}
      <div className="bg-zinc-100 text-zinc-700 text-[9px] tracking-widest uppercase font-bold py-2.5 px-4 text-center border-b border-zinc-200">
        ✨ FAST FESTIVAL VALUE: Free COD Courier Delivery for all local receipts above ₹1,500!
      </div>

      {/* Main Header navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-100 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Brand logo matching handwritten signature Antom */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveUserView('shop'); setSelectedCategory('All'); }}
              className="text-left cursor-pointer group"
            >
              <h1 id="brand-title" className="text-3xl md:text-4xl font-signature text-zinc-950 tracking-wide transition-opacity group-hover:opacity-75">
                RupeeStore
              </h1>
              <span className="text-[8px] uppercase tracking-widest font-extrabold text-zinc-400 block -mt-1 font-mono">
                Indian Crafts & Essentials
              </span>
            </button>
            <span className="hidden sm:inline text-zinc-200">|</span>
            <span className="hidden sm:inline text-[9px] bg-zinc-50 border border-zinc-200 text-zinc-500 font-bold tracking-widest font-mono px-2 py-0.5">RupeeStore Premium</span>
          </div>

          {/* Centered navigation menu list mirroring reference image */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold tracking-widest uppercase text-zinc-800 border-y lg:border-y-0 py-2 lg:py-0 border-zinc-100">
            <button 
              onClick={() => { setActiveUserView('shop'); setSelectedCategory('All'); setSearchQuery(''); setMaxPrice(1000); }}
              className={`hover:text-zinc-500 transition-colors cursor-pointer ${activeUserView === 'shop' ? 'underline underline-offset-4 decoration-zinc-900 decoration-2' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setActiveUserView('womens'); setSelectedCategory('All'); setSearchQuery(''); setMaxPrice(1000); }}
              className={`hover:text-zinc-500 transition-colors cursor-pointer ${activeUserView === 'womens' ? 'underline underline-offset-4 decoration-zinc-900 decoration-2' : ''}`}
            >
              Womens
            </button>
            <button 
              onClick={() => {
                setActiveUserView('shop');
                setTimeout(() => {
                  const element = document.getElementById('reviews-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="hover:text-zinc-500 transition-colors cursor-pointer"
            >
              Reviews
            </button>
            <button 
              onClick={() => {
                setActiveUserView('blog');
              }}
              className={`hover:text-zinc-500 transition-colors cursor-pointer ${activeUserView === 'blog' ? 'underline underline-offset-4 decoration-zinc-900 decoration-2' : ''}`}
            >
              Blog
            </button>
          </div>

          {/* Right Action Utilities (User Cart counts) */}
          <div className="flex items-center justify-end gap-3.5">

            {/* User details indices */}
            {role === 'user' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (activeUserView === 'shop') {
                      if (currentUser) {
                        setActiveUserView('dashboard');
                      } else {
                        alert('Please simulate profile select below to load custom accounts.');
                      }
                    } else {
                      setActiveUserView('shop');
                    }
                  }}
                  id="toggle-shop-view"
                  title="My Premium Account Dashboard"
                  className={`p-1.5 hover:bg-zinc-100 transition-colors relative rounded ${activeUserView === 'dashboard' ? 'text-zinc-950 bg-zinc-100 font-bold' : 'text-zinc-500'}`}
                >
                  <User className="w-4 h-4 cursor-pointer" />
                </button>

                {/* Wishlist summaries */}
                <button
                  onClick={() => {
                    if (currentUser) {
                      setActiveUserView('dashboard');
                      setTimeout(() => {
                        const tabWishlist = document.getElementById('tab-wishlist');
                        if (tabWishlist) tabWishlist.click();
                      }, 50);
                    } else {
                      alert('Select profile at the bottom of the page to access active saves.');
                    }
                  }}
                  className="p-1.5 hover:bg-zinc-100 transition-colors relative text-zinc-500 rounded"
                  title={`${wishlist.length} Items Saved`}
                >
                  <Heart className="w-4 h-4 text-zinc-800" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 bg-zinc-900 text-white text-[8px] font-bold rounded-full font-mono">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Shopping bag totals */}
                <button
                  onClick={() => setCartOpen(true)}
                  id="header-cart-btn"
                  className="p-1.5 hover:bg-zinc-100 transition-colors relative text-zinc-950 flex items-center gap-1 active:scale-95 rounded"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="border-l border-zinc-200 pl-1.5 text-xs font-bold font-mono">
                    {cartItemCount}
                  </span>
                </button>
              </div>
            )}

            {/* Lock/Unlock Admin authorization session */}
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setIsAdminAuthenticated(false);
                  setRole('user');
                  setActiveUserView('shop');
                  alert('Admin session signed out successfully.');
                }}
                className="text-[9px] uppercase font-bold text-red-650 bg-red-50 hover:bg-red-100 border border-red-200/50 px-2 py-0.5 rounded cursor-pointer"
                title="De-authenticate admin authorization"
              >
                Lock App
              </button>
            )}

          </div>

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
            dbState={dbState}
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

          ) : activeUserView === 'blog' ? (

            /* EXQUISITE BLOG VIEW CHRONICLE */
            <div className="space-y-6">
              <div className="mb-2 text-left">
                <button
                  onClick={() => {
                    setActiveUserView('shop');
                    setSelectedCategory('All');
                  }}
                  className="text-[10px] tracking-widest text-zinc-500 font-bold uppercase hover:text-zinc-950 flex items-center gap-1 cursor-pointer font-mono"
                >
                  ← Return to Storefront catalog
                </button>
              </div>
              <BlogView
                products={products}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p.id, 1)}
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

              {/* Curated Interactive Carousel and Promo Billboard panels (rendered for Home storefront only) */}
              {activeUserView === 'shop' ? (
                <>
                  {/* Curated Interactive Carousel Slider matching the Antom reference image layout */}
                  <div className="relative overflow-hidden bg-zinc-50 border border-zinc-100 min-h-[350px] md:min-h-[420px] flex items-center shadow-xs animate-fade-in">
                    
                    {/* Background Image of active slide */}
                    <div className="absolute inset-0 w-full h-full md:w-2/3 lg:w-1/2 overflow-hidden bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${HERO_SLIDES[carouselIndex].image})` }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-zinc-50 md:from-transparent"></div>
                    </div>

                    {/* Left & Right Custom Chevron Slider Buttons */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                      <button 
                        onClick={() => setCarouselIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                        className="w-10 h-10 bg-zinc-950 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Previous Slide"
                      >
                        &lt;
                      </button>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                      <button 
                        onClick={() => setCarouselIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1))}
                        className="w-10 h-10 bg-white border border-zinc-200 text-zinc-900 flex items-center justify-center hover:bg-zinc-100 transition-colors cursor-pointer"
                        title="Next Slide"
                      >
                        &gt;
                      </button>
                    </div>

                    {/* Typography Information Overlaid of slide on the Right details slot */}
                    <div className="w-full md:w-1/2 ml-auto p-8 md:p-14 md:pr-16 relative z-10 space-y-4 text-left md:block">
                      <span className="text-zinc-500 font-mono text-xs tracking-widest block font-bold">
                        {HERO_SLIDES[carouselIndex].tag}
                      </span>
                      
                      <h2 className="text-3xl md:text-5xl font-serif font-medium text-zinc-950 tracking-tight leading-tight lowercase">
                        {HERO_SLIDES[carouselIndex].title}
                      </h2>
                      
                      <p className="text-zinc-650 text-xs md:text-sm max-w-sm leading-relaxed font-sans font-light">
                        {HERO_SLIDES[carouselIndex].description}
                      </p>
                      
                      <div className="pt-4">
                        <button
                          onClick={() => {
                            const targetCat = HERO_SLIDES[carouselIndex].categoryFilter;
                            setSelectedCategory(targetCat);
                            // Safe scroll focus
                            const element = document.getElementById('our-products-section');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-zinc-950 hover:bg-zinc-850 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs py-3 px-8 transition-colors cursor-pointer shadow-xs"
                        >
                          {HERO_SLIDES[carouselIndex].linkText}
                        </button>
                      </div>
                    </div>

                    {/* Numeric Slide indices dots indicators underneath */}
                    <div className="absolute bottom-4 right-1/2 translate-x-1/2 flex gap-2 z-20">
                      {HERO_SLIDES.map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setCarouselIndex(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${carouselIndex === idx ? 'bg-zinc-950' : 'bg-zinc-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sub-Header text welcoming customer */}
                  <div className="pt-8 text-center">
                    <p className="font-serif italic text-zinc-800 text-[15px] md:text-lg">
                      Welcome to <span className="font-signature text-2xl md:text-3xl text-zinc-950 not-italic font-semibold mx-1">RupeeStore</span>!
                    </p>
                  </div>

                  {/* Three-Column Promotion Banners Grid matching reference layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    
                    {/* Left Card: model image with white overlaid tag of newdenim */}
                    <div className="relative aspect-square md:aspect-auto md:h-76 overflow-hidden bg-zinc-50 border border-zinc-100 group">
                      <img 
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop" 
                        alt="new collection streetwear models" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-40"></div>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/12 transform -translate-x-1/2 z-10">
                        <span className="bg-white text-zinc-950 text-[10px] font-bold tracking-widest uppercase px-5 py-2 whitespace-nowrap shadow-xs">
                          #newdenim
                        </span>
                      </div>
                    </div>

                    {/* Center Column Card: Get 70% voucher code with clean details */}
                    <div className="bg-zinc-50 border border-zinc-100 p-6 md:p-8 flex flex-col justify-center items-center text-center space-y-4 md:h-76">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block">Exclusive Discount Offer</span>
                        <h3 className="text-3xl md:text-4xl font-sans font-bold text-zinc-950 tracking-tight">
                          Get 70%
                        </h3>
                        <p className="text-[11px] text-zinc-550 max-w-[200px] leading-relaxed mx-auto">
                          Classical Latin literature from 45 BC.
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => {
                          alert("FLASH BOUTIQUE COUPON ACTIVE: Use checkout coupon code 'RUPEE70' to save flat amounts on heritage bundles.");
                        }}
                        className="bg-zinc-950 hover:bg-zinc-850 text-white font-bold uppercase tracking-widest text-[10px] py-2.5 px-6 transition-colors cursor-pointer"
                      >
                        EXPORE NOW
                      </button>
                    </div>

                    {/* Right Card: lookbook design card with orange style background */}
                    <div className="relative aspect-square md:aspect-auto md:h-76 overflow-hidden bg-zinc-150 border border-zinc-100 group">
                      <img 
                        src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600&auto=format&fit=crop" 
                        alt="heritage lookbook designs chic" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-amber-500/5 opacity-30"></div>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/12 transform -translate-x-1/2 z-10">
                        <span className="bg-white text-zinc-950 text-[10px] font-bold tracking-widest uppercase px-5 py-2 whitespace-nowrap shadow-xs">
                          #lookbook19
                        </span>
                      </div>
                    </div>

                  </div>
                </>
              ) : (
                /* Specialized Cover Banner for Women's Heritage Page */
                <div className="bg-zinc-50 border border-zinc-100 p-8 md:p-14 text-center space-y-4 animate-fade-in relative shadow-sm">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono block">
                    elite regional craft & traditional finery
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif text-zinc-950 tracking-tight lowercase">
                    the premium women's collection
                  </h2>
                  <div className="w-12 h-0.5 bg-zinc-950 mx-auto"></div>
                  <p className="text-zinc-600 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                    A carefully curated gallery of authentic handwoven mulberry silks, kundan meenakari earrings, vintage embroidered clutches, and handcrafted leather flats.
                  </p>
                </div>
              )}

              {/* OUR PRODUCTS section separator header */}
              <div id="our-products-section" className="text-center pt-8 border-t border-zinc-100">
                <h3 className="text-zinc-950 text-lg md:text-xl font-bold uppercase tracking-widest font-sans">
                  {activeUserView === 'womens' ? "women's boutique selections" : "OUR PRODUCTS"}
                </h3>
                <div className="w-10 h-0.5 bg-zinc-950 mx-auto mt-2.5"></div>
              </div>

              {/* Streamlined Monochrome Filtering Controls Panel */}
              <div className="bg-white border border-zinc-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Search Text Input */}
                <div className="relative w-full md:w-80 shrink-0">
                  <span className="absolute left-3.5 top-2.5 text-zinc-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 border border-zinc-200 focus:outline-hidden focus:border-zinc-950 text-xs text-zinc-800 rounded-none bg-zinc-50/50"
                    placeholder="Filter catalog products..."
                  />
                </div>

                {/* Categories tab select */}
                <div className="flex flex-wrap gap-1 items-center justify-center">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-3.5 py-1.5 transition-colors uppercase font-mono tracking-wider cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-zinc-950 text-white font-bold'
                          : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-650'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Price budget restrict slider */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-xs">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-0.5 font-bold">Limit budget</span>
                    <span className="font-mono font-bold text-zinc-950">Under ₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="1000"
                    step="20"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-20 md:w-28 accent-zinc-950 h-1 bg-zinc-100 rounded-none cursor-pointer"
                  />
                </div>

              </div>

              {/* GRID OF DELIBERATE PRODUCTS */}
              <div>
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Luxury Regional Selections</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Showing {filteredProducts.length} certified items</p>
                  </div>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono">Premium Range ₹500 - ₹1,000</span>
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

              {/* BRAND REVIEWS & TESTIMONIALS SECTION */}
              <div id="reviews-section" className="mt-16 pt-12 border-t border-zinc-100 space-y-8">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1 bg-zinc-50 border border-zinc-100 rounded-full px-3 py-1 font-mono text-[9px] tracking-wider uppercase font-semibold text-zinc-600">
                    <MessageSquare className="w-3 h-3 text-zinc-500" /> Verified Buyers
                  </div>
                  <h3 className="text-zinc-950 text-xl md:text-2xl font-serif tracking-tight font-medium lowercase">
                    artisan heritage customer reviews
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-lg mx-auto font-sans">
                    Every weave, polish, and stitch counts. Read authentic reviews submitted by customers across our regional craft centers.
                  </p>
                  
                  {/* Rating overview stars */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <div className="flex items-center text-amber-500 gap-0.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="text-zinc-800 font-bold font-mono text-xs">4.9 / 5.0</span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-500 text-[11px] uppercase tracking-wider font-mono font-bold">Based on {reviews.length} checkout verifications</span>
                  </div>
                </div>

                {/* 2-Column Responsive reviews workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Left columns: Reviews Feed List */}
                  <div className="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                    {reviews.map((rev) => (
                      <div 
                        key={rev.id} 
                        className="bg-white border border-zinc-100 p-5 hover:border-zinc-300 transition-colors duration-300 relative space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-zinc-900 font-sans block">{rev.name}</span>
                            <span className="text-[10px] text-zinc-550 font-mono tracking-wider uppercase">Verified Buyer • product: {rev.product}</span>
                          </div>
                          
                          {/* Stars */}
                          <div className="flex items-center text-amber-500 gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} 
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-zinc-650 text-xs leading-relaxed font-sans font-light">
                          "{rev.text}"
                        </p>

                        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                          <span>Date Submitted: {rev.date}</span>
                          <span className="text-emerald-600 font-bold tracking-widest uppercase text-[8px] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5">🔒 Verified Feed</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right column: Write a review Form Card */}
                  <div className="bg-zinc-50/50 border border-zinc-100 p-6 space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-zinc-950 text-xs font-mono font-bold tracking-widest uppercase">
                        share your experience
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-light leading-relaxed">
                        Purchased an item recently? Submit your review down below to help other lovers of traditional craft.
                      </p>
                    </div>

                    {reviewSubmitMessage && (
                      <div className="bg-zinc-950 text-white p-3 text-xs font-mono tracking-wide leading-relaxed font-semibold">
                        ✓ {reviewSubmitMessage}
                      </div>
                    )}

                    <form onSubmit={handleAddReview} className="space-y-3.5 text-xs">
                      {/* Name input */}
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono tracking-wider uppercase font-extrabold text-zinc-400 block">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          placeholder="e.g. Aditi Roy"
                          className="w-full bg-white border border-zinc-200 p-2 text-xs focus:outline-hidden focus:border-zinc-950 rounded-none text-zinc-800"
                        />
                      </div>

                      {/* Product dropdown select */}
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono tracking-wider uppercase font-extrabold text-zinc-400 block">
                          Select Product
                        </label>
                        <select
                          value={newReviewProduct}
                          onChange={(e) => setNewReviewProduct(e.target.value)}
                          className="w-full bg-white border border-zinc-200 p-2 text-xs focus:outline-hidden focus:border-zinc-950 rounded-none text-zinc-800"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Rating selectors stars selection */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-mono tracking-wider uppercase font-extrabold text-zinc-400 block">
                          Rating Score
                        </label>
                        <div className="flex items-center gap-1.5 font-sans">
                          {[1, 2, 3, 4, 5].map((starValue) => (
                            <button
                              type="button"
                              key={starValue}
                              onClick={() => setNewReviewRating(starValue)}
                              className="focus:outline-hidden cursor-pointer"
                              title={`Rate ${starValue} Stars`}
                            >
                              <Star 
                                className={`w-5 h-5 ${starValue <= newReviewRating ? 'fill-amber-400 text-amber-400 font-bold' : 'text-zinc-250 hover:text-amber-300'}`} 
                              />
                            </button>
                          ))}
                          <span className="font-mono text-[11px] font-bold text-zinc-600 ml-2">({newReviewRating} / 5)</span>
                        </div>
                      </div>

                      {/* Review details text */}
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-mono tracking-wider uppercase font-extrabold text-zinc-400 block">
                          Review Message
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          placeholder="Describe the texture, weight, colors, and experience..."
                          className="w-full bg-white border border-zinc-200 p-2 text-xs focus:outline-hidden focus:border-zinc-950 rounded-none text-zinc-800"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2.5 px-4 font-mono uppercase tracking-widest text-[10px] sm:text-xs transition-colors cursor-pointer"
                      >
                        Publish Verified Review
                      </button>
                    </form>
                  </div>

                </div>
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

      {/* Footer bar styled in neutral pitch black */}
      <footer className="bg-zinc-950 text-zinc-450 mt-16 py-12 border-t border-zinc-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          
          <div className="space-y-1">
            <p className="font-serif font-bold text-white text-sm">RupeeStore Premium</p>
            <p className="leading-relaxed text-[11px] text-zinc-500">Sustainably curated regional clothing items, fine jewelry, and organic heritage selections.</p>
            <p className="font-mono text-[9px] text-zinc-650">Local GMT time context: 2026 | Powered by React and local database simulation.</p>
          </div>

          {/* Admin Login Portal Link and Credentials */}
          <div className="flex flex-col items-center md:items-end gap-1.5 bg-zinc-900 p-3 border border-zinc-800">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Lock className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
              <button
                onClick={() => {
                  if (isAdminAuthenticated) {
                    setRole('admin');
                  } else {
                    setAdminLoginOpen(true);
                  }
                }}
                id="footer-admin-login-link"
                className="text-xs font-bold text-zinc-300 hover:text-white hover:underline cursor-pointer"
              >
                Admin Portal Login
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-zinc-400 font-medium text-[11px] tracking-wider uppercase font-mono">
            <span className="flex items-center gap-1">🟢 Cash on Delivery</span>
            <span>•</span>
            <span className="flex items-center gap-1">🛡️ Admin Console</span>
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
