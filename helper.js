import { client } from "./serverfile.js";
import bcrypt from "bcrypt";

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
    .deleteOne({ description: id });
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
    .updateOne({ description: id }, { $set: updateProduct });
}

export async function genPassword(password) {
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function createUser(username, hashedPassword) {
  return await client
    .db("password")
    .collection("users")
    .insertOne({ username: username, password: hashedPassword });
}

export async function getUserByName(username) {
  return await client
    .db("equipments")
    .collection("users")
    .findOne({ username: username });
}
