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

  // --- HOME ---
  {
    name: 'Ceramic Coffee Mug',
    category: 'Home',
    description: 'Handcrafted ceramic mug perfect for your morning coffee or evening tea.',
    price: 18.50,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a12508d9af24?auto=format&fit=crop&w=800&q=80',
    ratings: 4.9,
    numReviews: 156
  },
  {
    name: 'Indoor Potted Succulent',
    category: 'Home',
    description: 'Low-maintenance indoor succulent plant with a modern decorative pot.',
    price: 24.99,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-d0928e62f441?auto=format&fit=crop&w=800&q=80',
    ratings: 4.6,
    numReviews: 29
  },
  {
    name: 'Modern Desk Lamp',
    category: 'Home',
    description: 'Sleek, adjustable LED desk lamp to brighten your home office workspace.',
    price: 55.00,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1507473884814-14407b8b2848?auto=format&fit=crop&w=800&q=80',
    ratings: 4.5,
    numReviews: 63
  },
  {
    name: 'Minimalist Wall Clock',
    category: 'Home',
    description: 'Silent sweep wall clock with a clean, Scandinavian-inspired design.',
    price: 34.00,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fd110c?auto=format&fit=crop&w=800&q=80',
    ratings: 4.4,
    numReviews: 18
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
    name: 'Luxury Perfume Mist',
    category: 'Beauty',
    description: 'Elegant floral perfume mist featuring notes of jasmine and sandalwood.',
    price: 89.99,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1594035987158-b61763ef8bce?auto=format&fit=crop&w=800&q=80',
    ratings: 4.7,
    numReviews: 104
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
  {
    name: 'Hydrating Body Lotion',
    category: 'Beauty',
    description: 'Rich moisturizing cream that leaves skin feeling soft and deeply nourished.',
    price: 28.00,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1611078566160-c3be2e30fbb8?auto=format&fit=crop&w=800&q=80',
    ratings: 4.8,
    numReviews: 145
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
    name: 'Professional Running Shoes',
    category: 'Sports',
    description: 'Lightweight running shoes with responsive cushioning for your daily miles.',
    price: 135.00,
    stock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1f73d98fb?auto=format&fit=crop&w=800&q=80',
    ratings: 4.6,
    numReviews: 95
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