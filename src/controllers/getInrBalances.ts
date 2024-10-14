import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { INR_BALANCES } from "../utils/data";
const getInrBalances = (req: Request, res: Response) => {
  res.status(ResponseStatus.Success).json(INR_BALANCES);
};

export { getInrBalances };
