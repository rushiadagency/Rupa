import React, { useState } from 'react';
import { Product, Order, UserProfile, OrderStatus } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings as SettingsIcon, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  RefreshCw, 
  IndianRupee, 
  AlertCircle, 
  Upload,
  ArrowUpRight,
  TrendingUp,
  Inbox
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  users: UserProfile[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateUserProfile: (updatedUser: UserProfile) => void;
  onDeleteUserProfile: (userId: string) => void;
  onResetDatabase: () => void;
  dbState?: { connected: boolean | null; message: string; loading: boolean };
}

// Elegant Preset Luxury Accessories for rapid additions
const POPULAR_PRESETS = [
  { name: 'Kundan Jhumka Earrings', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60', category: 'Jewelry', price: 599, desc: 'Traditionally crafted brass jhumkas featuring colorful meenakari work, premium pearls, and semi-precious kundan stone-work.' },
  { name: 'Handwoven Banarasi Shawl', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60', category: 'Scarves & Shawls', price: 850, desc: 'Luxurious pure silk stole adorned with fine golden zari brocade weave patterns.' },
  { name: 'Embellished Silk Potli Clutch', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60', category: 'Bags & Clutches', price: 720, desc: 'Elegant drawstring potli bag accented with dazzling golden bead fringes, intricate gota patti embroidery, and pearl tassels.' },
  { name: 'Silver-Plated Ghungroo Payal', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60', category: 'Jewelry', price: 540, desc: 'Traditional oxidised silver-plated dual anklets lined with hand-tuned small chiming brass bells (ghungroos).' },
  { name: 'Brass Engraved Cuff Bangle', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=60', category: 'Jewelry', price: 580, desc: 'Open-ended, highly adjustable brass forearm collector cuff deeply engraved with classical patterns.' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  users,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateUserProfile,
  onDeleteUserProfile,
  onResetDatabase,
}) => {
  // Navigation Tabs: Dashboard, Products, Orders, Customers, Settings
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'settings'>('dashboard');

  // Search filter query inputs
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [searchCustomerQuery, setSearchCustomerQuery] = useState('');

  // Form states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'Jewelry',
    price: 650,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
  });

  const [formError, setFormError] = useState('');
  const [uploadedImageName, setUploadedImageName] = useState('');

  // General settings simulated configurations
  const [storeName, setStoreName] = useState('RupeeStore');
  const [storeCurrency, setStoreCurrency] = useState('INR (₹)');
  const [allowOverStock, setAllowOverStock] = useState(true);

  // Stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalUsers = users.length;

  const totalSales = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Form submit handlers
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.description.trim()) {
      setFormError('Please enter a valid product name and description.');
      return;
    }
    if (productForm.price < 500 || productForm.price > 1000) {
      setFormError('Product price must be between ₹500 and ₹1,000 for standard regional catalog parameters.');
      return;
    }

    setFormError('');

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        category: productForm.category,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        imageUrl: productForm.imageUrl,
      });
      setEditingProduct(null);
    } else {
      const generatedId = `prod-${Date.now().toString().slice(-6)}`;
      onAddProduct({
        id: generatedId,
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        category: productForm.category,
        price: Number(productForm.price),
        rating: 4.5,
        stock: Number(productForm.stock),
        imageUrl: productForm.imageUrl,
      });
      setIsAddingProduct(false);
    }

    // Reset Form
    setProductForm({
      name: '',
      description: '',
      category: 'Jewelry',
      price: 650,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
    });
    setUploadedImageName('');
  };

  const handleSelectPreset = (preset: typeof POPULAR_PRESETS[0]) => {
    setProductForm({
      name: preset.name,
      description: preset.desc,
      category: preset.category,
      price: preset.price,
      stock: 20,
      imageUrl: preset.url
    });
    setUploadedImageName('');
    setFormError('');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError('The image is larger than 2MB. Please choose a smaller asset.');
        return;
      }
      setUploadedImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProductForm(prev => ({ ...prev, imageUrl: reader.result }));
          setFormError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUserProfile(editingUser);
      setEditingUser(null);
    }
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl,
    });
    setFormError('');
    setIsAddingProduct(false);
  };

  // Nav categories count
  const jewelryCount = products.filter(p => p.category === 'Jewelry').length;
  const scarvesCount = products.filter(p => p.category === 'Scarves & Shawls').length;
  const bagsCount = products.filter(p => p.category === 'Bags & Clutches').length;
  const hairCount = products.filter(p => p.category === 'Hair Accessories').length;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col md:flex-row shadow-sm border border-slate-100 rounded-3xl overflow-hidden">
      
      {/* BRAND & NAVIGATION SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Top header with logo and store name */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white scale-95 shadow-sm">
              <span className="font-serif font-bold text-lg">R</span>
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">RupeeStore Admin</h2>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">retail boutique</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'settings', label: 'Settings', icon: SettingsIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                    setEditingUser(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-zinc-900 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'orders' && pendingOrders > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-amber-500 text-white font-mono text-[9px] font-bold flex items-center justify-center scale-90">
                      {pendingOrders}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info showing standard metadata cleanly */}
        <div className="pt-6 border-t border-slate-100 px-2 text-[10px] text-slate-400 font-medium">
          <p className="font-semibold text-slate-500">RupeeStore</p>
          <p className="mt-0.5">Ready for dispatchers</p>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-1 bg-white p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Header Title section */}
              <div>
                <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900">Store Performance Overview</h1>
                <p className="text-slate-500 text-xs mt-1">Real-time indicators showing active collections and cash on delivery pipelines.</p>
              </div>

              {/* Four Main Dashboard Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Products card */}
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[120px] transition-all hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</span>
                    <Package className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">{totalProducts}</span>
                    <span className="text-[11px] block text-slate-400 font-medium mt-1">Active live catalog</span>
                  </div>
                </div>

                {/* Total Orders card */}
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[120px] transition-all hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
                    <ShoppingCart className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">{totalOrders}</span>
                    <span className="text-[11px] block text-slate-400 font-medium mt-1">Cash on Delivery</span>
                  </div>
                </div>

                {/* Pending COD Orders card */}
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[120px] transition-all hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending COD Orders</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">{pendingOrders}</span>
                    <span className="text-[11px] block text-slate-400 font-medium mt-1">Awaiting dispatch verification</span>
                  </div>
                </div>

                {/* Total Users card */}
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[120px] transition-all hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
                    <Users className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">{totalUsers}</span>
                    <span className="text-[11px] block text-slate-400 font-medium mt-1">Registered profiles</span>
                  </div>
                </div>

              </div>

              {/* Secondary Clean Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                
                {/* Catalog Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Product Categories</h3>
                  <div className="space-y-4 pt-1">
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                        <span>Jewelry</span>
                        <span className="font-bold text-slate-900">{jewelryCount} Items</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-zinc-800 h-full" style={{ width: `${(jewelryCount / (products.length || 1)) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                        <span>Bags & Clutches</span>
                        <span className="font-bold text-slate-900">{bagsCount} Items</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-zinc-800 h-full" style={{ width: `${(bagsCount / (products.length || 1)) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                        <span>Scarves & Shawls</span>
                        <span className="font-bold text-slate-900">{scarvesCount} Items</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-zinc-800 h-full" style={{ width: `${(scarvesCount / (products.length || 1)) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                        <span>Hair Accessories</span>
                        <span className="font-bold text-slate-900">{hairCount} Items</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-zinc-800 h-full" style={{ width: `${(hairCount / (products.length || 1)) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue & Settled statistics widget */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Settled Sales Revenue</h3>
                    <p className="text-xs text-slate-450 mt-1">Reflects cash payments received for delivered COD merchandise packages.</p>
                  </div>

                  <div className="pt-6 pb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accumulated Sum</span>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-3xl font-extrabold text-emerald-800 font-mono">₹{totalSales.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-emerald-600 font-semibold flex items-center ">
                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Checked Out
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Delivered Orders:</span>
                    <span className="font-bold text-slate-900 font-mono">{orders.filter(o => o.status === 'Delivered').length} packages</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* PRODUCTS MANAGEMENT TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Product Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Store Catalog</h1>
                  <p className="text-xs text-slate-500 mt-1">View, adjust state variables, and introduce premium luxury Accessories.</p>
                </div>

                {!isAddingProduct && !editingProduct && (
                  <button
                    onClick={() => {
                      setIsAddingProduct(true);
                      setEditingProduct(null);
                      setFormError('');
                    }}
                    className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-855 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-shadow shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Product Item
                  </button>
                )}
              </div>

              {/* Product Edit / Addition Form container */}
              {(isAddingProduct || editingProduct) && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        {editingProduct ? 'Modify Product Details' : 'Introduce New Accessory'}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Please provide authentic values and attractive marketing descriptors.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                        setFormError('');
                      }}
                      className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-150 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1.5">Product Title / Name *</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:border-zinc-800 focus:ring-0 bg-slate-50/50"
                        placeholder="e.g. Traditional Fine Kundan Jhumka"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1.5">Category Group *</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:border-zinc-800 focus:ring-0 bg-slate-50/50 font-medium"
                      >
                        <option value="Jewelry">Jewelry</option>
                        <option value="Scarves & Shawls">Scarves & Shawls</option>
                        <option value="Bags & Clutches">Bags & Clutches</option>
                        <option value="Hair Accessories">Hair Accessories</option>
                        <option value="Footwear">Footwear</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1.5">Price (Rupees) * (₹500 - ₹1000 limit)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          min={500}
                          max={1000}
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                          className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 font-bold font-mono text-slate-800 focus:border-zinc-800 focus:ring-0 bg-slate-50/50"
                          placeholder="650"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1.5">Available Stock Units *</label>
                      <input
                        type="number"
                        min={0}
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 font-bold font-mono focus:border-zinc-800 focus:ring-0 bg-slate-50/50"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1.5">Product Image Link/URL *</label>
                      <input
                        type="url"
                        value={productForm.imageUrl}
                        onChange={(e) => {
                          setProductForm({...productForm, imageUrl: e.target.value});
                          setUploadedImageName('');
                        }}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-[11px] focus:border-zinc-800 focus:ring-0 bg-slate-50/50"
                        placeholder="https://images.unsplash.com/your-premium-accessory-link"
                        required
                      />
                      
                      {/* File upload support styled cleanly under the form field */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-2 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>{uploadedImageName ? `Loaded: ${uploadedImageName}` : 'Or Choose Local File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[10px] text-slate-400">Recommended dimension 1:1 square.</span>
                      </div>
                    </div>

                    {/* Pre-fill Template selector to make management extremely friendly */}
                    {!editingProduct && (
                      <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Or Pre-fill with Ethnic Presets:</span>
                        <div className="flex flex-wrap gap-2">
                          {POPULAR_PRESETS.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectPreset(preset)}
                              className="text-[10px] px-2.5 py-1.5 rounded-lg font-semibold bg-white hover:bg-zinc-900 hover:text-white border border-slate-200 transition-colors cursor-pointer text-slate-700"
                            >
                              ✨ {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1.5">Product Description (Traditional Attributes) *</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        rows={3}
                        className="w-full border border-slate-200 rounded-xl p-3 focus:border-zinc-800 focus:ring-0 bg-slate-50/50"
                        placeholder="Write dynamic materials info, traditional embroidery patterns description weight details, design background..."
                        required
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProduct(false);
                          setEditingProduct(null);
                          setFormError('');
                        }}
                        className="bg-white hover:bg-slate-50 border border-slate-200 font-bold py-2.5 px-5 rounded-xl transition-all font-sans"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 px-6 rounded-xl transition-all font-sans"
                      >
                        {editingProduct ? 'Save Product Changes' : 'Publish Product to Store'}
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* Simple Controls: Search & Statistics Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchProductQuery}
                    onChange={(e) => setSearchProductQuery(e.target.value)}
                    placeholder="Search Products by Name, Category..."
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Showing {products.filter(p => p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) || p.category.toLowerCase().includes(searchProductQuery.toLowerCase())).length} of {totalProducts} Products
                </span>
              </div>

              {/* Product List Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    
                    <thead className="bg-slate-50/70 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-100 tracking-wider">
                      <tr>
                        <th className="p-4 w-16">Image</th>
                        <th className="p-4">Product details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-center">In stock</th>
                        <th className="p-4">Price</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {products
                        .filter(p => {
                          const query = searchProductQuery.toLowerCase();
                          return p.name.toLowerCase().includes(query) || 
                                 p.category.toLowerCase().includes(query) || 
                                 p.description.toLowerCase().includes(query);
                        })
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-100 bg-slate-50"
                                referrerPolicy="no-referrer"
                              />
                            </td>
                            <td className="p-4 max-w-sm">
                              <span className="font-bold text-slate-900 block truncate" title={p.name}>{p.name}</span>
                              <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{p.description}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-4 text-center font-mono">
                              <span className={`font-bold ${p.stock <= 0 ? 'text-red-500 font-black' : p.stock < 5 ? 'text-amber-600' : 'text-slate-600'}`}>
                                {p.stock} units
                              </span>
                            </td>
                            <td className="p-4 font-mono font-bold text-slate-900">
                              ₹{p.price.toLocaleString('en-IN')}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-1.5 text-slate-500">
                                
                                <button
                                  onClick={() => startEditProduct(p)}
                                  className="p-1 px-2.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Edit Product Details"
                                >
                                  <Edit2 className="w-3 h-3 text-slate-400" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                      onDeleteProduct(p.id);
                                    }
                                  }}
                                  className="p-1 px-2.5 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3 h-3 text-red-400" />
                                  <span>Delete</span>
                                </button>

                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>

                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Store Orders Directory</h1>
                <p className="text-xs text-slate-500 mt-1">Accept, reject, ship, and trace active Cash On Delivery consumer purchases.</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchOrderQuery}
                    onChange={(e) => setSearchOrderQuery(e.target.value)}
                    placeholder="Search orders by customer or ID..."
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                    Pending: {pendingOrders}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                    Total: {totalOrders}
                  </span>
                </div>
              </div>

              {/* Order List Table */}
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 border border-slate-100 rounded-2xl">
                  <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs font-bold">No registered orders received yet.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      
                      <thead className="bg-slate-50/70 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-100 tracking-wider">
                        <tr>
                          <th className="p-4">Order Number</th>
                          <th className="p-4">Customer Name</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {orders
                          .filter(o => {
                            const query = searchOrderQuery.toLowerCase();
                            return o.id.toLowerCase().includes(query) || 
                                   o.userName.toLowerCase().includes(query) || 
                                   o.userEmail.toLowerCase().includes(query) ||
                                   o.shippingAddress.toLowerCase().includes(query);
                          })
                          .map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="p-4 font-mono font-bold text-slate-900">
                                {o.id}
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-slate-900 block">{o.userName}</span>
                                <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[200px]" title={o.shippingAddress}>
                                  {o.shippingAddress}
                                </span>
                              </td>
                              <td className="p-4 text-slate-500 font-mono text-[11px]">
                                {o.orderDate}
                              </td>
                              <td className="p-4 font-mono font-bold text-emerald-800 text-[13px]">
                                ₹{o.totalAmount.toLocaleString('en-IN')}
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  o.status === 'Pending' 
                                    ? 'bg-amber-550/10 text-amber-600' 
                                    : o.status === 'Shipped' 
                                      ? 'bg-sky-500/10 text-sky-600' 
                                      : o.status === 'Delivered' 
                                        ? 'bg-emerald-500/10 text-emerald-600' 
                                        : 'bg-red-500/10 text-red-500'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    o.status === 'Pending' 
                                      ? 'bg-amber-500' 
                                      : o.status === 'Shipped' 
                                        ? 'bg-sky-500' 
                                        : o.status === 'Delivered' 
                                          ? 'bg-emerald-500' 
                                          : 'bg-red-500'
                                  }`} />
                                  <span>{o.status}</span>
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <select
                                    value={o.status}
                                    onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                                    className="border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold bg-white cursor-pointer focus:outline-hidden"
                                  >
                                    <option value="Pending">🕒 Pending Decision</option>
                                    <option value="Shipped">🚚 Shipped / In Transit</option>
                                    <option value="Delivered">✅ Delivered & Settled</option>
                                    <option value="Cancelled">❌ Cancelled Order</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>

                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Database</h1>
                <p className="text-xs text-slate-500 mt-1">Manage static subscriber registries, phone contacts, and home shipping locations.</p>
              </div>

              {/* Customer edit subform */}
              {editingUser && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-150 pb-2.5">
                    <h3 className="text-sm font-bold text-slate-900">Edit Static Shopper Metadata ({editingUser.name})</h3>
                    <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[9px] uppercase tracking-wider text-slate-700 mb-1">Customer Full Name</label>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[9px] uppercase tracking-wider text-slate-700 mb-1">Telephone Contact</label>
                      <input
                        type="text"
                        value={editingUser.phone}
                        onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-[9px] uppercase tracking-wider text-slate-700 mb-1">Permanent Residential Address</label>
                      <textarea
                        value={editingUser.address}
                        onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                        rows={2}
                        className="w-full border border-slate-200 rounded-xl p-3 bg-white"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 border-t border-slate-200/50 pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className="bg-white hover:bg-slate-100 border border-slate-200 font-bold py-2 px-4 rounded-xl text-xs transition-colors"
                      >
                        Bypass
                      </button>
                      <button
                        type="submit"
                        className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 px-5 rounded-xl text-xs transition-shadow shadow-xs"
                      >
                        Commit Profile Changes
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchCustomerQuery}
                    onChange={(e) => setSearchCustomerQuery(e.target.value)}
                    placeholder="Search users name, email..."
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <span className="text-xs text-slate-400 font-medium font-mono">
                  Registered profiles Count: {totalUsers}
                </span>
              </div>

              {/* Customers list Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    
                    <thead className="bg-slate-50/70 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-100 tracking-wider">
                      <tr>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Contact Telephone</th>
                        <th className="p-4">Default Registered COD Address</th>
                        <th className="p-4">Registration Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {users
                        .filter(u => {
                          const query = searchCustomerQuery.toLowerCase();
                          return u.name.toLowerCase().includes(query) || 
                                 u.email.toLowerCase().includes(query) ||
                                 u.address.toLowerCase().includes(query);
                        })
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 uppercase">
                                  {u.name[0] || 'U'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{u.name}</p>
                                  <span className="text-[10px] text-slate-400 font-mono block">{u.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-mono font-medium text-slate-700">
                              {u.phone || 'N/A'}
                            </td>
                            <td className="p-4 max-w-[240px] truncate text-slate-600" title={u.address}>
                              {u.address}
                            </td>
                            <td className="p-4 font-mono text-slate-400 text-[11px]">
                              {u.registeredDate}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                
                                <button
                                  onClick={() => setEditingUser(u)}
                                  className="p-1 px-3 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Info"
                                >
                                  Edit Info
                                </button>

                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you absolutely sure you want to delete profile registry for "${u.name}"?`)) {
                                      onDeleteUserProfile(u.id);
                                    }
                                  }}
                                  className="p-1 px-3 text-[11px] font-bold text-red-650 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                  title="Delete User"
                                >
                                  Revoke
                                </button>

                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>

                  </table>
                </div>
              </div>

            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Boutique Administration Settings</h1>
                <p className="text-xs text-slate-500 mt-1">Configure workspace rules, default billing currencies, and seed demo databases.</p>
              </div>

              {/* Simple Settings Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left block information */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Metadata Values</h3>
                  <p className="text-xs text-slate-450 leading-relaxed">
                    General configurations that drive front banner titles, user receipts, and shopping cart validation parameters.
                  </p>
                </div>

                {/* Right Form Fields */}
                <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1.5">Storefront Name</label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/30"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1.5">Primary Local Currency</label>
                      <input
                        type="text"
                        value={storeCurrency}
                        onChange={(e) => setStoreCurrency(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/30 font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">Enforce strict region pricing limits</span>
                      <span className="text-slate-400 text-[11px] block mt-0.5">Locks prices of products on addition between ₹500 and ₹1,000.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={allowOverStock}
                        onChange={() => setAllowOverStock(!allowOverStock)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900"></div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Reset Data module placed down inside Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-100">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Maintenance Database Portal</h3>
                  <p className="text-xs text-slate-450 leading-relaxed">
                    Restore the sandbox client values to original demo defaults. This clears all order sheets and restores default catalogs.
                  </p>
                </div>

                <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Database factory defaults reload</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Erases all test client modifications, cleans active customer receipts, and reloads standard products.</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (window.confirm('WARNING: This will reset all local storage products, clear client orders, and reload the default 15 items. Continue?')) {
                          onResetDatabase();
                          alert('Database catalog successfully restored to store original template products.');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Demo Database Catalog</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
};
