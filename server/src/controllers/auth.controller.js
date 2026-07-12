import { loginUser, signupUser } from "../services/auth.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { created, ok } from "../utils/respond.js";

export const signup = asyncHandler(async (req, res) => {
  const result = await signupUser(req.validated.body);
  return created(res, result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.validated.body);
  return ok(res, result);
});

export const me = asyncHandler(async (req, res) => {
  return ok(res, { user: req.user });
});
