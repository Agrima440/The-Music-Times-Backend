import express from "express";
import { checkRole, requireSignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategoryController, getAllCategoryController, getSingleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

//////////// Create Category ////////

router.post(
  "/create-category",
  requireSignIn,
  checkRole(["admin"]),
  createCategoryController
);

// //// Update Category /////////

router.put(
  "/update-category/:id",
  requireSignIn,
  checkRole(["admin"]),
  updateCategoryController
);

////////////// Get All Categories //////

router.get(
  "/all",
getAllCategoryController);

/////////// Get Single Category ////////
router.get("/single-category/:slug",getSingleCategoryController)


/////// Delete Category /////////
router.delete(
  "/delete-category/:id",
  requireSignIn,
  checkRole(["admin"]),
deleteCategoryController
);

export default router;
