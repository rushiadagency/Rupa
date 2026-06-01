import { supabase } from './supabaseClient';
import { Product, Order, UserProfile } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from './data';

// Connection status test
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      return { 
        connected: false, 
        message: `Supabase reached, but "products" table not found or inaccessible. Error: ${error.message}.`,
        details: error
      };
    }
    return { 
      connected: true, 
      message: 'Supabase Database connected successfully and "products" table is online!' 
    };
  } catch (err: any) {
    return { 
      connected: false, 
      message: `Failed to connect with Supabase. Please check credentials or network. Details: ${err?.message || err}`,
      details: err
    };
  }
}

// Helper to normalize product row keys from DB
function normalizeProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    price: Number(row.price || row.PRICES || 500),
    rating: Number(row.rating || 4.5),
    stock: Number(row.stock !== undefined ? row.stock : 25),
    imageUrl: row.imageUrl || row.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
  };
}

// Helper to normalize user row keys
function normalizeUser(row: any): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    registeredDate: row.registeredDate || row.registered_date || '2026-05-30'
  };
}

// Helper to normalize order row keys
function normalizeOrder(row: any): Order {
  let items = row.items;
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch (_) {
      items = [];
    }
  }
  return {
    id: row.id,
    userId: row.userId || row.user_id || 'user-01',
    userEmail: row.userEmail || row.user_email || '',
    userName: row.userName || row.user_name || 'Customer',
    items: Array.isArray(items) ? items : [],
    totalAmount: Number(row.totalAmount || row.total_amount || 0),
    shippingAddress: row.shippingAddress || row.shipping_address || '',
    contactPhone: row.contactPhone || row.contact_phone || '',
    paymentMethod: 'Cash on Delivery',
    orderDate: row.orderDate || row.order_date || '2026-05-30',
    status: row.status || 'Pending'
  };
}

// PRODUCTS API
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.warn("Could not fetch products from Supabase, falling back to local storage:", error.message);
      return getLocalProducts();
    }
    if (!data || data.length === 0) {
      console.log("Supabase products table is empty, seeding defaults...");
      const seeded = await seedProducts(INITIAL_PRODUCTS);
      return seeded ? INITIAL_PRODUCTS : getLocalProducts();
    }
    return data.map(normalizeProduct);
  } catch (err) {
    console.warn("Supabase products connection failure, falling back to local:", err);
    return getLocalProducts();
  }
}

export async function upsertProduct(product: Product): Promise<boolean> {
  try {
    // We save under both camelCase and snake_case properties to accommodate any DB schema chosen by user
    const dbPayload = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      rating: product.rating,
      stock: product.stock,
      imageUrl: product.imageUrl,
      image_url: product.imageUrl
    };
    const { error } = await supabase.from('products').upsert(dbPayload);
    if (error) {
      console.error("Supabase upsert product error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to upsert product in Supabase:", err);
    return false;
  }
}

export async function deleteProductFromDb(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error("Supabase delete product error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete product in Supabase:", err);
    return false;
  }
}

// USER PROFILES API
export async function fetchUsers(): Promise<UserProfile[]> {
  try {
    // Try user_profiles table first
    const { data: dataProfiles, error: errorProfiles } = await supabase.from('user_profiles').select('*');
    if (!errorProfiles && dataProfiles && dataProfiles.length > 0) {
      return dataProfiles.map(normalizeUser);
    }
    
    // Check alternative table "users"
    const { data: dataUsers, error: errorUsers } = await supabase.from('users').select('*');
    if (!errorUsers && dataUsers && dataUsers.length > 0) {
      return dataUsers.map(normalizeUser);
    }

    // Try seeding 'user_profiles' if table exists but is empty
    if (!errorProfiles && dataProfiles && dataProfiles.length === 0) {
      console.log("Supabase user_profiles table is empty, seeding...");
      await seedUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }

    return getLocalUsers();
  } catch (err) {
    console.warn("Supabase user connection error, using local storage:", err);
    return getLocalUsers();
  }
}

