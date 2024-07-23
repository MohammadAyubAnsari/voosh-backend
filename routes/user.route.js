// import express from "express";
// import {
//   // googleLogin,
//   userLogin,
//   userSignup,
// } from "../controllers/user.controller.js";

// const router = express.Router();

// router.post("/signup", userSignup);
// router.post("/login", userLogin);
// // router.post("/google-login", googleLogin);

// export default router;

import express from "express";
import {
  googleLogin,
  googleCallback,
  userLogin,
  userSignup,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

export default router;
