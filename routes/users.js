// import express from "express";
// import { createUser, genPassword, getUserByName } from "../helper.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// // import crypto from "crypto";
// // import req from "express/lib/request";

// const router = express.Router();

// router.post("/signup", async (request, response) => {
//   const { username, password } = request.body;
//   console.log(username, password);
//   const isUserExist = await getUserByName(username);
//   console.log(isUserExist);
//   if (isUserExist) {
//     response.status(400).send({ message: "User already exists" });
//     return;
//   }
//   if (
//     !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#%&]).{8,}$/g.test(password)
//   ) {
//     response.status(400).send({ message: "Password pattern does not match" });
//     return;
//   }

//   const hashedPassword = await genPassword(password);
//   const result = createUser(username, hashedPassword);
//   response.send(result);
// });

// router.post("/login", async (request, response) => {
//   const { username, password } = request.body;
//   console.log(username, password);
//   const userFromDB = await getUserByName(username);
//   console.log(userFromDB);

//   if (!userFromDB) {
//     response.status(400).send({ message: "Invalid credentials" });
//     return;
//   }

//   const storedDbPassword = userFromDB.password;
//   const isPasswordMatch = await bcrypt.compare(password, storedDbPassword);
//   if (!isPasswordMatch) {
//     response.status(400).send({ message: "Invalid credentials" });
//     return;
//   }

//   const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
//   response.send({ message: "Successfull Login", token });
// });

// // router.post("reset-password", async (request, response) => {
// //   crypto.randomBytes(32, (err, buffer) => {
// //     if (err) {
// //       console.log(err);
// //     }
// //     const token = buffer.toString("hex");
// //     usersRouter.findOne({ email: req.body.email }).then((user) => {
// //       if (!user) {
// //         return res.status(422).json({ error: "User dont exist" });
// //       }
// //     });
// //   });
// // });
// export const usersRouter = router;

import express from "express";
import {
  createUser,
  genConfirmPwd,
  genPassword,
  getAllUsers,
  getUserByName,
} from "../helper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { auth } from "../middleware/auth.js";
import { client } from "../serverfile.js";

dotenv.config();

const otp_number = Math.floor(Math.random() * 1000000);
const router = express.Router();
router.post("/forgotPassword", async (req, response) => {
  const username = req.body.username;

  console.log(username);

  const existingUser = await client
    .db("equipments")
    .collection("users")
    .findOne({ username: username });

  console.log(existingUser);

  if (!existingUser) {
    response.status(400).send({ message: "User doesnot exists" });
    return;
  }
  await sendMail(existingUser.mailid, otp_number, req, response);
});

router.post("/forgotPassword/:username", async (req, response) => {
  const { username } = req.params;
  const otp = req.body.otp;
  const new_pwd = req.body.new_pwd;
  console.log(otp_number, otp, new_pwd);
  if (+otp === otp_number) {
    const password = await genPassword(new_pwd);
    const passwordUpdate = await client
      .db("equipments")
      .collection("users")
      .updateOne({ username: username }, { $set: { password: password } });
    if (passwordUpdate) {
      console.log("password updated");
      return response.send({ message: "password Updated" });
    }
    console.log("password couldnt update");
    return response.status(400).send("couldnt update");
  } else response.send({ message: "OTP not matched" });
});

async function sendMail(mailid, otp_number, req, response) {
  let mailTransporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      type: "OAuth2",
      user: process.env.mail_id,
      pass: process.env.password,
      clientId: process.env.client_id,
      clientSecret: process.env.client_secret,
      refreshToken: process.env.refresh_token,
    },
  });

  let mailDetails = {
    from: "<noReply>",
    to: mailid,
    subject: "OTP",
    text: `The verificaion code is ${otp_number}`,
  };

  mailTransporter.sendMail(mailDetails, async (err) => {
    if (err) {
      return response.status(400).send("email is not sent");
    }

    return response.send({
      message: "OTP sent to your e-mail",
      otp: otp_number,
    });
  });
}

router.get("/", async (request, response) => {
  const users = await getAllUsers(request);
  response.send(users);
  console.log(users);
});
router.post("/signup", async (request, response) => {
  const { username, mailid, password, confirmPwd } = request.body;
  console.log(username, mailid, password, confirmPwd);
  const isUserExist = await getUserByName(username);
  console.log(isUserExist);
  if (isUserExist) {
    response.status(400).send({ message: "User already exists" });
    return;
  }
  if (password != confirmPwd) {
    response.status(400).send({ message: "Confirm Password does not match" });
    return;
  }
  if (
    !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#%&]).{8,}$/g.test(password)
  ) {
    response.status(400).send({ message: "Password pattern does not match" });
    return;
  }

  const hashedPassword = await genPassword(password);
  const hashedConfirmPwd = await genConfirmPwd(confirmPwd);
  const result = createUser(username, mailid, hashedPassword, hashedConfirmPwd);
  response.send({ message: "Registered successfully" });
  console.log("Registered successfully");
});

router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  console.log(username, password);
  const userFromDB = await getUserByName(username);
  console.log(userFromDB);

  if (!userFromDB) {
    response.status(400).send({ message: "Invalid credentials" });
    return;
  }

  const storedDbPassword = userFromDB.password;
  const isPasswordMatch = await bcrypt.compare(password, storedDbPassword);
  if (!isPasswordMatch) {
    response.status(400).send({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
  response.send({ message: "Successfull Login", token });
});

export const usersRouter = router;
