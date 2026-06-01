import React, { useState } from 'react';
import { Product } from '../types';
import { BookOpen, Calendar, ArrowRight, User, Tag, Search, Star, Sparkles, X } from 'lucide-react';

interface BlogViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: 'Weaving Techniques' | 'Jewelry Origins' | 'Leather & Footwear' | 'Craft Heritage';
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  featuredProductId?: string; // Links back to store products
}

const CONSTANT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The revival of kundan meenakari filigree jewelry',
    excerpt: 'An exploration of ancient metallic fusion, intricate stone-setting, and pure glass enameling inside the traditional ateliers of Jaipur and Bikaner.',
    category: 'Jewelry Origins',
    author: 'Kavita Sen',
    date: 'May 28, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    featuredProductId: 'prod-01', // Kundan Meenakari Jhumka Earrings
    content: [
      'Deep inside the historic pink-walled alleyways of Jaipur, master artisans of meenakari continue to fuse gold, silver, and copper wire with vibrant glass powders. This ancient craft, brought to the royal courts of Rajasthan in the 16th century, represents one of humanity’s most high-fidelity decorative traditions.',
      'Meenakari is the intricate process of coloring and ornamenting the surface of metal by fusing over it brilliant colors that are decorated in an intricate design. On the reverse side, the gem setter performs Kundan work—the meticulous laying of pure, highly refined gold foils (Kundan) around semi-precious and precious gemstones.',
      'Historically, each single piece of jhumka or choker represents an ecosystem of specialization. The "Chitera" draws the base design, the "Ghaaria" punches out the metal cavities, the "Meenakar" meticulously paints the colored enamel powders, and the "Nishaangar" fits the gems. It is a slow, spiritual dialogue between hands and fire.',
      'Today, the challenge is keeping this painstaking precision relevant for contemporary wardrobes. By casting these intricate designs in durable, modern alloy bases while preserving authentic glass-fired colors, modern boutiques are giving heirloom craft a renewed lease on life.'
    ]
  },
  {
    id: 'post-2',
    title: 'weaving the winds: the pure banarasi silk stoles',
    excerpt: 'Tracing the complex zari embroidery and handloom jacquard patterns woven by generational families alongside the ghats of the Ganges.',
    category: 'Weaving Techniques',
    author: 'Advait Rao',
    date: 'May 22, 2026',
    readTime: '8 min read',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    featuredProductId: 'prod-02', // Handwoven Banarasi Silk Stole
    content: [
      'The rhythmic clatter of the wooden handloom is the ancient heartbeat of Banaras (Varanasi). For over a thousand years, weavers in this holy geographical pocket have manufactured silks so light they were described by Mughal chroniclers as "woven air."',
      'Our pure Banarasi silk stoles are celebrated for the delicate insertion of "zari"—luxurious metallic threads wrapped tightly around a core yarn. Under the control of generational master artisans, three weavers must synchronize their breathing at a single loom to move up to 5,000 warp threads individually.',
      'The motifs themselves are a visual encyclopedia of regional cultural crossovers. You will find paisley (Kalka), floral creepers (Bel), and small stars (Butidar) that blend Persian botanical poetry with traditional Indian temple architecture.',
      'Owning a Banarasi handloom piece is not merely acquiring premium apparel. It is maintaining a lineage of independent weaving families who resist the mechanized speed of mass power-looms to preserve real human imperfection and raw textural luxury.'
    ]
  },
  {
    id: 'post-3',
    title: 'kutchi embroidery: geometric mirrors of desert tribes',
    excerpt: 'How the nomadic pastoralists of Kutch sew mirror fragments into robust canvas to create shields of protection and vibrant tribal identity.',
    category: 'Craft Heritage',
    author: 'Meera Solanki',
    date: 'May 16, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    featuredProductId: 'prod-03', // Embellished Silk Potli Clutch
    content: [
      'In the harsh, saline white deserts of the Rann of Kutch, color is not an ornament—it is a survival mechanism. Nomadic embroidery tribes like the Rabari and Mutwa have spent centuries stitching bright crimson, gold, and dark green patterns onto garments, camel saddles, and bags.',
      'The defining signature of Kutchi work is "abhla"—small, hand-clipped circular mirrors held in place by absolute geometry of buttonhole button stitches. These reflective shards serve a beautiful psychological function: they are believed to deflect evil glances and scare predatory wild fauna by scattering dry desert sunlight.',
      'Each embroidery stitch tells a specific community story. For example, Rabari embroidery is dominated by tight, dark outlines resembling agricultural crop rows, punctuated with square mirror quadrants signifying tribal water wells.',
      'When these dense, mirror-work textiles are adapted onto compact modern styles like Potli clutches or evening envelope bags, they instantly transform simple attire into iconic statement items rich in cultural storytelling.'
    ]
  },
  {
    id: 'post-4',
    title: 'the legacy of genuine handcrafted kolhapuri leather',
    excerpt: 'Unveiling the detailed hand-braiding, tanning, and acoustic seed inserts of Maharastrian footwear craftsmanship dating back to the 12th century.',
    category: 'Leather & Footwear',
    author: 'Rahul Shinde',
    date: 'May 09, 2026',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
    featuredProductId: 'prod-08', // Punjabi Jutti Handcrafted Leather Flats
    content: [
      'Authentic regional footwear represents one of India’s oldest, most climate-resilient crafts. Traditional leather flatware from Maharashtra—the famous Kolhapuris—have been engineered across generations to stay cool, flexible, and completely biodegradable.',
      'A true handcrafted jutti or sandal contains absolutely no iron nails or synthetic adhesives. Every junction is stitched with thick cotton cords and bound with natural oils. Generation-old cobbler guilds first condition the hide with regional wood bark tannins and custom oils to make it thoroughly breathable.',
      'Another delightful detail is the inclusion of "parva"—small woven leather tubes filled with dry seeds placed in the middle of the dual-sole layers. This produces a faint, rhythmic acoustic rustle as the wearer strides, historically used by royalty to announce their elegant arrival.',
      'By honoring these natural materials and avoiding aggressive industrial processing, each pair of traditional footwear retains the biological signature of the leather, slowly molding to the unique shape of your foot over time.'
    ]
  }
];

