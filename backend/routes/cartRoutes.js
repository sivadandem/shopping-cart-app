const express = require("express");
const Cart = require("../models/Cart");
const Item = require("../models/Item");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex((cartItem) => cartItem.item.toString() === itemId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ item: itemId, quantity });
    }

    await cart.save();

    await cart.populate("items.item");

    res.json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find({}).populate("user", "username").populate("items.item");

    res.json({
      success: true,
      count: carts.length,
      data: carts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching carts",
      error: error.message,
    });
  }
});

router.get("/my-cart", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.item");

    if (!cart) {
      return res.json({
        success: true,
        message: "Cart is empty",
        data: { items: [], totalPrice: 0 },
      });
    }

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
});

router.delete("/my-cart/items/:itemId", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((cartItem) => cartItem.item.toString() !== req.params.itemId);

    await cart.save();
    await cart.populate("items.item");

    res.json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
      error: error.message,
    });
  }
});

module.exports = router;
