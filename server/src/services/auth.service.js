import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function signupUser(payload) {
  const existing = await User.findOne({ email: payload.email });

  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const user = await User.create({ ...payload, password: hashedPassword });

  return { user: user.toJSON(), token: signToken(user) };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("No account found", 401);
  }

  const matches = await bcrypt.compare(password, user.password);

  if (!matches) {
    throw new AppError("Invalid email or password", 401);
  }

  return { user: user.toJSON(), token: signToken(user) };
}
