import express from "express";
import multer from "multer";
import { createProductController, deleteProductController, getAllProductsController, getSingleProductController, updateProductController, upload } from "../controllers/ProductController.js";
import { checkRole, requireSignIn } from "../middlewares/authMiddleware.js";


const router = express.Router();

// CRUD Routes for Products
router.post("/create", requireSignIn, checkRole(["admin"]), upload.single("image"), createProductController);
router.get("/all", getAllProductsController);
router.get("/:id", getSingleProductController);
router.put("/:id", requireSignIn, checkRole(["admin"]), upload.single("image"), updateProductController);
router.delete("/:id", requireSignIn, checkRole(["admin"]), deleteProductController);

export default router;
 