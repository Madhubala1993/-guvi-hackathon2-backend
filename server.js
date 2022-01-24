import dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
// const PORT = 9000;
const PORT = process.env.PORT;

const equipments = [
  {
    id: "100",
    description:
      "Sony FDR-AX43 UHD 4K Camcorder Kit with Microphone & Shooting Grip ",
    duration: "7hours",
    rate: "₹3,000",
    pic: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSWQNEoxl-yhp1mptY8A1J1QT-JR4wlrDYMpL_Gn4XZfqf8J5g0gTfJAQUTFusCjCiPdQLsBCbwfPxmDe7xnnCWF2LNQ4Kw&usqp=CAE",
  },
  {
    id: "101",
    description:
      "Sony PXW-FS7M2 4K XDCAM Super 35 Camcorder Kit with 18-110mm Zoom",
    duration: "7hours",
    rate: "₹3,500",
    pic: "https://www.bhphotovideo.com/cdn-cgi/image/format=auto,fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_pxw_fs7m2k_pxw_fs7m2_4k_xdcam_super_1478713541_1296066.jpg",
  },
  {
    id: "102",
    description: "Nikon Z 6II Mirrorless Camera With 24-70mm Lens Kit",
    duration: "7hours",
    rate: "₹2,500",
    pic: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTTNZ2yijIJWGaGYENb2mO_9ot6hwkbpivg14KtQcw1D4RPp1-Agjnx-isXeeDQMssybFnN_Lc5fKa1EJU3ZLm5YRv5mWCJttnds7Gr1PP8eOIlucdTPdG4qA&usqp=CAE",
  },
  {
    id: "103",
    description:
      "Nikon D5600 DSLR Camera with 18-55mm VR and 70-300mm Lenses + 128GB Card, Tripod, Flash, ALS Variety Lens Cloth",
    duration: "7hours",
    rate: "₹5,000",
    pic: "https://poshace.com/pub/media/catalog/product/cache/95ca844a72e649bb1089a2da1cdcef7d/n/_/n_37_.jpg",
  },
  {
    id: "104",
    description:
      "E-Image EI-7010A 5.5ft Tripod Stand Kit with Hydraulic Fluid Head for DSLR & Video Camera Canon Nikon Payload 3KG",
    duration: "7hours",
    rate: "₹500",
    pic: "https://royimaging.com/pub/media/catalog/product/cache/e9018af2e121f8d66a399c967ddfe17a/1/_/1_99.jpg",
  },
  {
    id: "105",
    description: "Rode VideoMic Me and Facebook Live Desktop Starter Kit",
    duration: "7hours",
    rate: "₹800",
    pic: "https://www.bhphotovideo.com/cdn-cgi/image/format=auto,fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/rode_videomic_me_and_facebook_1551261502_1275477.jpg",
  },
  {
    id: "106",
    description: "Canon Speedlite 470EX-AI",
    duration: "7hours",
    rate: "₹300",
    pic: "https://kmlglobal.in/wp-content/uploads/2021/10/canon_1957c002_speedlite_470ex_ai_1519599039_1393465.jpg?v=1636201281",
  },
  {
    id: "107",
    description: "Sony Vlogger Kit",
    duration: "7hours",
    rate: "₹800",
    pic: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTYTtz6fbN9zhA4IsALZe-Ntq0LmY97DuW8454K7FZ9r_nhdIydh2hPeb5YFAzIICjpMpia7m992UIADIBU5A18UAj5aGI05BjDw4q_jbNs0rnS4Cp8DC26SSOP&usqp=CAE",
  },
  {
    id: "108",
    description: "Sony FE 50mm f/1.8 Lens",
    duration: "7hours",
    rate: "₹800",
    pic: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRj7fpvueqLqwLH_3Czbrh4m5tdVEmeHZds3eu-Zc_zYU5NIjbUOcTxKU-mh6WiZPn1AQ3MCJdEEo7QpdG8QBRQSZJ82DqwJUtPS37NEfh09Dm0KN4ni0PC&usqp=CAE",
  },
];

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
