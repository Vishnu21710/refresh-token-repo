import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../../controller/employees";
import { verifyRoles } from "../../middleware/verifyRoles";

const employeeRouter = Router();

employeeRouter.post("/", verifyRoles("201", "202"), createEmployee);
employeeRouter.put("/", verifyRoles("201"), updateEmployee);
employeeRouter.delete("/", verifyRoles("200"), deleteEmployee);


export default employeeRouter