export async function upsertUser(user: UserProfile): Promise<boolean> {
  try {
    const dbPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      registeredDate: user.registeredDate,
      registered_date: user.registeredDate
    };
    
    // Try user_profiles table first
    const { error: profileErr } = await supabase.from('user_profiles').upsert(dbPayload);
    if (profileErr) {
      // Try users alternative
      const { error: userErr } = await supabase.from('users').upsert(dbPayload);
      if (userErr) {
        console.error("Failed to upsert user in both tables:", profileErr.message, userErr.message);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error("Supabase upsert user error:", err);
    return false;
  }
}

export async function deleteUserFromDb(userId: string): Promise<boolean> {
  try {
    const { error: err1 } = await supabase.from('user_profiles').delete().eq('id', userId);
    const { error: err2 } = await supabase.from('users').delete().eq('id', userId);
    return !err1 || !err2;
  } catch (err) {
    return false;
  }
}

// ORDERS API
export async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) {
      console.warn("Could not fetch orders from Supabase:", error.message);
      return getLocalOrders();
    }
    if (!data || data.length === 0) {
      console.log("Supabase orders table is empty, seeding defaults...");
      await seedOrders(INITIAL_ORDERS);
      return INITIAL_ORDERS;
    }
    return data.map(normalizeOrder);
  } catch (err) {
    console.warn("Supabase orders connection error:", err);
    return getLocalOrders();
  }
}

export async function upsertOrder(order: Order): Promise<boolean> {
  try {
    const dbPayload = {
      id: order.id,
      userId: order.userId,
      user_id: order.userId,
      userEmail: order.userEmail,
      user_email: order.userEmail,
      userName: order.userName,
      user_name: order.userName,
      items: order.items, // PostgREST converts object/array parameter to JSON/JSONB automagically
      totalAmount: order.totalAmount,
      total_amount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      shipping_address: order.shippingAddress,
      contactPhone: order.contactPhone,
      contact_phone: order.contactPhone,
      paymentMethod: order.paymentMethod,
      payment_method: order.paymentMethod,
      orderDate: order.orderDate,
      order_date: order.orderDate,
      status: order.status
    };
    const { error } = await supabase.from('orders').upsert(dbPayload);
    if (error) {
      console.error("Supabase upsert order error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to upsert order in Supabase:", err);
    return false;
  }
}

// SEED UTILITIES WITH SILENT DESTRUCTIONS
async function seedProducts(items: Product[]): Promise<boolean> {
  try {
    const payloads = items.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      rating: p.rating,
      stock: p.stock,
      imageUrl: p.imageUrl,
      image_url: p.imageUrl
    }));
    const { error } = await supabase.from('products').upsert(payloads);
    return !error;
  } catch (_) {
    return false;
  }
}

async function seedUsers(items: UserProfile[]) {
  try {
    const payloads = items.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      address: u.address,
      registeredDate: u.registeredDate,
      registered_date: u.registeredDate
    }));
    await supabase.from('user_profiles').upsert(payloads);
  } catch (_) {
    try {
      const payloads = items.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        address: u.address,
        registeredDate: u.registeredDate,
        registered_date: u.registeredDate
      }));
      await supabase.from('users').upsert(payloads);
    } catch (_) {}
  }
}

async function seedOrders(items: Order[]) {
  try {
    const payloads = items.map(o => ({
      id: o.id,
      userId: o.userId,
      user_id: o.userId,
      userEmail: o.userEmail,
      user_email: o.userEmail,
      userName: o.userName,
      user_name: o.userName,
      items: o.items,
      totalAmount: o.totalAmount,
      total_amount: o.totalAmount,
      shippingAddress: o.shippingAddress,
      shipping_address: o.shippingAddress,
      contactPhone: o.contactPhone,
      contact_phone: o.contactPhone,
      paymentMethod: o.paymentMethod,
      payment_method: o.paymentMethod,
      orderDate: o.orderDate,
      order_date: o.orderDate,
      status: o.status
    }));
    await supabase.from('orders').upsert(payloads);
  } catch (e) {
    console.error("Seed orders fail:", e);
  }
}

// LOCAL RETRIEVALS
function getLocalProducts(): Product[] {
  const saved = localStorage.getItem('rupeestore_products');
  return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
}

function getLocalUsers(): UserProfile[] {
  const saved = localStorage.getItem('rupeestore_users');
  return saved ? JSON.parse(saved) : INITIAL_USERS;
}

function getLocalOrders(): Order[] {
  const saved = localStorage.getItem('rupeestore_orders');
  return saved ? JSON.parse(saved) : INITIAL_ORDERS;
}
