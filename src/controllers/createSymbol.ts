import { Request, Response } from "express";
import { ORDERBOOK } from "../utils/data";
import { ResponseStatus } from "../utils/types";
const createSymbol = (req: Request, res: Response) => {
  const { stockSymbol } = req.params;
  if (ORDERBOOK[stockSymbol]) {
    res
      .status(ResponseStatus.Conflict)
      .json({ error: "Stock with this symbol already exist." });
    return;
  }
  ORDERBOOK[stockSymbol] = {
    yes: {},
    no: {},
  };
  res
    .status(ResponseStatus.Success)
    .json({ message: "Stock symbol created successfully." });
};

export { createSymbol };
