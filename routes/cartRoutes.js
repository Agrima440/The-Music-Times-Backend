import express from "express";
import { 
  addToCartController, 
  getCartController, 
  updateCartItemController, 
  removeFromCartController,
  clearCartController 
} from "../controllers/cartController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Cart Routes
router.post("/add", requireSignIn, addToCartController);
router.get("/get-cart", requireSignIn, getCartController);
router.put("/update", requireSignIn, updateCartItemController);
router.delete("/remove/:productId", requireSignIn, removeFromCartController);
router.delete("/clear", requireSignIn, clearCartController);

export default router;