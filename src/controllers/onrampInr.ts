import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { INR_BALANCES } from "../utils/data";
const onrampInr = (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide all the fields." });
    return;
  }
  if (!INR_BALANCES[userId]) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "User with the provided userId does not exist." });
    return;
  }
  console.log("hello");
  if (typeof amount != "number" && amount < 0) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Amount should be greater than 0." });
    return;
  }
  INR_BALANCES[userId].balance += amount;

  res
    .status(ResponseStatus.Success)
    .json({ message: "Balance updated successfully." });
};

export { onrampInr };
