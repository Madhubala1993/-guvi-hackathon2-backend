import dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import { productsRouter } from "./routes/products.js";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
// const PORT = 9000;
const PORT = process.env.PORT;

// const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected");
  return client;
}

export const client = await createConnection();

app.use(express.json());

app.get("/", (request, response) => {
  response.send("Hello!");
});

app.use("/equipments", productsRouter);

app.listen(PORT, () => console.log("SERVER STARTED ON PORT", PORT));

async function genPassword(password) {
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
}

console.log(genPassword("Password@123"));
