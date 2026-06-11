import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Db, UserEntity } from "../db";
import { authenticateToken, AuthenticatedRequest, JWT_SECRET } from "./middleware";

const router = Router();

// POST /signup
router.post("/signup", async (req, res) => {
  const { name, email, password, dateOfBirth } = req.body;

  if (!name || !email || !password || !dateOfBirth) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = Db.read();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser: UserEntity = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    dateOfBirth,
  };

  db.users.push(newUser);
  Db.write(db);

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "7d" });

  const { passwordHash: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword, token });
});

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const db = Db.read();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  const { passwordHash: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
});

// GET /me
router.get("/me", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = Db.read();
  const user = db.users.find(u => u.id === req.userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// PUT /profile
router.put("/profile", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { name, dateOfBirth, gender, avatar } = req.body;

  const db = Db.read();
  const userIndex = db.users.findIndex(u => u.id === req.userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = db.users[userIndex];
  if (name) user.name = name;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;
  if (gender) user.gender = gender;
  if (avatar) user.avatar = avatar;

  db.users[userIndex] = user;
  Db.write(db);

  const { passwordHash: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

export default router;
