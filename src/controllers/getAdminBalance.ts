import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { ADMIN_Balance } from "../utils/data";
const getAdminBAlance = (req: Request, res: Response) => {
  res.status(ResponseStatus.Success).json(ADMIN_Balance);
};

export { getAdminBAlance };
