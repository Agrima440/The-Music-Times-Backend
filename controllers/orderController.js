import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Create Order
export const createOrderController = async (req, res) => {
  try {
    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      taxPrice, 
      shippingPrice, 
      totalPrice 
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).send({ 
        success: false, 
        message: "No order items" 
      });
    }

    const order = await new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    }).save();

    res.status(201).send({
      success: true,
      message: "Order Created Successfully",
      order
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Creating Order",
      error
    });
  }
};

// Get All Orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.product", "name price");
    res.status(200).send({
      success: true,
      orders
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Fetching Orders",
      error
    });
  }
};

// Get User Orders
export const getUserOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name price");
    res.status(200).send({
      success: true,
      orders
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Fetching User Orders",
      error
    });
  }
};

// Update Order Status
export const updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { 
        isPaid: status === 'paid',
        paidAt: status === 'paid' ? Date.now() : null,
        isDelived: status === 'delivered',
        deliverAt: status === 'delivered' ? Date.now() : null
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Order Status Updated",
      order
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating Order Status",
      error
    });
  }
};

// Buy Now Controller
export const buyNowController = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress, paymentMethod } = req.body;

    // Validate product and stock
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

    // Calculate prices
    const itemPrice = product.price * quantity;
    const taxPrice = itemPrice * 0.15; // 15% tax
    const shippingPrice = itemPrice > 1000 ? 0 : 100; // Free shipping over 1000
    const totalPrice = itemPrice + taxPrice + shippingPrice;

    // Create order
    const order = await new Order({
      user: req.user._id,
      orderItems: [{
        name: product.name,
        qty: quantity,
        image: product.image,
        price: product.price,
        product: product._id
      }],
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    }).save();

    // Update product stock
    product.countInStock -= quantity;
    await product.save();

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in placing order",
      error
    });
  }
};

// Process Payment Controller
export const processPaymentController = async (req, res) => {
  try {
    const { orderId, paymentDetails } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found"
      });
    }

    // Here you would integrate with your payment gateway
    // This is a simplified example
    const paymentResult = {
      id: Date.now().toString(),
      status: "completed",
      email_address: req.user.email,
      update_time: new Date()
    };

    order.paymentResult = paymentResult;
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).send({
      success: true,
      message: "Payment processed successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in processing payment",
      error
    });
  }
};

// Verify Payment Status
export const verifyPaymentController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).send({
      success: true,
      isPaid: order.isPaid,
      paymentResult: order.paymentResult
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in verifying payment",
      error
    });
  }
};
