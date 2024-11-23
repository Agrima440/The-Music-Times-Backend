import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import cloudinary from "cloudinary";
import multer from "multer";
import slugify from "slugify";

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME || "dlw5ad03j",
  api_key: process.env.CLOUD_API_KEY || "894392721939297",
  api_secret: process.env.CLOUD_API_SECRET || "ghAtltweXUmNH5vzKl1HDE5fsHU",
});

// Multer Configuration for Image Uploads
const storage = multer.diskStorage({}); 
export const upload = multer({ storage });

// Create Product
export const createProductController = async (req, res) => {
  try {
    const { name, brand,slug, category, description, price, countInStock } = req.body;

    // Validate required fields
    if (!name || !brand || !category || !description || !price || !countInStock) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    // Validate Category  
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).send({ success: false, message: "Category not found" });
    }
    console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
    console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY);
    console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET);
    // Handle Image Upload to Cloudinary
    if (!req.file) {
      return res.status(400).send({ success: false, message: "Image is required" });
    }
    
    const result = await cloudinary.v2.uploader.upload(req.file.path);

    // Create Product
    const product = await new Product({
      user: req.user._id, // assuming `req.user` contains authenticated user's data
      name,
      image: result.secure_url,
      brand,
      category,
      description,
      price,
      countInStock,
      slug:slugify(name)
    }).save();

    res.status(201).send({ success: true, message: "Product Created", product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in Creating Product", error });
  }
};

// Get All Products
export const getAllProductsController = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category", "name") // populate category with its name
      .populate("user", "name email"); // populate user with name and email
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in Fetching Products", error });
  }
};

// Get Single Product
export const getSingleProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("user", "name email");
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }
    res.status(200).send({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in Fetching Product", error });
  }
};

// Update Product
export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, category, description, price, countInStock } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    // Update Image if Provided
    let updatedImage = existingProduct.image;
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      updatedImage = result.secure_url;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, brand, category, description, price, countInStock, image: updatedImage },
      { new: true }
    );

    res.status(200).send({ success: true, message: "Product Updated", product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in Updating Product", error });
  }
};

// Delete Product
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }

    res.status(200).send({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in Deleting Product", error });
  }
};
