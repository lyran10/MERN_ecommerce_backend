const Product = require("../models/product");
const Order = require("../models/order");
const Wishlist = require("../models/wishList");
const User = require("../models/user");
const Review = require("../models/review");
const mongoose = require("mongoose");

exports.getAnalytics = async (req, res) => {
  try {
    const { days, year, month } = req.query;
    const numDays = parseInt(days) || 7; // fallback
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);

    // 🔹 Filter orders by date
    const orders = await Order.find({ createdAt: { $gte: startDate } }).populate("items.product");
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // 🔹 Top ordered products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const id = item.product?._id?.toString();
        const title = item.product?.title;
        if (id) {
          productSales[id] = productSales[id] || { productId: id, title: title || "Unknown", count: 0 };
          productSales[id].count += item.qty || 0;
        }
      });
    });
    const topProducts = Object.values(productSales).sort((a,b) => b.count - a.count).slice(0,5);

    // 🔹 Wishlist counts with product title
    const wishlistDataRaw = await Wishlist.aggregate([
      { $unwind: "$products" },
      { $group: { _id: "$products", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" }
    ]);
    const wishlistData = wishlistDataRaw.map(item => ({
      id: item._id.toString(),
      name: item.productDetails.title,
      value: item.count
    }));

    // 🔹 Product ratings
    const products = await Product.find({}, "_id title createdAt");
    const ratings = await Promise.all(products.map(async (p) => {
      const reviews = await Review.find({ product: p._id }, "rating");
      const totalReviews = reviews.length;
      if (totalReviews === 0) return null;

      const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sumRatings = 0;
      reviews.forEach(r => {
        starCounts[r.rating] = (starCounts[r.rating] || 0) + 1;
        sumRatings += r.rating;
      });
      const avgRating = sumRatings / totalReviews;
      const percentage = Math.round((avgRating / 5) * 100);

      return {
        productId: p._id,
        title: p.title,
        totalReviews,
        starCounts,
        percentage
      };
    }));
    const filteredRatings = ratings.filter(r => r !== null);

    const totalProducts = products.length;
    const productsAddedOverTime = products.map(p => ({
      title: p.title,
      date: p.createdAt.toISOString().split("T")[0]
    }));

    // 🔹 User stats
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: "admin" });
    const normalUsers = totalUsers - admins;
    const users = [
      { name: "Admins", value: admins, fill: "#8884d8" },
      { name: "Normal Users", value: normalUsers, fill: "#82ca9d" }
    ];

  // 🔹 Orders & Revenue over time (updated)
let ordersRevenueOverTime = [];
let totalOrdersFiltered = 0;
let totalRevenueFiltered = 0;

if (year && !month) {
  // Yearly -> revenue per month
  for (let m = 0; m < 12; m++) {
    const monthStart = new Date(year, m, 1);
    const monthEnd = new Date(year, m + 1, 0, 23, 59, 59, 999);
    const monthlyOrders = orders.filter(o => o.createdAt >= monthStart && o.createdAt <= monthEnd);
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    ordersRevenueOverTime.push({
      label: monthStart.toLocaleString("default", { month: "short" }),
      orders: monthlyOrders.length,
      revenue: monthlyRevenue
    });
    totalOrdersFiltered += monthlyOrders.length;
    totalRevenueFiltered += monthlyRevenue;
  }
} else if (year && month) {
  // Monthly -> revenue per day
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStart = new Date(year, month - 1, d, 0, 0, 0, 0);
    const dayEnd = new Date(year, month - 1, d, 23, 59, 59, 999);
    const dailyOrders = orders.filter(o => o.createdAt >= dayStart && o.createdAt <= dayEnd);
    const dailyRevenue = dailyOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    ordersRevenueOverTime.push({
      label: d.toString(),
      orders: dailyOrders.length,
      revenue: dailyRevenue
    });
    totalOrdersFiltered += dailyOrders.length;
    totalRevenueFiltered += dailyRevenue;
  }
} else {
  // Default last 'days' view
  for (let i = 0; i < numDays; i++) {
    const day = new Date();
    day.setDate(day.getDate() - (numDays - 1 - i));
    const dayStart = new Date(day.setHours(0,0,0,0));
    const dayEnd = new Date(day.setHours(23,59,59,999));
    const dailyOrders = orders.filter(o => o.createdAt >= dayStart && o.createdAt <= dayEnd);
    const dailyRevenue = dailyOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    ordersRevenueOverTime.push({
      label: day.toISOString().split("T")[0],
      orders: dailyOrders.length,
      revenue: dailyRevenue
    });
    totalOrdersFiltered += dailyOrders.length;
    totalRevenueFiltered += dailyRevenue;
  }
}

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      topProducts,
      wishlistData,
      ratings: filteredRatings,
      productsAddedOverTime,
      users,
      ordersRevenueOverTime
    });

  } catch (err) {
    console.error("Analytics error", err);
    res.status(500).json({ message: "Analytics error ❌" });
  }
};
