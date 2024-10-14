import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { INR_BALANCES } from "../utils/data";
const getInrBalance = (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide a userId" });
    return;
  }
  if (!INR_BALANCES[userId]) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "User with the provided userId does not exist." });
    return;
  }

  res.status(ResponseStatus.Success).json(INR_BALANCES[userId]);
};

export { getInrBalance };