export function BlogView({ products, onSelectProduct, onAddToCart }: BlogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setCouponCode('HERITAGE20'); // Flash coupon code reward
  };

  const blogCategories = ['All', 'Weaving Techniques', 'Jewelry Origins', 'Leather & Footwear', 'Craft Heritage'];

  const filteredPosts = CONSTANT_BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 animate-fade-in relative">
      
      {/* Blog Hero Intro Banner */}
      <div className="text-center space-y-3 py-6 border-b border-zinc-100">
        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-mono">
          RupeeStore Chronicle & Archives
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-zinc-950 tracking-tight lowercase">
          the heritage gazette
        </h2>
        <div className="w-12 h-0.5 bg-zinc-950 mx-auto"></div>
        <p className="text-zinc-550 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
          Educating contemporary minds on the geometric symmetry, spiritual symbols, and architectural marvels preserved inside Indian heritage crafts.
        </p>
      </div>

      {/* Categories & Search Panel */}
      <div className="bg-zinc-50/50 border border-zinc-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80 shrink-0">
          <span className="absolute left-3 top-2.5 text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-zinc-200 focus:outline-hidden focus:border-zinc-950 text-xs text-zinc-800 rounded-none bg-white"
            placeholder="Search our chronicles..."
          />
        </div>

        {/* Category Toggling Buttons */}
        <div className="flex flex-wrap gap-1.5 items-center justify-center">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] tracking-wider uppercase font-mono px-3 py-1.5 transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-zinc-950 border-zinc-950 text-white font-bold'
                  : 'bg-white border-zinc-150 hover:bg-zinc-50 text-zinc-650'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View of Articles */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50/50 border border-dashed border-zinc-200">
          <BookOpen className="w-8 h-8 text-zinc-350 mx-auto mb-2 stroke-1" />
          <p className="text-zinc-600 text-sm font-serif">No articles match your selection.</p>
          <button 
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="text-xs text-zinc-950 underline font-bold mt-2 hover:text-zinc-750"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => {
            // Find linked product if any
            const linkedProduct = products.find((p) => p.id === post.featuredProductId);
            
            return (
              <article 
                key={post.id}
                className="bg-white border border-zinc-100 flex flex-col justify-between group overflow-hidden hover:border-zinc-300 transition-all duration-350 shadow-xs"
              >
                <div className="space-y-4">
                  
                  {/* Visual Post cover */}
                  <div className="aspect-video w-full overflow-hidden bg-zinc-100 relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-103"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white text-zinc-950 text-[9px] font-bold tracking-widest uppercase px-3 py-1 font-mono">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="p-6 md:p-8 space-y-3">
                    <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {post.author}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {post.date}
                      </span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-serif font-medium text-zinc-950 tracking-tight leading-tight lowercase group-hover:text-zinc-700 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-zinc-600 text-xs leading-relaxed font-sans font-light">
                      {post.excerpt}
                    </p>
                  </div>

                </div>

                {/* Footer and interactive call-to-actions */}
                <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-50">
                  <button 
                    onClick={() => setActivePost(post)}
                    className="inline-flex items-center gap-1.5 text-zinc-950 hover:text-zinc-600 text-xs font-bold uppercase tracking-widest font-mono cursor-pointer"
                  >
                    Read Article <ArrowRight className="w-4 h-4" />
                  </button>

                  {linkedProduct && (
                    <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 p-1.5 pr-3 text-[10px]">
                      <img 
                        src={linkedProduct.imageUrl} 
                        alt="featured product shortcut" 
                        className="w-6 h-6 object-cover bg-zinc-100"
                      />
                      <div className="leading-tight text-left">
                        <span className="text-zinc-400 uppercase font-mono tracking-widest text-[8px] block">Related Piece</span>
                        <span className="font-bold text-zinc-800 line-clamp-1 block translate-y-[-1px]">{linkedProduct.name}</span>
                      </div>
                      <button 
                        onClick={() => onSelectProduct(linkedProduct)}
                        className="text-zinc-600 hover:text-zinc-950 font-bold ml-2 underline"
                        title="View product details modal"
                      >
                        view
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Gazette Newsletter subscription card matching elite brand styles */}
      <div className="bg-zinc-950 text-white p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-md mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 font-mono text-[9px] tracking-widest uppercase text-zinc-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> join the guild
          </div>
          <h3 className="text-2xl md:text-3xl font-serif tracking-tight font-medium lowercase">
            subscribe to the premium gazette
          </h3>
          <p className="text-zinc-400 text-xs font-light leading-relaxed">
            Gain bi-monthly articles exploring traditional Indian weave patterns, metallurgical castings, and exclusive first-look access to antique drop-off releases.
          </p>

          {subscribed ? (
            <div className="bg-white/10 border border-white/10 p-5 space-y-2 animate-fade-in text-left">
              <p className="text-xs text-emerald-400 font-mono tracking-wider uppercase font-bold text-center">✓ Subscription confirmed successfully!</p>
              <div className="p-3 bg-zinc-900 border border-zinc-800 text-center space-y-1">
                <span className="text-[10px] text-zinc-400 block uppercase font-mono tracking-widest">welcome newsletter flat coupon reward</span>
                <span className="font-mono text-xl font-extrabold text-white tracking-widest select-all">{couponCode}</span>
                <span className="text-[9px] text-zinc-500 block">Copy code at checkout to unlock savings. Eligible for genuine COD order bundles.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="bg-zinc-900/80 border border-zinc-800 text-white text-xs px-4 py-3 placeholder:text-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-white rounded-none flex-grow"
              />
              <button 
                type="submit"
                className="bg-white hover:bg-zinc-150 text-zinc-950 font-bold uppercase tracking-widest text-[11px] py-3 px-6 transition-colors duration-200 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FULL BLOG POST PERSISTENT READER MODAL OVERLAY */}
      {activePost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white max-w-3xl w-full h-full max-h-[85vh] flex flex-col justify-between shadow-2xl relative border border-zinc-150 animate-scale-up">
            
            {/* Header control */}
            <div className="border-b border-zinc-100 p-4 md:p-6 flex items-center justify-between bg-zinc-50 shrink-0">
              <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                <Tag className="w-3.5 h-3.5" />
                <span>{activePost.category}</span>
                <span>•</span>
                <span>{activePost.readTime}</span>
              </div>
              <button 
                onClick={() => setActivePost(null)}
                className="p-1 text-zinc-400 hover:text-zinc-950 transition-colors"
                title="Close reading console"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable deep editorial view body */}
            <div className="p-6 md:p-10 space-y-6 overflow-y-auto flex-grow text-left">
              
              <div className="space-y-3 pb-4 border-b border-zinc-100">
                <h1 className="text-3xl md:text-4xl font-serif text-zinc-950 leading-tight tracking-tight lowercase">
                  {activePost.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 items-center text-xs text-zinc-400 font-mono pt-1">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Writer: {activePost.author}</span>
                  <span>|</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date: {activePost.date}</span>
                </div>
              </div>

              {/* Large scenic visual banner representing craft environment */}
              <div className="w-full h-64 md:h-80 overflow-hidden bg-zinc-150 relative">
                <img 
                  src={activePost.imageUrl} 
                  alt={activePost.title} 
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Paragraph narratives styled in premium spacious column */}
              <div className="space-y-5 font-serif text-[15px] md:text-base text-zinc-800 leading-relaxed max-w-2xl mx-auto font-light">
                {activePost.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Connected Products Spotlight Row */}
              {(() => {
                const matched = products.find((p) => p.id === activePost.featuredProductId);
                if (!matched) return null;

                return (
                  <div className="mt-12 bg-zinc-50 border border-zinc-100 p-6 md:p-8 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono font-bold block">
                        authentic regional pieces featured in this chronicle
                      </span>
                      <h4 className="text-lg font-serif font-medium text-zinc-950 lowercase">
                        own a piece of this native craft heritage
                      </h4>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 border border-zinc-100">
                      <img 
                        src={matched.imageUrl} 
                        alt={matched.name} 
                        className="w-24 h-24 object-cover bg-zinc-50"
                      />
                      <div className="flex-grow space-y-2 text-left">
                        <div className="space-y-0.5">
                          <h5 className="font-sans font-bold text-sm text-zinc-900 leading-tight">
                            {matched.name}
                          </h5>
                          <span className="text-xs text-zinc-400 font-mono">{matched.category}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-900 font-mono text-sm font-bold">₹{matched.price}</span>
                          <span className="text-zinc-350 font-light font-mono text-xs">|</span>
                          <span className="text-amber-500 flex items-center gap-0.5 text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 
                            <span className="font-mono font-bold">{matched.rating} rating</span>
                          </span>
                        </div>

                        <p className="text-zinc-500 text-[11px] line-clamp-2 leading-relaxed">
                          {matched.description}
                        </p>
                      </div>

                      <div className="flex flex-col w-full sm:w-auto gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setActivePost(null);
                            onSelectProduct(matched);
                          }}
                          className="bg-zinc-50 hover:bg-zinc-100 text-zinc-950 border border-zinc-200 py-2 px-5 font-mono text-[10px] tracking-wider uppercase font-bold"
                        >
                          Details Zoom
                        </button>
                        <button
                          onClick={() => {
                            onAddToCart(matched);
                          }}
                          className="bg-zinc-950 hover:bg-zinc-850 text-white py-2 px-5 font-mono text-[10px] tracking-wider uppercase font-bold text-center"
                        >
                          Quick Purchase
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Read actions footer */}
            <div className="border-t border-zinc-100 p-4 md:p-6 bg-zinc-50 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-zinc-400 font-mono">
                RupeeStore Digital Archives • Jaipur-Delhi Lineage
              </span>
              <button 
                onClick={() => setActivePost(null)}
                className="bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-[10px] tracking-widest uppercase font-bold py-2.5 px-6"
              >
                Finished Reading
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
