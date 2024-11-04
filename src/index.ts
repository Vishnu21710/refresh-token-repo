import express from "express"
import dotenv from "dotenv"
import userRouter from "./routes/user"
import { authRouter } from "./routes/auth/auth"
import cookieParser from 'cookie-parser'
import { refreshTokenRouter } from "./routes/refreshToken"
import employeeRouter from "./routes/employee"
import { verify } from "./middleware/verify"
dotenv.config()

const PORT = process.env.PORT || 8000
const app = express()
app.use(express.json())
app.use(cookieParser())


app.get('/', (_, res)=>res.send("Basic Express App With Zod And Prisma"))


app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use('/refresh', refreshTokenRouter)
app.use('/employee', verify, employeeRouter)

app.listen(PORT || 8000, ()=>{
    console.log(`Listening to port ${PORT} : url -> http://localhost:${PORT }`); 
})