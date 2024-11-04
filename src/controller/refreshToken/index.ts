// import { Request, Response } from "express";
// import prismaClient from "../../db";
// import jwt, { decode } from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// export const handleRefreshToken = async (req: Request, res: Response) => {
//   try {
//     const cookies = req.cookies;
//     console.log("cookies", cookies);
//     if (!cookies?.jwt) {
//       return res.status(401).json("Unauthorized");
//     }
//     console.log("cookies.jwt", cookies.jwt);
//     const refreshToken = cookies.jwt;

//     const user = await prismaClient.users.findFirst({
//       where: {
//         refreshToken,
//       },
//     });
//     console.log("user refresh", user);
//     if (!user) return res.sendStatus(401);

//     jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET!,
//       //@ts-ignore
//       (err, decoded) => {
//         if (err) {
//           console.log("err", err);
//           return res.status(403).send("Invalid Refresh Token");
//         }
//         console.log("decoded", decoded);

//         const newAccessToken = jwt.sign(
//           { id: decoded.id, email: decoded.email, roles: decoded.roles },
//           process.env.ACCESS_TOKEN_SECRET || "",
//           { expiresIn: "30s" }
//         );

//         res.json(newAccessToken);
//       }
//     );
//   } catch (error) {
//     console.log("error refresh token error", error);
//   }
// };

import { Request, Response } from "express";
import prismaClient from "../../db";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  roles: string[];
}

export const handleRefreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const cookies = req.cookies;
    console.log("cookies", cookies);
    if (!cookies?.jwt) {
      res.status(401).json("Unauthorized");
      return;
    }
    console.log("cookies.jwt", cookies.jwt);
    const refreshToken = cookies.jwt;

    const user = await prismaClient.users.findFirst({
      where: {
        refreshToken,
      },
    });
    console.log("user refresh", user);
    if (!user) {
      res.sendStatus(401);
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (err: VerifyErrors | null, decoded:any) => {
        if (err || !decoded) {
          console.log("err", err);
          res.status(403).send("Invalid Refresh Token");
          return;
        }
        console.log("decoded", decoded);

        const newAccessToken = jwt.sign(
          { id: decoded.id, email: decoded.email, roles: decoded.roles },
          process.env.ACCESS_TOKEN_SECRET || "",
          { expiresIn: "30s" }
        );

        res.json(newAccessToken);
      }
    );
  } catch (error) {
    console.log("error refresh token error", error);
    res.status(500).json("Internal Server Error");
  }
};

