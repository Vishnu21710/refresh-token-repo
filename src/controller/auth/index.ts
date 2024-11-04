import { Request, Response } from "express";
import prismaClient from "../../db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userLogin = async (req: Request, res: Response) => {
  console.log("user login called");

  try {
    const user = await prismaClient.users.findUnique({
      where: {
        email: req.body.email,
      },
      include:{
        roles: true
      }
    });
    console.log("user", user);
    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles
      },
      process.env.ACCESS_TOKEN_SECRET || "",
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles
      },
      process.env.REFRESH_TOKEN_SECRET || "",
      { expiresIn: "1d" }
    );

    const updatedUser = await prismaClient.users.update({
      where: { id: user.id },
      data: {
        refreshToken: refreshToken,
      },
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    return res.json({
      id: user.id,
      accessToken,
    });
  } catch (error) {
    console.log("error", error);
    return res.json({
      error,
    });
  }
};

export const userLogout = async (req: Request, res: Response) => {
  try {
    console.log("User logout");

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    console.log("refresh token logout", refreshToken);

    const user = await prismaClient.users.update({
      where: {
        refreshToken: refreshToken,
      },
      data: {
        refreshToken: "",
      },
    });

    console.log("user logout", user);

    if (!user) {
      console.log("not user if");

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }
    console.log("clear cookies");

    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

    res.sendStatus(204);
  } catch (error) {
    console.log("error logout ", error);
    console.log("error userLogout", error);
  }
};
