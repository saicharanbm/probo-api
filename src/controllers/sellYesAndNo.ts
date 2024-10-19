import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "../utils/data";
import { sellStock } from "../utils/sellStock";
const sellYesAndNo = (req: Request, res: Response) => {
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
  if (!(stockType == "yes" || stockType === "no")) {
    res.status(ResponseStatus.BadRequest).json({
      error: `Stock Type should be yes or no.`,
    });
    return;
  }
  if (!STOCK_BALANCES[userId][stockSymbol][stockType]) {
    res.status(ResponseStatus.BadRequest).json({
      error: `User ${userId} does not have any stock of type ${stockType} to sell .`,
    });
    return;
  }

  if (STOCK_BALANCES[userId][stockSymbol][stockType].quantity < quantity) {
    res.status(ResponseStatus.BadRequest).json({
      error: "You dont have enought quantity of stocks to sell.",
    });
    return;
  }
  STOCK_BALANCES[userId][stockSymbol][stockType].quantity -= quantity;
  STOCK_BALANCES[userId][stockSymbol][stockType].locked += quantity;

  sellStock(userId, stockSymbol, stockType, price, quantity);
  res
    .status(ResponseStatus.Success)
    .json({ message: "Stock Sold successfully." });
};

export { sellYesAndNo };
