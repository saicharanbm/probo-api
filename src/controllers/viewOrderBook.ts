import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
const viewOrderBook = (req: Request, res: Response) => {
  const stockSymbol = req.params;
  if (!stockSymbol) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide the stockSymbol." });
    return;
  }

  res.status(200).send("Request sent");
};

export { viewOrderBook };
