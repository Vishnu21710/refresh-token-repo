import { Request, Response } from "express";


export const createEmployee = (req: Request, res:Response)=>{
    try {
        return res.json({
            message: "Employee Creted Successfully"
        })
    } catch (error) {
        
    }
}


export const updateEmployee = (req: Request, res:Response)=>{
    try {
        return res.json({
            message: "Employee Updated Successfully"
        })
    } catch (error) {
        
    }
}


export const deleteEmployee = (req: Request, res:Response)=>{
    try {
        return res.json({
            message: "Employee Deleted Successfully"
        })
    } catch (error) {
        
    }
}