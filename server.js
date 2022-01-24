import dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";

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

const client = await createConnection();

app.use(express.json());

app.get("/", (request, response) => {
  response.send("Hello!");
});

app.get("/equipments/:id", async (request, response) => {
  const { id } = request.params;
  console.log(id);
  const product = await client
    .db("equipments")
    .collection("equipments")
    .findOne({ id: id });

  product
    ? response.send(product)
    : response.status(404).send({ message: "No products found" });
  console.log(product);
});

app.delete("/equipments/:id", async (request, response) => {
  const { id } = request.params;
  console.log(id);
  const product = await client
    .db("equipments")
    .collection("equipments")
    .deleteOne({ id: id });
  response.send(product);
});

app.get("/equipments", async (request, response) => {
  console.log(request.query);
  const product = await client
    .db("equipments")
    .collection("equipments")
    .find(request.query)
    .toArray();
  response.send(product);
});

app.post("/equipments", async (request, response) => {
  const newProducts = request.body;
  console.log(newProducts);
  const product = await client
    .db("equipments")
    .collection("equipments")
    .insertMany(newProducts);
  response.send(product);
});

// app.put("/equipments/:id", async (request, response) => {
//   const { id } = request.params;
//   console.log(id);
//   // const product = await client
//   //   .db("equipments")
//   //   .collection("equipments")
//   //   .updateOne({ id: id });
//   // //   response.send(product);
//   // product
//   //   ? response.send(product)
//   //   : response.status(404).send({ message: "No products found" });
// });

app.listen(PORT, () => console.log("SERVER STARTED ON PORT", PORT));
