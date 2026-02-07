require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("./models/Item");
const connectDB = require("./config/database");

const sampleItems = [
  {
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 999.99,
    image: "https://via.placeholder.com/150?text=Laptop",
  },
  {
    name: "Smartphone",
    description: "Latest smartphone with amazing camera",
    price: 699.99,
    image: "https://via.placeholder.com/150?text=Phone",
  },
  {
    name: "Headphones",
    description: "Wireless noise-cancelling headphones",
    price: 299.99,
    image: "https://via.placeholder.com/150?text=Headphones",
  },
  {
    name: "Keyboard",
    description: "Mechanical gaming keyboard with RGB",
    price: 149.99,
    image: "https://via.placeholder.com/150?text=Keyboard",
  },
  {
    name: "Mouse",
    description: "Ergonomic wireless mouse",
    price: 79.99,
    image: "https://via.placeholder.com/150?text=Mouse",
  },
  {
    name: "Monitor",
    description: "27-inch 4K display",
    price: 449.99,
    image: "https://via.placeholder.com/150?text=Monitor",
  },
  {
    name: "Webcam",
    description: "1080p HD webcam with microphone",
    price: 89.99,
    image: "https://via.placeholder.com/150?text=Webcam",
  },
  {
    name: "USB Hub",
    description: "7-port USB 3.0 hub",
    price: 39.99,
    image: "https://via.placeholder.com/150?text=USB+Hub",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await Item.deleteMany({});
    console.log("🗑️  Cleared existing items");

    const items = await Item.insertMany(sampleItems);
    console.log(`✅ Inserted ${items.length} sample items`);

    items.forEach((item) => {
      console.log(`   - ${item.name}: $${item.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
