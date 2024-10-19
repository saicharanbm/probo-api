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
    // this function gives the user the ability to cancel the stocks of the users which are not matched
    //what we do is when the user requests to cancel the order we look at the order book for the opposite stock type at the (10-price) per  stock.
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
  const oppositeStockType = stockType === "yes" ? "no" : "yes";
  const oppositeStockPrice = 1000 - price;

  if (
    !ORDERBOOK[stockSymbol][oppositeStockType] ||
    !ORDERBOOK[stockSymbol][oppositeStockType][oppositeStockPrice] ||
    !ORDERBOOK[stockSymbol][oppositeStockType][oppositeStockPrice].orders.req
  ) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "There is no Unmatched stocks for this stock." });
    return;
  }
  if (
    !ORDERBOOK[stockSymbol][oppositeStockType][oppositeStockPrice].orders.req[
      userId
    ]
  ) {
    res.status(ResponseStatus.BadRequest).json({
      error: `User ${userId} does not have any stocks at this price to sell.`,
    });
    return;
  }
  if (
    ORDERBOOK[stockSymbol][oppositeStockType][oppositeStockPrice].orders.req[
      userId
    ] < quantity
  ) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: `User ${userId} does not have the suffecient stocks.` });
    return;
  }
  ORDERBOOK[stockSymbol][oppositeStockType][oppositeStockPrice].orders.req[
    userId
  ] -= quantity;

  ORDERBOOK[stockSymbol][oppositeStockType][oppositeStockPrice].total -=
    quantity;
  if (
    ORDERBOOK[stockSymbol][oppositeStockType][oppositeStockPrice].orders.req[
      userId
    ] === 0
  ) {
    delete ORDERBOOK[stockSymbol][oppositeStockType][oppositeStockPrice].orders
      .req[userId];
  }
  if (
    ORDERBOOK[stockSymbol][oppositeStockType][oppositeStockPrice].total === 0
  ) {
    delete ORDERBOOK[stockSymbol][oppositeStockType][oppositeStockPrice];
  }
  // relese the locked amount to the users balance
  INR_BALANCES[userId].locked -= quantity * price;
  INR_BALANCES[userId].balance += quantity * price;

  //

  res
    .status(ResponseStatus.Success)
    .json({ message: "Requested stocks cancelled successfully." });
};
export { cancelOrder };
