import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { INR_BALANCES, STOCK_BALANCES } from "../utils/data";
const createUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide the userId." });
    return;
  }
  if (INR_BALANCES[userId]) {
    res
      .status(ResponseStatus.Conflict)
      .json({ error: "User with this id already exists." });
    return;
  }
  INR_BALANCES[userId] = {
    balance: 0,
    locked: 0,
  };
  STOCK_BALANCES[userId] = {};

  res.status(ResponseStatus.Success).json({ message: "New user created." });
};

export { createUser };
