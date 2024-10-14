import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { ORDERBOOK } from "../utils/data";
const getOrderBook = (req: Request, res: Response) => {
  res.status(ResponseStatus.Success).send(ORDERBOOK);
};

export { getOrderBook };
