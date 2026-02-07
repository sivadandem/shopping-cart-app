// routes/itemRoutes.js

const express = require("express");
const Item = require("../models/Item");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const item = new Item({ name, description, price, image });
    await item.save();

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating item",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Item.find({});

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching items",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching item",
      error: error.message,
    });
  }
});

module.exports = router;
