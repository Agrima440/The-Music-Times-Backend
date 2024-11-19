import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

//////////////  Create Category Controller //////

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ mesaage: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Category",
      error,
    });
  }
};

//////////// update Category //////

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated Sussessfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Update Category",
      error,
    });
  }
};

////////////// Get All Category Controller ////////

export const getAllCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: " All Categories",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succes: false,
      message: "Error in get all category",
      error,
    });
  }
};

////////////// Get Single Category /////////

export const getSingleCategoryController=async(req,res)=>{
  try{
const {slug}=req.params;
const category=await categoryModel.find({slug});
if(!category){
  return res.status(404).send({
    success:false,
    message:"No such category",
  })
  }

res.status(200).send({
  success:true,
  message:"Get Single Category Successfully",
  category,
})
}
  catch (error) {
    console.log(error);
    res.status(500).send({
      succes: false,
      message: "Error in get Single Category",
      error,
    });
  }
}

/// //////// Delete Category Controller //////////

export const deleteCategoryController=async(req,res)=>{
  try{
const {id}=req.params;
const category=await categoryModel.findByIdAndDelete(id)
if(!category) return res.status(404).send({message:"Category not found", succcess:false
})

res.status(200).send({
  success:true,
  message:"Category Deleted Successfully"
})
  }
  catch (error) {
    console.log(error);
    res.status(500).send({
      succes: false,
      message: "Error in Delete Category",
      error,
    });
  }
}

