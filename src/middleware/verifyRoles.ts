import { Request, Response, NextFunction } from "express";
export const verifyRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      //@ts-ignore
      if (!req.user.roles) return res.sendStatus(401);
      //@ts-ignore
      const userRoles:string[] = req.user.roles.map((role) => String(role.role_id));
      const rolesArray = [...allowedRoles];

      //@ts-ignore
      const result: boolean = userRoles
        .map((role: string) => rolesArray.includes(role))
        .find((val: boolean) => val === true);

      if (!result) return res.sendStatus(401);
      next();
    } catch (error) {
      console.log("error verify roles", error);
    }
  };
};
