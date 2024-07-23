import express from "express";
import {
  createTask,
  deleteTask,
  getAllTask,
  getSingleTask,
  updateTask,
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/create", createTask);
router.get("/get-all", getAllTask);
router.get("/get/:id", getSingleTask);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);

export default router;
