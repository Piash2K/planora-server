import { Request, Response } from "express";

import { AuthServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthServices.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthServices.loginUser(req.body);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: unknown) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const AuthControllers = {
  createUser,
  loginUser,
};
