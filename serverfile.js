import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import Razorpay from "razorpay";
import shortid from "shortid";
import { MongoClient } from "mongodb";
import { productsRouter } from "./routes/products.js";
import { usersRouter } from "./routes/users.js";
import { totalAmount } from "./helper.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected");
  return client;
}
const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

export const client = await createConnection();

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  response.send("Hello!");
});

app.use("/equipments", productsRouter);

app.use("/users", usersRouter);

app.get("/razorpay", (req, res) => {
  res.send("Razorpay payment");
});

app.post("/razorpay", async (request, response) => {
  const amount = request.body;
  console.log(amount);
  const total = await totalAmount(amount);
  response.send(total);

  const payment_capture = 1;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };
  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => console.log("SERVER STARTED ON PORT", PORT));
