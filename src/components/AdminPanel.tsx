import React, { useState } from 'react';
import { Product, Order, UserProfile, OrderStatus } from '../types';
import { 
  BarChart4, PackagePlus, ClipboardList, Users2, Plus, Edit2, Trash2, 
  X, Check, RefreshCw, IndianRupee, AlertCircle, ShoppingBag, Eye,
  Image, Upload
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
}

// Preset Luxury Indian Women's Accessories details for fast creation options
const PREMIUM_ACC_PRESETS = [
  { name: 'Kundan Jhumka Earrings', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60', category: 'Jewelry', price: 599, desc: 'Traditionally crafted brass jhumkas featuring colorful meenakari work, premium pearls, and semi-precious kundan stone-work.' },
  { name: 'Handwoven Banarasi Shawl', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60', category: 'Scarves & Shawls', price: 850, desc: 'Luxurious pure silk stole adorned with fine golden zari brocade weave patterns.' },
  { name: 'Embellished Silk Potli Clutch', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60', category: 'Bags & Clutches', price: 720, desc: 'Elegant drawstring potli bag accented with dazzling golden bead fringes, intricate gota patti embroidery, and pearl tassels.' },
  { name: 'Silver-Plated Ghungroo Payal', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60', category: 'Jewelry', price: 540, desc: 'Traditional oxidised silver-plated dual anklets lined with hand-tuned small chiming brass bells (ghungroos).' },
  { name: 'Brass Engraved Cuff Bangle', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=60', category: 'Jewelry', price: 580, desc: 'Open-ended, highly adjustable brass forearm collector cuff deeply engraved with classical patterns.' },
  { name: 'Floral Threadwork Shoulder Bag', url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a4a0?w=500&auto=format&fit=crop&q=60', category: 'Bags & Clutches', price: 899, desc: 'Hard shell rectangular evening clutch featuring dense hand-embroidered floral motifs.' }
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
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users' | 'analytics' | 'manage-catalog'>('manage-catalog');
  
  // Catalog Manager section states
  const [newProd, setNewProd] = useState({
    name: '',
    description: '',
    category: 'Jewelry',
    price: 650,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
  });
  const [newProdError, setNewProdError] = useState('');
  const [searchCatalogQuery, setSearchCatalogQuery] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState('All');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [showDeletionConfirm, setShowDeletionConfirm] = useState<string | null>(null);

  // Product state helper
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    category: 'Jewelry',
    price: 650,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
  });

  // User edit state helper
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form error logs
  const [formError, setFormError] = useState('');

  // Settle analytics sums
  const totalIncome = orders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingAmount = orders
    .filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const jewelryCount = products.filter((p) => p.category === 'Jewelry').length;
  const scarvesCount = products.filter((p) => p.category === 'Scarves & Shawls').length;
  const bagsCount = products.filter((p) => p.category === 'Bags & Clutches').length;
  const hairCount = products.filter((p) => p.category === 'Hair Accessories').length;
  const footwearCount = products.filter((p) => p.category === 'Footwear').length;

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim() || !prodForm.description.trim()) {
      setFormError('Please enter a valid product name and description.');
      return;
    }
    if (prodForm.price < 500 || prodForm.price > 1000) {
      setFormError('Product price MUST be between ₹500 and ₹1000 according to inventory limits.');
      return;
    }

    setFormError('');

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: prodForm.name,
        description: prodForm.description,
        category: prodForm.category,
        price: prodForm.price,
        stock: prodForm.stock,
        imageUrl: prodForm.imageUrl,
      });
      setEditingProduct(null);
    } else {
      const generatedId = `prod-${Date.now().toString().slice(-6)}`;
      onAddProduct({
        id: generatedId,
        name: prodForm.name,
        description: prodForm.description,
        category: prodForm.category,
        price: Number(prodForm.price),
        rating: 4.5,
        stock: Number(prodForm.stock),
        imageUrl: prodForm.imageUrl,
      });
      setIsAddingProduct(false);
    }

    // Reset Form
    setProdForm({
      name: '',
      description: '',
      category: 'Jewelry',
      price: 650,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
    });
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      description: prod.description,
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      imageUrl: prod.imageUrl,
    });
    setFormError('');
    setIsAddingProduct(false);
  };

  const handleUserModifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUserProfile(editingUser);
      setEditingUser(null);
    }
  };

  const handleAddNewProductCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name.trim() || !newProd.description.trim()) {
      setNewProdError('Please enter a valid product name and description.');
      return;
    }
    if (newProd.price < 500 || newProd.price > 1000) {
      setNewProdError('Product price MUST be between ₹500 and ₹1,000 according to current store rules.');
      return;
    }

    setNewProdError('');
    const generatedId = `prod-${Date.now().toString().slice(-6)}`;
    onAddProduct({
      id: generatedId,
      name: newProd.name.trim(),
      description: newProd.description.trim(),
      category: newProd.category,
      price: Number(newProd.price),
      rating: 4.5,
      stock: Number(newProd.stock),
      imageUrl: newProd.imageUrl
    });

    // Reset fields to classic placeholder
    setNewProd({
      name: '',
      description: '',
      category: 'Jewelry',
      price: 650,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
    });
    setUploadedFileName('');
    alert('Accessory successfully added to the live catalog!');
  };

  const handleSelectPreset = (preset: typeof PREMIUM_ACC_PRESETS[0]) => {
    setNewProd({
      name: preset.name,
      description: preset.desc,
      category: preset.category,
      price: preset.price,
      stock: 30,
      imageUrl: preset.url
    });
    setUploadedFileName('');
    setNewProdError('');
  };

  const handleCatalogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setNewProdError('The selected image is larger than 2MB. Please choose a smaller file.');
        return;
      }
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewProd(prev => ({ ...prev, imageUrl: reader.result }));
          setNewProdError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-250 overflow-hidden shadow-xs">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
            <span className="text-[10px] bg-red-900/60 text-rose-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-red-700/50">
              Administrative Console Secure
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-sans mt-1">Saffron Store Management</h2>
          <p className="text-slate-400 text-xs font-medium">Control inventory products, update COD orders dispatch, and manage client registry directories.</p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('WARNING: This will reset all local storage products to original 15, erase orders, and reload defaults. Proceed?')) {
              onResetDatabase();
            }
          }}
          className="flex items-center gap-1 bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
          title="Reset back to safe defaults"
        >
          <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
          <span>Reset Database</span>
        </button>
      </div>

      {/* Selector tab controls */}
      <div className="flex border-b border-slate-200 bg-white overflow-x-auto">
        <button
          onClick={() => setActiveTab('manage-catalog')}
          id="admin-tab-manage-catalog"
          className={`flex items-center gap-2.5 px-6 py-4 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'manage-catalog'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-slate-50/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PackagePlus className="w-4 h-4 text-rose-500 font-bold" /> Add / Remove Cabinet ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          id="admin-tab-products"
          className={`flex items-center gap-2.5 px-6 py-4 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'products'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-slate-50/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="w-4 h-4 text-emerald-500" /> Products Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          id="admin-tab-orders"
          className={`flex items-center gap-2.5 px-6 py-4 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'orders'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-slate-50/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-sky-500" /> COD Dispatch ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          id="admin-tab-users"
          className={`flex items-center gap-2.5 px-6 py-4 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'users'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-slate-50/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users2 className="w-4 h-4 text-indigo-500" /> Profiles & Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          id="admin-tab-analytics"
          className={`flex items-center gap-2.5 px-6 py-4 text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'analytics'
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-slate-50/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart4 className="w-4 h-4 text-amber-500" /> Store Insights
        </button>
      </div>

      <div className="p-6">
        
        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 border border-slate-150 rounded-2xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Delivered Revenue</span>
                  <span className="font-mono text-xl font-extrabold text-emerald-800">₹{totalIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 border border-slate-150 rounded-2xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Transit / Pending Value</span>
                  <span className="font-mono text-xl font-extrabold text-indigo-800">₹{pendingAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
                  <BarChart4 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 border border-slate-150 rounded-2xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Active Catalog Items</span>
                  <span className="font-mono text-xl font-extrabold text-slate-800">{products.length} Products</span>
                </div>
                <div className="bg-slate-100 text-slate-600 p-2.5 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 border border-slate-150 rounded-2xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Registered Shoppers</span>
                  <span className="font-mono text-xl font-extrabold text-sky-800">{users.length} shoppers</span>
                </div>
                <div className="bg-sky-50 text-sky-600 p-2.5 rounded-xl">
                  <Users2 className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Category breakdown bento-grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 border border-slate-150 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Stock Breakdown by Category</h4>
                <div className="space-y-3 mt-1.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Jewelry</span>
                      <span className="font-bold">{jewelryCount} Products</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full" style={{ width: `${(jewelryCount / (products.length || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Bags & Clutches</span>
                      <span className="font-bold">{bagsCount} Products</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${(bagsCount / (products.length || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Scarves & Shawls</span>
                      <span className="font-bold">{scarvesCount} Products</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${(scarvesCount / (products.length || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Hair Accessories</span>
                      <span className="font-bold">{hairCount} Products</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: `${(hairCount / (products.length || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Footwear</span>
                      <span className="font-bold">{footwearCount} Products</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-400 h-full" style={{ width: `${(footwearCount / (products.length || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order statuses review */}
              <div className="bg-white p-5 border border-slate-150 rounded-2xl flex flex-col justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">COD Dispatch Pipeline Ratio</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="border border-slate-100 p-3 rounded-xl bg-orange-50/20 text-center">
                    <span className="text-amber-600 font-bold block text-lg font-mono">{orders.filter(o => o.status === 'Pending').length}</span>
                    <span className="text-slate-500 text-[11px]">Pending Approval</span>
                  </div>
                  <div className="border border-slate-100 p-3 rounded-xl bg-blue-50/20 text-center">
                    <span className="text-blue-600 font-bold block text-lg font-mono">{orders.filter(o => o.status === 'Shipped').length}</span>
                    <span className="text-slate-500 text-[11px]">Shipped / In Transit</span>
                  </div>
                  <div className="border border-slate-100 p-3 rounded-xl bg-emerald-50/20 text-center">
                    <span className="text-emerald-600 font-bold block text-lg font-mono">{orders.filter(o => o.status === 'Delivered').length}</span>
                    <span className="text-slate-500 text-[11px]">Delivered & Settled</span>
                  </div>
                  <div className="border border-slate-100 p-3 rounded-xl bg-rose-50/20 text-center">
                    <span className="text-rose-600 font-bold block text-lg font-mono">{orders.filter(o => o.status === 'Cancelled').length}</span>
                    <span className="text-slate-500 text-[11px]">Cancelled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Control banner */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Inventory Product Rows</h3>
              
              {(!isAddingProduct && !editingProduct) && (
                <button
                  onClick={() => setIsAddingProduct(true)}
                  id="admin-add-product-btn"
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl text-xs shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Product Item
                </button>
              )}
            </div>

            {/* FORM CONTAINER FOR ADD / EDIT */}
            {(isAddingProduct || editingProduct) && (
              <div className="bg-white border border-indigo-100 p-5 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-50 pb-3">
                  <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                    <PackagePlus className="w-4 h-4 text-indigo-600" />
                    {editingProduct ? `Modify: "${editingProduct.name}"` : 'Construct New Product'}
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-650"
                  >
                    <X className="w-4 w-4" />
                  </button>
                </div>

                {formError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    {formError}
                  </div>
                )}

                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Product Title / Name *</label>
                    <input
                      type="text"
                      value={prodForm.name}
                      onChange={(e) => setProdForm({...prodForm, name: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 bg-white"
                      placeholder="e.g. Traditional Fine Cotton Stole"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category Group *</label>
                    <select
                      value={prodForm.category}
                      onChange={(e) => setProdForm({...prodForm, category: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Jewelry">Jewelry</option>
                      <option value="Scarves & Shawls">Scarves & Shawls</option>
                      <option value="Bags & Clutches">Bags & Clutches</option>
                      <option value="Hair Accessories">Hair Accessories</option>
                      <option value="Footwear">Footwear</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Price (Rupees)* (Min: 500 - Max: 1000)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 font-bold font-sans text-slate-400">₹</span>
                      <input
                        type="number"
                        min={500}
                        max={1000}
                        value={prodForm.price}
                        onChange={(e) => setProdForm({...prodForm, price: Number(e.target.value)})}
                        className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-2 font-mono font-bold focus:ring-1 focus:ring-indigo-500 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Initial Stock Units *</label>
                    <input
                      type="number"
                      min={0}
                      value={prodForm.stock}
                      onChange={(e) => setProdForm({...prodForm, stock: Number(e.target.value)})}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono focus:ring-1 focus:ring-indigo-500 bg-white"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Product Image Link/URL *</label>
                    <input
                      type="url"
                      value={prodForm.imageUrl}
                      onChange={(e) => setProdForm({...prodForm, imageUrl: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono focus:ring-1 focus:ring-indigo-500 bg-white text-[11px]"
                      placeholder="https://images.unsplash.com/promo-url-sample"
                      required
                    />
                    <div className="flex gap-2.5 mt-1.5 overflow-x-auto py-1">
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium py-1">Direct Preset Options:</span>
                      <button
                        type="button"
                        onClick={() => setProdForm({...prodForm, imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=60'})}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md shrink-0"
                      >
                        Elegant Watch
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdForm({...prodForm, imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&auto=format&fit=crop&q=60'})}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md shrink-0"
                      >
                        Indian Ceramic Vases
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdForm({...prodForm, imageUrl: 'https://images.unsplash.com/photo-1590244921253-1261a3afbb2a?w=500&auto=format&fit=crop&q=60'})}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md shrink-0"
                      >
                        Leather Bags
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Product Description Description *</label>
                    <textarea
                      value={prodForm.description}
                      onChange={(e) => setProdForm({...prodForm, description: e.target.value})}
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 bg-white"
                      placeholder="Describe raw organic design, material attributes, durability details..."
                      required
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="bg-white hover:bg-slate-50 border border-slate-250 font-semibold py-2 px-4 rounded-xl transition-all"
                    >
                      Bypass / Cancel
                    </button>
                    <button
                      type="submit"
                      id="save-product-submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-xl transition-all shadow-xs"
                    >
                      {editingProduct ? 'Commit Modification' : 'Introduce Product'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PRODUCT GRID TABLE */}
            <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-150 tracking-wider">
                    <tr>
                      <th className="p-4">Visual</th>
                      <th className="p-4">Product Details</th>
                      <th className="p-4">Price (Rupees)</th>
                      <th className="p-4">In Stock Units</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-100 placeholder bg-slate-50"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="p-4 max-w-[240px]">
                          <p className="font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                          <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-900">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4">
                          <span className={`font-mono font-bold ${p.stock <= 0 ? 'text-rose-600' : p.stock < 5 ? 'text-amber-600' : 'text-slate-600'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2 text-slate-500">
                            <button
                              onClick={() => startEditProduct(p)}
                              id={`edit-product-${p.id}`}
                              className="p-1 px-2 text-xs bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete product "${p.name}"?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              id={`delete-product-${p.id}`}
                              className="p-1 px-2 text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1 transition-colors"
                              title="Archive Details"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> <span>Archive</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Cash On Delivery Order Registers</h3>
              <p className="text-[10px] text-slate-400 font-mono">Total placed: {orders.length}</p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-150">
                <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-xs font-semibold">No active orders placed by consumers.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-xs hover:border-slate-350 transition-colors">
                    {/* Header bar */}
                    <div className="bg-slate-50 border-b border-slate-150 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <strong className="text-slate-800 font-mono text-[13px]">{o.id}</strong>
                        <span className="text-slate-400 font-medium">Placed on: {o.orderDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Live Stage:</span>
                        <select
                          value={o.status}
                          id={`order-status-select-${o.id}`}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="font-bold border border-slate-200 rounded-lg bg-white p-1 text-[11px] focus:outline-hidden"
                        >
                          <option value="Pending">🕒 Pending Decision</option>
                          <option value="Shipped">🚚 Shipped / In Transit</option>
                          <option value="Delivered">✅ Delivered & Collected</option>
                          <option value="Cancelled">❌ Cancelled Order</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer overview */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider mb-1">Customer Demographic</p>
                        <p className="font-bold text-slate-800">{o.userName}</p>
                        <p className="text-slate-500 font-mono">{o.userEmail}</p>
                        <p className="text-slate-500 font-mono mt-0.5">Phone: {o.contactPhone}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-455 uppercase font-bold tracking-wider mb-1">Shipping Destination</p>
                        <p className="text-slate-650 leading-relaxed font-normal">{o.shippingAddress}</p>
                      </div>

                      <div className="md:border-l border-slate-100 md:pl-6 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-slate-460 uppercase font-bold tracking-wider mb-1">Financial Receipt</p>
                          <div className="font-normal font-sans text-slate-500">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[11px]">
                                <span className="truncate max-w-[120px]">{it.name}</span>
                                <span className="font-mono">{it.quantity}x</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 mt-2.5 border-t border-dashed border-slate-100">
                          <span className="font-bold text-slate-700">Total COD Cost:</span>
                          <span className="font-mono text-[14px] font-black text-emerald-800">₹{o.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USERS / PROFILES TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Consumer Registration Records</h3>
            
            {/* User details editing subform */}
            {editingUser && (
              <div className="bg-white border border-indigo-100 p-4 rounded-xl shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-indigo-950 flex items-center justify-between">
                  <span>Modify User Details for "{editingUser.name}"</span>
                  <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </h4>
                <form onSubmit={handleUserModifySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Consumer Name</label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      className="w-full border border-slate-200 px-2 py-1.5 rounded-lg bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Contact Phone</label>
                    <input
                      type="text"
                      value={editingUser.phone}
                      onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                      className="w-full border border-slate-200 px-2 py-1.5 rounded-lg bg-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-600 mb-0.5">Static Shipping Address</label>
                    <textarea
                      value={editingUser.address}
                      onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                      rows={2}
                      className="w-full border border-slate-200 px-2 py-1.5 rounded-lg bg-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="bg-white border border-slate-250 py-1 px-3 rounded-lg"
                    >
                      Bypass
                    </button>
                    <button
                      type="submit"
                      id="save-user-profile"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-4 rounded-lg font-semibold"
                    >
                      Commit Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-150 tracking-wider">
                    <tr>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Telephone</th>
                      <th className="p-4">Default COD Address</th>
                      <th className="p-4">Join Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 uppercase">
                              {u.name[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{u.name}</p>
                              <span className="text-[10px] font-mono text-slate-400 block">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono">{u.phone || 'N/A'}</td>
                        <td className="p-4 max-w-[200px] truncate" title={u.address}>
                          {u.address}
                        </td>
                        <td className="p-4 font-mono text-slate-500 text-[11px]">{u.registeredDate}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingUser(u)}
                              id={`edit-user-${u.id}`}
                              className="p-1 px-2 border border-slate-200 hover:border-slate-350 text-slate-700 rounded-lg bg-white font-medium"
                            >
                              Edit Info
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you absolutely sure you want to delete profile registry for "${u.name}"?`)) {
                                  onDeleteUserProfile(u.id);
                                }
                              }}
                              id={`delete-user-${u.id}`}
                              className="p-1 px-2 bg-rose-50 border border-rose-220 text-rose-600 rounded-lg hover:bg-rose-100"
                            >
                              Revoke
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
