import express from "express";
import {
  getProductsById,
  deleteProducts,
  getAllProducts,
  addProducts,
  updateProductsById,
} from "../helper.js";
import { auth } from "../middleware/auth.js";
// import {
//   getProductsById,
//   deleteProducts,
//   getAllProducts,
//   addProducts,
// } from "./helper.js";

const router = express.Router();

router.get("/", auth, async (request, response) => {
  console.log(request.query);
  const product = await getAllProducts(request);
  response.send(product);
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  console.log(id);
  const product = await getProductsById(id);

  product
    ? response.send(product)
    : response.status(404).send({ message: "No products found" });
  console.log(product);
});

router.delete("/:id", async (request, response) => {
  const { id } = request.params;
  console.log(id);
  const product = await deleteProducts(id);
  response.send(product);
});

router.put("/:id", async (request, response) => {
  const { id } = request.params;
  const updateProduct = request.body;
  console.log(updateProduct);
  const product = await updateProductsById(id, updateProduct);
  response.send(product);
});

router.post("/", async (request, response) => {
  const newProducts = request.body;
  console.log(newProducts);
  const product = await addProducts(newProducts);
  response.send(product);
});

export const productsRouter = router;
