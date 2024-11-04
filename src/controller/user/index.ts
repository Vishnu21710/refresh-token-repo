import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  console.log("Create User Called");
  const roleIds:number[] = req.body.roles
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  
  try {
    const new_user = await prisma.users.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
        roles: {
          connect: roleIds.map(role=>({id: role}))
        }
      },
    });
    console.log("new_user", new_user);
    return res.json({
      user: new_user,
    });
  } catch (error) {
    console.log(error, "create user error");
    if(error instanceof PrismaClientKnownRequestError){
      return res.status(400).json({
        ...(error?.meta && {meta: error.meta}),
        code: error.code,
        
      })
    }
    return res.status(400).json({
      error: 'Something went wrong',
    });
  }
};

export const getUsers = async(req: Request, res: Response)=>{
  try {
    const all_users = await prisma.users.findMany({
      select:{
        name: true,
        password: true,
        id: true
      }
    })
    console.log('all_users', all_users)
    return res.json({
      data: all_users
    })
  } catch (error) {
    console.log('error', error)
    return res.json({
      error
    })
  }
}