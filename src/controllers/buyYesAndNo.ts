import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { INR_BALANCES, ORDERBOOK } from "../utils/data";
const buyYesAndNo = (req: Request, res: Response) => {
  const { userId, stockSymbol, quantity, price, stockType } = req.body;
  if (!userId || !stockSymbol || !quantity || !price || !stockType) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please fill all the fields." });
    return;
  }
  if (
    typeof quantity !== "number" ||
    typeof price != "number" ||
    quantity < 0 ||
    price < 50 ||
    price > 950
  ) {
    res.status(ResponseStatus.BadRequest).json({
      error: "Please provide a valid quantity and price.",
    });
    return;
  }
  if (!INR_BALANCES[userId]) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "There is no user with this userId" });
    return;
  }
  if (!ORDERBOOK[stockSymbol]) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Stock symbol doesnot exist in the Order Book." });
    return;
  }

  if (stockType === "yes") {
    const stockPrice = (price / 100).toFixed(1);
    let requiredStocks = quantity;
    //step 1: check is the required quantity of stocks is present in order book and assign
    // what ever is available to the user.
    if (ORDERBOOK[stockSymbol]["yes"][stockPrice]) {
      while (ORDERBOOK[stockSymbol]["yes"][stockPrice] && requiredStocks > 0) {
        const userToBeMatched = Object.keys(
          ORDERBOOK[stockSymbol]["yes"][stockPrice].orders
        )[0];
      }
    }
    res.status(200).send(ORDERBOOK[stockSymbol]["yes"][stockPrice]);
  } else if (stockType === "no") {
    res.status(200).send("no");
  } else {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please enter a valid stock Type" });
  }
};

export { buyYesAndNo };
