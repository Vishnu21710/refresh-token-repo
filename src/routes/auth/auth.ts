import { Router } from "express";
import { userLogin, userLogout } from "../../controller/auth";

export const authRouter = Router()

authRouter.get('/', (req, res)=>{
    console.log('working')
})
authRouter.post('/login', userLogin)
authRouter.get('/logout', userLogout)

