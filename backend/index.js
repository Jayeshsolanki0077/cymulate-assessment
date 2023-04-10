const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.m9mg1.gcp.mongodb.net/test",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
),(err) => {
  if(err) {
    console.log(err)
  } else {
    console.log('connected')
  }
};

const PORT = 3002;
require("dotenv").config();

const jwt = require("jsonwebtoken");
const sendMail = require("./utis/email");
const user = require('./models/user')

app.use(express.json());

const cors = require("cors");

app.use(cors());


const users = [
  {
    name: "jayes",
    email: "jayesh@gmail.com",
    password: "manish",
    isAdmin: true,
  },
  {
    name: "manish",
    email: "manish@gmail.com",
    password: "manish",
    password: "jayesh",
    isAdmin: true,
  },
];

let refreshTokens = [];

app.post("/api/refresh", (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //if everything is ok, create new access token, refresh token and send to user
});

app.post("/api/email", async (req, res) => {
  const { emailaddress } = req.body;
  let collection = await db.collection("test");
  try {
    const send_to = emailaddress;
    const send_from = process.env.EMAIL_USER;
    const reply_to = emailaddress;
    const subject = "Thank you MEssage";
    const message = `<h2> Jayesh </h2> <p> Thanks you for meial </p> <a href="http://www.google.com" `;
    await sendMail.sendMail(send_to, send_from, reply_to, subject, message);
    let newDocument = req.body;
    await collection.insertOne(newDocument);
      res.status(200).json({ success: true, message: "Email sent" });
  } catch (e) {
    res.status(500).json(e.message);
  }
});

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
    expiresIn: "5s",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshSecretKey");
};

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => {
    return u.email === email && u.password === password;
  });
  if (user) {
    //Generate an access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({
      email: user.email,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("Username or password incorrect!");
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

app.listen(PORT, () => {
  console.log(`port is running on ${PORT}`);
});
