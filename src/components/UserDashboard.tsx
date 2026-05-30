import React, { useState } from 'react';
import { Order, Product, UserProfile } from '../types';
import { Package, Heart, User, LogOut, Navigation, Save, ShoppingCart, Trash2, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

interface UserDashboardProps {
  currentUser: UserProfile;
  orders: Order[];
  wishlist: string[];
  products: Product[];
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  orders,
  wishlist,
  products,
  onUpdateProfile,
  onRemoveFromWishlist,
  onAddToCart,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  
  // Profile edit states
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const userOrders = orders.filter((o) => o.userId === currentUser.id || o.userEmail === currentUser.email);
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setSuccessMsg('');
    
    setTimeout(() => {
      onUpdateProfile({
        ...currentUser,
        name,
        phone,
        address,
      });
      setIsSavingProfile(false);
      setSuccessMsg('Your delivery profile has been safely updated!');
      // auto-clear success
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 500);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* User Banner Card */}
      <div className="bg-slate-900 px-6 py-8 text-white relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg border-2 border-white/20 uppercase">
              {currentUser.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans">{currentUser.name}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 text-xs mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" /> {currentUser.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" /> {currentUser.phone || 'No phone set'}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            id="user-logout-btn"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-400" /> Logout Dashboard
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-slate-50 border-y border-slate-100 flex overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          id="tab-orders"
          className={`flex items-center gap-2 px-6 py-4.5 text-xs font-bold tracking-wide border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          My Orders ({userOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          id="tab-wishlist"
          className={`flex items-center gap-2 px-6 py-4.5 text-xs font-bold tracking-wide border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'wishlist'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          My Wishlist ({wishlistedProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          id="tab-profile"
          className={`flex items-center gap-2 px-6 py-4.5 text-xs font-bold tracking-wide border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          Shipping Profile
        </button>
      </div>

      {/* Tabs Content */}
      <div className="p-6">
        
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Cash On Delivery Orders History</h3>
            {userOrders.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-100 rounded-xl">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold text-sm">No orders recorded yet</p>
                <p className="text-xs text-slate-400 mt-1">Place Cash On Delivery items from the home store.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div key={order.id} className="border border-slate-150 rounded-xl overflow-hidden hover:border-slate-300 transition-colors bg-white">
                    {/* Header */}
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                      <div className="flex items-center gap-4">
                        <p className="font-mono text-slate-700">
                          <span className="font-semibold text-slate-400 uppercase mr-1">ORDER ID:</span>
                          <strong className="text-slate-800 font-bold">{order.id}</strong>
                        </p>
                        <p className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {order.orderDate}
                        </p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-3 flex-grow max-w-xl">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Purchased Items</p>
                        <div className="grid gap-2 text-xs text-slate-700">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-50 text-slate-800">
                              <span className="truncate max-w-[280px] font-medium">{item.name}</span>
                              <span className="shrink-0 text-slate-500 font-mono">
                                {item.quantity} x ₹{item.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="md:border-l border-slate-100 md:pl-6 shrink-0 flex flex-col justify-between text-xs min-w-[200px]">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-1">Shipping Destination</p>
                          <p className="text-slate-600 line-clamp-2 leading-relaxed">{order.shippingAddress}</p>
                          <p className="text-[10px] font-semibold text-slate-400 mt-1 font-mono">Contact: {order.contactPhone}</p>
                        </div>
                        <div className="pt-3 border-t border-dashed border-slate-100 mt-3 flex justify-between items-center">
                          <span className="font-medium text-slate-500">Payable (COD):</span>
                          <span className="font-mono text-base font-bold text-emerald-800">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-sans">Saves & Wishlisted Stock</h3>
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-100 rounded-xl">
                <Heart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold text-sm">Your Wishlist is empty</p>
                <p className="text-xs text-slate-400 mt-1">Tap hearts on products to gather options here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistedProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  return (
                    <div key={product.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors items-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] uppercase text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                          {product.category}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-800 mt-1 truncate">{product.name}</h4>
                        <span className="text-xs font-mono font-bold text-slate-900 block mt-0.5">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {isOutOfStock && <span className="text-[9px] text-rose-600 font-bold">Out of Stock</span>}
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => onAddToCart(product.id)}
                          disabled={isOutOfStock}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 ${
                            isOutOfStock
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="p-2 rounded-xl text-xs bg-white text-rose-500 hover:text-rose-700 border border-slate-200"
                          title="Delete Wishlist Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Edit Cash on Delivery Address Profile</h3>
            
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-3 px-4 rounded-xl flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Consumer Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden bg-white text-slate-800"
                  required
                />
              </div>

              {/* Readonly registration data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Account Email (Static)</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    className="w-full border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-mono"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Registered Date</label>
                  <input
                    type="text"
                    value={currentUser.registeredDate}
                    className="w-full border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed rounded-xl px-3.5 py-2 text-xs focus:outline-hidden font-mono"
                    disabled
                  />
                </div>
              </div>

              {/* Telephone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Telephone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden bg-white text-slate-800 font-mono"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>

              {/* Main delivery address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary COD Shipping Destination *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden bg-white text-slate-800"
                  placeholder="Insert house details, sector, landmark, city, state, pin"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                id="save-profile-btn"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-xl transition-all flex items-center gap-1.5 text-xs shadow-xs"
              >
                <Save className="w-4 h-4" />
                {isSavingProfile ? 'Saving...' : 'Save Demographics'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
