import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { INR_BALANCES, STOCK_BALANCES } from "../utils/data";
const getStockBalance = (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide the userId." });
    return;
  }
  if (!INR_BALANCES[userId]) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "There is no user with this userId." });
    return;
  }
  if (Object.keys(STOCK_BALANCES[userId]).length === 0) {
    res
      .status(ResponseStatus.Success)
      .json({ message: "User has not bought any stocks." });
    return;
  }
  res.status(ResponseStatus.Success).json(STOCK_BALANCES[userId]);
};

export { getStockBalance };
