import { Router } from "express";
import { handleRefreshToken } from "../../controller/refreshToken";

export const refreshTokenRouter = Router()

refreshTokenRouter.get('/', handleRefreshToken)

