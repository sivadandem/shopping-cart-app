// seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("./models/Item");
const connectDB = require("./config/database");

const sampleItems = [
  // Electronics
  {
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM and 512GB SSD",
    price: 54999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop"
  },
  {
    name: "Smartphone",
    description: "Latest smartphone with 108MP camera and 5G support",
    price: 29999,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop"
  },
  {
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    price: 12999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical gaming keyboard with blue switches",
    price: 4999,
    image: "https://cdn.thewirecutter.com/wp-content/media/2025/12/BEST-MECHANICAL-KEYBOARDS-2048px-EVOWORKS-80-926.jpg?auto=webp&quality=75&width=1024"
  },
  {
    name: "Gaming Mouse",
    description: "Ergonomic wireless gaming mouse with 16000 DPI",
    price: 2999,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop"
  },
  {
    name: "4K Monitor",
    description: "27-inch 4K UHD monitor with HDR support",
    price: 24999,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop"
  },
  {
    name: "Webcam HD",
    description: "1080p HD webcam with built-in microphone",
    price: 3499,
    image: "https://m.media-amazon.com/images/I/71eGb1FcyiL.jpg"
  },
  {
    name: "USB Hub",
    description: "7-port USB 3.0 hub with fast charging",
    price: 1299,
    image: "https://cdn.sandberg.world/products/images/lg/333-67_lg.jpg"
  },
  {
    name: "Tablet",
    description: "10-inch tablet with stylus support and 128GB storage",
    price: 34999,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop"
  },
  {
    name: "Smartwatch",
    description: "Fitness smartwatch with heart rate monitor and GPS",
    price: 8999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
  },
  
  // Audio
  {
    name: "Bluetooth Speaker",
    description: "Portable waterproof Bluetooth speaker with 20hr battery",
    price: 4499,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop"
  },
  {
    name: "Earbuds Pro",
    description: "True wireless earbuds with active noise cancellation",
    price: 7999,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop"
  },
  {
    name: "Soundbar",
    description: "2.1 channel soundbar with wireless subwoofer",
    price: 14999,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&h=300&fit=crop"
  },
  
  // Cameras
  {
    name: "DSLR Camera",
    description: "24MP DSLR camera with 18-55mm lens kit",
    price: 45999,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop"
  },
  {
    name: "Action Camera",
    description: "4K action camera with waterproof case",
    price: 19999,
    image: "https://media.wired.com/photos/67d70b65e784d4b8067ba631/4:3/w_640%2Cc_limit/Insta360-Ace-Pro-2-Action-Camera-front-flip-screen-Reviewer-Photo-(no-border)-SOURCE-Scott-Gilbertson.jpg"
  },
  {
    name: "Instant Camera",
    description: "Retro instant camera with built-in flash",
    price: 5999,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop"
  },
  
  // Gaming
  {
    name: "Gaming Console",
    description: "Next-gen gaming console with 1TB storage",
    price: 49999,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop"
  },
  {
    name: "Gaming Controller",
    description: "Wireless gaming controller with vibration feedback",
    price: 4499,
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=300&h=300&fit=crop"
  },
  {
    name: "VR Headset",
    description: "Virtual reality headset with motion controllers",
    price: 29999,
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=300&h=300&fit=crop"
  },
  {
    name: "Gaming Chair",
    description: "Ergonomic gaming chair with lumbar support",
    price: 15999,
    image: "https://zebronics.com/cdn/shop/files/zeb-GC1600-pic1.jpg?v=1696935278&width=2048"
  },
  
  // Accessories
  {
    name: "Laptop Bag",
    description: "Professional laptop bag with multiple compartments",
    price: 1999,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop"
  },
  {
    name: "Power Bank",
    description: "20000mAh power bank with fast charging support",
    price: 1799,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop"
  },
  {
    name: "Wireless Charger",
    description: "15W fast wireless charging pad",
    price: 1499,
    image: "https://www.portronics.com/cdn/shop/files/FLUX_wireless_phone_charger_stand.jpg?v=1734939820"
  },
  {
    name: "Phone Stand",
    description: "Adjustable aluminum phone and tablet stand",
    price: 799,
    image: "https://kanget.in/cdn/shop/files/KangetMetalMobileStandMainImage_01.jpg?v=1721973726&width=1445"
  },
  {
    name: "Cable Organizer",
    description: "Desktop cable management organizer set",
    price: 499,
    image: "https://assets.umart.com.au/newsite/images/202209/source_img/Cables-Cable-Organizer-Clips-Cord-Holder-5-Packs-Self-Adhesive-Cable-Management-Cable-Holder-for-USB-Cable-Power-Cord-Wire-Car-and-Desk-Home-and-Office-15.webp"
  },
  
  // Home Tech
  {
    name: "Smart LED Bulb",
    description: "WiFi smart LED bulb with RGB colors",
    price: 899,
    image: "https://cdn.homemate.co.in/wp-content/uploads/2019/10/71jBByMlOOL._SL1500_.jpg"
  },
  {
    name: "Smart Plug",
    description: "WiFi smart plug with voice control support",
    price: 699,
    image: "https://5.imimg.com/data5/TH/AX/PI/SELLER-5189903/led-smart-plug-wifi-socket-sdl843983611-1-4223c.jpg"
  },
  {
    name: "Robot Vacuum",
    description: "Smart robot vacuum cleaner with app control",
    price: 18999,
    image: "https://media.tatacroma.com/Croma%20Assets/Small%20Appliances/Vacuum%20Cleaners/Images/312756_0_EEZyeBa2Q.png?updatedAt=1760547044407"
  },
  {
    name: "Air Purifier",
    description: "HEPA air purifier for rooms up to 500 sq ft",
    price: 9999,
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=300&h=300&fit=crop"
  },
  {
    name: "Smart Doorbell",
    description: "Video doorbell with two-way audio and night vision",
    price: 7499,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=300&h=300&fit=crop"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing items
    await Item.deleteMany({});
    console.log("🗑️  Cleared existing items");

    // Insert sample items
    const items = await Item.insertMany(sampleItems);
    console.log(`\n✅ Inserted ${items.length} sample items\n`);

    // Display inserted items
    console.log("📦 Items added:");
    console.log("─".repeat(50));
    
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}: ₹${item.price.toLocaleString('en-IN')}`);
    });
    
    console.log("─".repeat(50));
    console.log(`\n🎉 Database seeded successfully with ${items.length} items!\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();