import { client } from "./server.js";

export async function getProductsById(id) {
  return await client
    .db("equipments")
    .collection("equipments")
    .findOne({ id: id });
}
export async function deleteProducts(id) {
  return await client
    .db("equipments")
    .collection("equipments")
    .deleteOne({ id: id });
}
export async function getAllProducts(request) {
  return await client
    .db("equipments")
    .collection("equipments")
    .find(request.query)
    .toArray();
}
export async function addProducts(newProducts) {
  return await client
    .db("equipments")
    .collection("equipments")
    .insertMany(newProducts);
}

export async function updateProductsById(id, updateProduct) {
  return await client
    .db("equipments")
    .collection("equipments")
    .updateOne({ id: id }, { $set: updateProduct });
}
