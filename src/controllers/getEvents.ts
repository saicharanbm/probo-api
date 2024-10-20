import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { STOCK_DETAILS } from "../utils/data";
const getEvents = (req: Request, res: Response) => {
  res.status(ResponseStatus.Success).json(STOCK_DETAILS);
};

export { getEvents };
