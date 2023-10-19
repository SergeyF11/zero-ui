import express from "express";
import rateLimit from "express-rate-limit";
const router = express.Router();

import * as auth from "../services/auth.js";

const loginLimiter = rateLimit({
  windowMs: (Number(process.env.ZT_BAN_TIME) || 30) * 60 * 1000, // 30 minutes
  max: Number(process.env.ZT_TRIES_TO_BAN) || 50, // limit each IP to 50 requests per windowMs
  message: {
    status: 429,
    error: "tooManyAttempts",
  },
});

router.get("/login", async function (req, res) {
  if (process.env.ZU_DISABLE_AUTH === "true") {
    res.send({ enabled: false });
  } else {
    res.send({ enabled: true });
  }
});

router.post("/login", loginLimiter, async function (req, res) {
  if (req.body.username && req.body.password) {
    auth.authorize(req.body.username, req.body.password, function (err, user) {
      if (user) {
        res.send({ token: user["token"] });
      } else {
        res.status(401).send({
          error: err.message,
        });
      }
    });
  } else {
    res.status(400).send({ error: "Specify username and password" });
  }
});

export default router;
