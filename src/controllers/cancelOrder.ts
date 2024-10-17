import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "../utils/data";
const cancelOrder = (req: Request, res: Response) => {
  const { userId, stockSymbol, stockType, quantity, price } = req.body;
  if (
    !userId ||
    !stockSymbol ||
    !stockType ||
    !quantity ||
    !price ||
    typeof userId !== "string" ||
    typeof stockSymbol !== "string" ||
    typeof stockType !== "string" ||
    typeof price !== "number"
  ) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide all the details." });
    return;
  }

  if (!INR_BALANCES[userId]) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: `User with this userID: ${userId} does not exist.` });
    return;
  }
  if (!ORDERBOOK[stockSymbol]) {
    res.status(ResponseStatus.BadRequest).json({
      error: `Stock Symbol: ${stockSymbol} is either expired or not present.`,
    });
    return;
  }
  // if (!(stockType == "yes" || stockType === "no")) {
  //   res.status(ResponseStatus.BadRequest).json({
  //     error: `Stock Type should be yes or no.`,
  //   });
  //   return;
  // }

  // if (!STOCK_BALANCES[userId][stockSymbol][stockType]) {
  //   res.status(ResponseStatus.BadRequest).json({
  //     error: `User ${userId} does not have any stock of type ${stockType} to cancel .`,
  //   });
  //   return;
  // }
  // if (!STOCK_BALANCES[userId][stockSymbol][stockType][price]) {
  //   res.status(ResponseStatus.NotFound).json({
  //     error: `User ${userId} does not have any stock of type ${stockType} at the price ${price} to cancel .`,
  //   });
  //   return;
  // }
  // if (
  //   STOCK_BALANCES[userId][stockSymbol][stockType][price].unmatched < quantity
  // ) {
  //   res.status(ResponseStatus.BadRequest).json({
  //     error: "You dont have enought quantity of stocks.",
  //   });
  //   return;
  // }

  // STOCK_BALANCES[userId][stockSymbol][stockType][price].unmatched -= quantity;
  // INR_BALANCES[userId].locked -= quantity * price;
  // INR_BALANCES[userId].balance += quantity * price;

  res
    .status(ResponseStatus.Success)
    .json({ message: "Requested stocks cancelled successfully." });
};
export { cancelOrder };
