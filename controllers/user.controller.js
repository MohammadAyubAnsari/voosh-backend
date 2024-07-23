import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import passport from "passport";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// signup
export const userSignup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
};

// login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
};

// Google login
export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google callback
export const googleCallback = (req, res) => {
  passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Decode token to check details
    const decodedToken = jwt.decode(token);
    console.log("Decoded Token:", decodedToken);

    // Verify token to check integrity and expiration
    jwt.verify(token, SECRET_KEY, (err, verifiedToken) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(500).json({ message: "Token verification failed" });
      } else {
        console.log("Verified Token:", verifiedToken);

        // Send token and decoded values in JSON response
        return res.json({
          message: "Authentication successful",
          // token: token,
          decodedToken: decodedToken,
        });
      }
    });
    // Redirect to frontend with token
    // res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  })(req, res);
};
