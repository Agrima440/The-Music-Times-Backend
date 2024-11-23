import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Add to Cart
export const addToCartController = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }

    if (product.countInStock < quantity) {
      return res.status(400).send({
        success: false,
        message: "Insufficient stock"
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // Calculate total amount
    cart.totalAmount = await calculateCartTotal(cart.items);
    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price image');

    res.status(200).send({
      success: true,
      message: "Product added to cart",
      cart
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in adding to cart",
      error
    });
  }
};

// Get Cart
export const getCartController = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image');

    res.status(200).send({
      success: true,
      cart: cart || { items: [], totalAmount: 0 }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting cart",
      error
    });
  }
};

// Update Cart Item
export const updateCartItemController = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Product not found in cart"
      });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalAmount = await calculateCartTotal(cart.items);
    await cart.save();
    await cart.populate('items.product', 'name price image');

    res.status(200).send({
      success: true,
      message: "Cart updated",
      cart
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating cart",
      error
    });
  }
};

// Remove from Cart
export const removeFromCartController = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );

    cart.totalAmount = await calculateCartTotal(cart.items);
    await cart.save();

    res.status(200).send({
      success: true,
      message: "Item removed from cart",
      cart
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in removing from cart",
      error
    });
  }
};

// Clear Cart (Delete All Products)
export const clearCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Cart not found"
      });
    }

    // Clear all items
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).send({
      success: true,
      message: "Cart cleared successfully",
      cart
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in clearing cart",
      error
    });
  }
};

// Helper function to calculate cart total
const calculateCartTotal = async (items) => {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    total += product.price * item.quantity;
  }
  return total;
};