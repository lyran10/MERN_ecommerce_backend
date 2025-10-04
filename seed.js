// seed.js (run node seed.js)
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/product');
const connectDB = require('./config/db');

async function seed(){
  await connectDB();
  await Product.deleteMany({});
    const products = [
      {
        title: "Wireless Bluetooth Headphones",
        slug: "wireless-bluetooth-headphones-" + Date.now(),
        description: "High-quality sound with noise cancellation",
        price: 1999,
        images: ["https://via.placeholder.com/150", "https://via.placeholder.com/150"],
        category: "Electronics",
        brand: "SoundMax",
        stock: 50,
        rating: 4.5,
      },
      {
        title: "Smart Fitness Watch",
        slug: "smart-fitness-watch-" + Date.now(),
        description: "Track your workouts and heart rate",
        price: 2999,
        images: ["https://via.placeholder.com/150"],
        category: "Wearables",
        brand: "FitPro",
        stock: 100,
        rating: 4.2,
      },
      {
        title: "Gaming Mechanical Keyboard",
        slug: "gaming-mechanical-keyboard-" + Date.now(),
        description: "RGB backlit mechanical keyboard for gaming",
        price: 3499,
        images: ["https://via.placeholder.com/150"],
        category: "Gaming",
        brand: "KeyMaster",
        stock: 30,
        rating: 4.7,
      },
      {
        title: "4K Ultra HD LED TV",
        slug: "4k-ultra-hd-led-tv-" + Date.now(),
        description: "Stunning visuals with HDR10 support",
        price: 44999,
        images: ["https://via.placeholder.com/150"],
        category: "Electronics",
        brand: "ViewPlus",
        stock: 20,
        rating: 4.3,
      },
      {
        title: "Portable Bluetooth Speaker",
        slug: "portable-bluetooth-speaker-" + Date.now(),
        description: "Compact speaker with deep bass",
        price: 1499,
        images: ["https://via.placeholder.com/150"],
        category: "Audio",
        brand: "BeatBox",
        stock: 75,
        rating: 4.4,
      },
      {
        title: "Wireless Mouse",
        slug: "wireless-mouse-" + Date.now(),
        description: "Ergonomic design with high precision",
        price: 799,
        images: ["https://via.placeholder.com/150"],
        category: "Accessories",
        brand: "ClickPro",
        stock: 120,
        rating: 4.1,
      },
      {
        title: "Laptop Backpack",
        slug: "laptop-backpack-" + Date.now(),
        description: "Water-resistant backpack with multiple compartments",
        price: 1999,
        images: ["https://via.placeholder.com/150"],
        category: "Bags",
        brand: "CarryAll",
        stock: 60,
        rating: 4.2,
      },
      {
        title: "Noise Cancelling Earbuds",
        slug: "noise-cancelling-earbuds-" + Date.now(),
        description: "Compact earbuds with long battery life",
        price: 2499,
        images: ["https://via.placeholder.com/150"],
        category: "Audio",
        brand: "SoundMax",
        stock: 80,
        rating: 4.5,
      },
      {
        title: "Smart LED Bulb",
        slug: "smart-led-bulb-" + Date.now(),
        description: "Control brightness and colors via app",
        price: 599,
        images: ["https://via.placeholder.com/150"],
        category: "Home",
        brand: "BrightHome",
        stock: 200,
        rating: 4.0,
      },
      {
        title: "Digital Camera",
        slug: "digital-camera-" + Date.now(),
        description: "High-resolution camera with optical zoom",
        price: 15999,
        images: ["https://via.placeholder.com/150"],
        category: "Photography",
        brand: "PhotoSnap",
        stock: 25,
        rating: 4.6,
      },
      {
        title: "Electric Kettle",
        slug: "electric-kettle-" + Date.now(),
        description: "Fast-boil kettle with auto shut-off",
        price: 999,
        images: ["https://via.placeholder.com/150"],
        category: "Home Appliances",
        brand: "HeatQuick",
        stock: 90,
        rating: 4.3,
      },
      {
        title: "Air Purifier",
        slug: "air-purifier-" + Date.now(),
        description: "Removes 99% of dust and allergens",
        price: 4999,
        images: ["https://via.placeholder.com/150"],
        category: "Home Appliances",
        brand: "PureAir",
        stock: 40,
        rating: 4.4,
      },
    ];

  await Product.insertMany(products);
  console.log('seed done');
  process.exit();
}
seed();
