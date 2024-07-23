import express from "express";
import connectMongoDB from "./config/dbConfig.js";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import taskRoute from "./routes/task.route.js";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5300;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/health", async (req, res) => {
  res.send({ message: "Health OK!" });
});
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
  connectMongoDB();
});
