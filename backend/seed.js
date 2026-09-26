const dotenv = require('dotenv'); 
const Product = require('./models/Product'); 
const connectDB = require('./config/db'); 
dotenv.config();

const curatedProducts = [
  // --- ELECTRONICS ---
  {
    name: 'Noise Cancelling Headphones',
    category: 'Electronics',
    description: 'Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 299.99,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ratings: 4.8,
    numReviews: 124
  },
  {
    name: 'Smart Watch Pro',
    category: 'Electronics',
    description: 'Advanced smartwatch with health tracking, GPS, and a beautiful retina display.',
    price: 399.00,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    ratings: 4.7,
    numReviews: 89
  },
  {
    name: 'Mechanical Gaming Keyboard',
    category: 'Electronics',
    description: 'Tactile mechanical keyboard with customizable RGB lighting and fast response switches.',
    price: 129.99,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    ratings: 4.5,
    numReviews: 56
  },
  {
    name: 'Mirrorless Digital Camera',
    category: 'Electronics',
    description: 'Compact mirrorless camera capable of stunning 4K video and high-resolution photography.',
    price: 899.50,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    ratings: 4.9,
    numReviews: 210
  },

  // --- FASHION ---
  {
    name: 'Classic Red Sneakers',
    category: 'Fashion',
    description: 'Comfortable and stylish red canvas sneakers for everyday street wear.',
    price: 85.00,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    ratings: 4.6,
    numReviews: 75
  },
  {
    name: 'Minimalist Cotton T-Shirt',
    category: 'Fashion',
    description: 'Soft, breathable 100% cotton t-shirt with a classic fit.',
    price: 25.00,
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    ratings: 4.3,
    numReviews: 34
  },
  {
    name: 'Premium Leather Wallet',
    category: 'Fashion',
    description: 'Genuine leather bifold wallet with RFID protection and multiple card slots.',
    price: 45.99,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    ratings: 4.7,
    numReviews: 92
  },
  {
    name: 'Vintage Aviator Sunglasses',
    category: 'Fashion',
    description: 'Classic aviator sunglasses with polarized lenses for maximum UV protection.',
    price: 110.00,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    ratings: 4.8,
    numReviews: 41
  },

  // --- BEAUTY ---
  {
    name: 'Vitamin C Face Serum',
    category: 'Beauty',
    description: 'Brightening daily serum packed with Vitamin C and hyaluronic acid.',
    price: 38.00,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    ratings: 4.9,
    numReviews: 312
  },
  {
    name: 'Matte Red Lipstick',
    category: 'Beauty',
    description: 'Long-lasting, highly pigmented matte lipstick for a bold everyday look.',
    price: 22.50,
    stock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
    ratings: 4.5,
    numReviews: 67
  },
  // --- SPORTS ---
  {
    name: 'Non-Slip Yoga Mat',
    category: 'Sports',
    description: 'Eco-friendly, thick yoga mat providing excellent grip and joint support.',
    price: 35.99,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&w=800&q=80',
    ratings: 4.7,
    numReviews: 211
  },
  {
    name: 'Insulated Steel Bottle',
    category: 'Sports',
    description: 'Double-walled stainless steel water bottle keeps drinks cold for 24 hours.',
    price: 24.99,
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    ratings: 4.9,
    numReviews: 388
  },
  {
    name: 'Adjustable Dumbbell Set',
    category: 'Sports',
    description: 'Space-saving adjustable dumbbells perfect for any home gym setup.',
    price: 199.00,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    ratings: 4.8,
    numReviews: 76
  },
  {
    name: 'Pro Wireless Earbuds',
    category: 'Electronics',
    description: 'Sweat-resistant true wireless earbuds with spatial audio and a wireless charging case.',
    price: 149.99,
    stock: 65,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    ratings: 4.6,
    numReviews: 312
  },
  {
    name: 'High-Capacity Power Bank',
    category: 'Electronics',
    description: '20,000mAh portable charger capable of fast-charging two devices simultaneously.',
    price: 45.99,
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
    ratings: 4.7,
    numReviews: 455
  },
  {
    name: 'Waterproof Bluetooth Speaker',
    category: 'Electronics',
    description: 'Rugged, IPX7 waterproof portable speaker with 360-degree sound and rich bass.',
    price: 79.99,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    ratings: 4.5,
    numReviews: 188
  },
  {
    name: 'Tablet Pro 11-inch',
    category: 'Electronics',
    description: 'Powerful tablet featuring an octa-core processor, vivid display, and stylus support for creatives.',
    price: 649.00,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    ratings: 4.9,
    numReviews: 276
  },
  {
    name: 'Ergonomic Wireless Mouse',
    category: 'Electronics',
    description: 'Vertical ergonomic mouse designed to reduce wrist strain during long hours of work.',
    price: 39.99,
    stock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    ratings: 4.4,
    numReviews: 112
  },
  {
    name: 'Smart Home Hub Speaker',
    category: 'Electronics',
    description: 'Voice-controlled smart speaker that connects and controls all your compatible smart home devices.',
    price: 99.00,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=80',
    ratings: 4.6,
    numReviews: 204
  },
  {
    name: 'Foldable 4K Drone',
    category: 'Electronics',
    description: 'Compact, foldable drone with 3-axis gimbal and 4K camera for cinematic aerial photography.',
    price: 599.00,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80',
    ratings: 4.7,
    numReviews: 63
  }
];

async function seed() { 
  try { 
    await connectDB(); 
    
    // ⚠️ THIS CLEARS OUT YOUR EXISTING JUNK DATA
    console.log('Clearing old database records...');
    await Product.deleteMany({});
    
    // INSERTS THE 20 PERFECT PRODUCTS
    await Product.insertMany(curatedProducts);
    
    console.log(`Success! Database seeded with 20 high-quality products.`); 
    process.exit(); 
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } 
} 

seed();