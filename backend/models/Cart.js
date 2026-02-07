const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, "Quantity must be at least 1"],
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((total, cartItem) => {
    if (cartItem.item && cartItem.item.price) {
      return total + cartItem.item.price * cartItem.quantity;
    }
    return total;
  }, 0);
});

cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
