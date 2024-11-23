import express from "express";
import { 
  createOrderController, 
  getAllOrdersController, 
  getUserOrdersController, 
  updateOrderStatusController,
  buyNowController,
  processPaymentController,
  verifyPaymentController
} from "../controllers/orderController.js";
import { checkRole, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Order Routes
router.post("/create", requireSignIn, createOrderController);
router.get("/all", requireSignIn, checkRole(["admin"]), getAllOrdersController);
router.get("/user-orders", requireSignIn, getUserOrdersController);
router.put("/status/:id", requireSignIn, checkRole(["admin"]), updateOrderStatusController);

// Buy Now and Payment routes
router.post("/buy-now", requireSignIn, buyNowController);
router.post("/process-payment", requireSignIn, processPaymentController);
router.get("/verify-payment/:orderId", requireSignIn, verifyPaymentController);

export default router;