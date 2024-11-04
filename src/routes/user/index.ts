import { Router } from "express";
import { createUser, getUsers } from "../../controller/user";
import { verify } from "../../middleware/verify";

const userRouter = Router()


userRouter.post('/', createUser)
userRouter.get('/', verify,  getUsers)


export default userRouter