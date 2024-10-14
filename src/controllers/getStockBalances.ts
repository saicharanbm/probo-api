import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { STOCK_BALANCES } from "../utils/data";
const getStockBalances = (req: Request, res: Response) => {
  res.status(ResponseStatus.Success).json(STOCK_BALANCES);
};

export { getStockBalances };
