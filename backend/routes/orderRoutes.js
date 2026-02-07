const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.item");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Add items before placing an order.",
      });
    }

    let totalAmount = 0;
    const orderItems = cart.items.map((cartItem) => {
      const itemTotal = cartItem.item.price * cartItem.quantity;
      totalAmount += itemTotal;

      return {
        item: cartItem.item._id,
        quantity: cartItem.quantity,
        priceAtPurchase: cartItem.item.price,
      };
    });

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      status: "confirmed",
    });

    await order.save();

    cart.items = [];
    await cart.save();

    await order.populate("items.item");

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "username").populate("items.item").sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.item").sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.item");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
});

module.exports = router;
