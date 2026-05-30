import { Product, Order, UserProfile } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Kundan Meenakari Jhumka Earrings',
    description: 'Traditionally crafted brass jhumkas featuring colorful meenakari work, premium pearls, and semi-precious kundan stone-work. Elegant accessory for weddings and celebratory ensembles.',
    category: 'Jewelry',
    price: 599,
    rating: 4.8,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-02',
    name: 'Handwoven Banarasi Silk Stole',
    description: 'Luxurious pure silk stole adorned with fine golden zari brocade weave patterns. Brings royal shine and elegant heritage to any ethnic outfit.',
    category: 'Scarves & Shawls',
    price: 850,
    rating: 4.6,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-03',
    name: 'Embellished Silk Potli Clutch',
    description: 'Elegant drawstring potli bag accented with dazzling golden bead fringes, intricate gota patti embroidery, and pearl tassels. Ideal accessory for festive days.',
    category: 'Bags & Clutches',
    price: 720,
    rating: 4.9,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-04',
    name: 'Silver-Plated Ghungroo Payal (Anklet)',
    description: 'Traditional oxidised silver-plated dual anklets lined with hand-tuned small chiming brass bells (ghungroos). Gentle acoustic tone with modern secure clasp.',
    category: 'Jewelry',
    price: 540,
    rating: 4.4,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-05',
    name: 'Brass Engraved Statement Cuff Bangle',
    description: 'Open-ended, highly adjustable brass forearm collector cuff. Deeply engraved with classical patterns inspired by royal temple architecture.',
    category: 'Jewelry',
    price: 580,
    rating: 4.7,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-06',
    name: 'Floral Threadwork Evening Clutch',
    description: 'Hard shell rectangular evening clutch featuring dense hand-embroidered floral motifs, fine gold metallic trim, and a detachable shoulder chain hook.',
    category: 'Bags & Clutches',
    price: 899,
    rating: 4.5,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a4a0?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-07',
    name: 'Hand-Painted Wooden Hair Pins (Set of 3)',
    description: 'Eco-friendly, highly polished dark wood hair sticks adorned with delicate hand-painted Mughal miniature floral crowns.',
    category: 'Hair Accessories',
    price: 510,
    rating: 4.3,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-08',
    name: 'Punjabi Jutti Handcrafted Leather Flats',
    description: 'Beautifully styled festive daily slips with intricate golden tilla embroidery and sequin works. Padded sole offers absolute walking comfort.',
    category: 'Footwear',
    price: 950,
    rating: 4.8,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-09',
    name: 'Kashmiri Jamawar Woolen Scarf',
    description: 'Rich, fine woolen blend scarf adorned with authentic Kashmiri paisley designs and fringed borders. Exceptionally soft and luxurious feel.',
    category: 'Scarves & Shawls',
    price: 799,
    rating: 4.6,
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1520638029027-9c994552c62a?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-10',
    name: 'Filigree Kundan Choker Necklace',
    description: 'Eye-catching ethnic neckpiece featuring fine gold-plated wire filigree work, set with sparkling kundan gems and beautiful mint-green jade drops.',
    category: 'Jewelry',
    price: 980,
    rating: 4.1,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-11',
    name: 'Jaipuri Mirror Work Sling Bag',
    description: 'Compact circular crossbody sling embellished with genuine reflective glass mirrors, multicolored threads, and secure dual zipper lining.',
    category: 'Bags & Clutches',
    price: 850,
    rating: 4.7,
    stock: 16,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-12',
    name: 'Zari-Embroidered Velvet Headband',
    description: 'Padded, comfort-fit deluxe velvet headband featuring delicate hand-trimmed golden zari embroidery and a slip-resistant internal frame.',
    category: 'Hair Accessories',
    price: 720,
    rating: 4.4,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b1a30a8a3a?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-13',
    name: 'Meenakari Floral Temple Ring',
    description: 'Adjustable heritage ring featuring traditional lotus design. Cast in elegant brass alloy coated with hand-painted royal enameling.',
    category: 'Jewelry',
    price: 599,
    rating: 4.8,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-14',
    name: 'Terracotta Hand-Painted Pendant-Set',
    description: 'Eco-friendly, kiln-fired natural clay neckpiece on adjustable soft cords, completely glazed and dual painted with organic herbal tones.',
    category: 'Jewelry',
    price: 680,
    rating: 4.9,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-15',
    name: 'Embroidered Silk Sunglass Case',
    description: 'Hardbound luxury sunglass protective shell covered in fine silk brocade weave, with a custom padded microfiber interior.',
    category: 'Bags & Clutches',
    price: 820,
    rating: 4.5,
    stock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1627124357773-45120092d63c?w=500&auto=format&fit=crop&q=60'
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-01',
    name: 'Rupa Sharma',
    email: 'rupadigital37@gmail.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Lotus Courtyard, Sector 45, Gurgaon, Haryana - 122003',
    registeredDate: '2026-01-15'
  },
  {
    id: 'user-02',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    phone: '+91 87654 32109',
    address: 'B-12, Shanti Niketan, Juhu, Mumbai, Maharashtra - 400049',
    registeredDate: '2026-02-20'
  },
  {
    id: 'user-03',
    name: 'Divya Iyer',
    email: 'divya.iyer@example.com',
    phone: '+91 76543 21098',
    address: 'Block-C, 7th Floor, Prestige Heights, Whitefield, Bengaluru, Karnataka - 560066',
    registeredDate: '2026-03-05'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-001',
    userId: 'user-01',
    userEmail: 'rupadigital37@gmail.com',
    userName: 'Rupa Sharma',
    items: [
      {
        productId: 'prod-01',
        name: 'Kundan Meenakari Jhumka Earrings',
        price: 599,
        quantity: 1
      },
      {
        productId: 'prod-14',
        name: 'Terracotta Hand-Painted Pendant-Set',
        price: 680,
        quantity: 1
      }
    ],
    totalAmount: 1279,
    shippingAddress: 'Flat 402, Lotus Courtyard, Sector 45, Gurgaon, Haryana - 122003',
    contactPhone: '+91 98765 43210',
    paymentMethod: 'Cash on Delivery',
    orderDate: '2026-05-20',
    status: 'Delivered'
  },
  {
    id: 'ORD-2026-002',
    userId: 'user-02',
    userEmail: 'amit.patel@example.com',
    userName: 'Amit Patel',
    items: [
      {
        productId: 'prod-11',
        name: 'Jaipuri Mirror Work Sling Bag',
        price: 850,
        quantity: 1
      }
    ],
    totalAmount: 850,
    shippingAddress: 'B-12, Shanti Niketan, Juhu, Mumbai, Maharashtra - 400049',
    contactPhone: '+91 87654 32109',
    paymentMethod: 'Cash on Delivery',
    orderDate: '2026-05-25',
    status: 'Shipped'
  },
  {
    id: 'ORD-2026-003',
    userId: 'user-03',
    userEmail: 'divya.iyer@example.com',
    userName: 'Divya Iyer',
    items: [
      {
        productId: 'prod-05',
        name: 'Brass Engraved Statement Cuff Bangle',
        price: 580,
        quantity: 1
      },
      {
        productId: 'prod-13',
        name: 'Meenakari Floral Temple Ring',
        price: 599,
        quantity: 1
      }
    ],
    totalAmount: 1179,
    shippingAddress: 'Block-C, 7th Floor, Prestige Heights, Whitefield, Bengaluru, Karnataka - 560066',
    contactPhone: '+91 76543 21098',
    paymentMethod: 'Cash on Delivery',
    orderDate: '2026-05-28',
    status: 'Pending'
  }
];
