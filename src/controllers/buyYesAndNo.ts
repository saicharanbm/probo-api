import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import {
  ADMIN_Balance,
  INR_BALANCES,
  ORDERBOOK,
  STOCK_BALANCES,
  STOCK_DETAILS,
} from "../utils/data";
import { buyStock } from "../utils/buyStock";
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
  if (!STOCK_DETAILS[stockSymbol].isActive) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Results for this stock is already announced." });
    return;
  }
  //chech if user has enough balance
  if (INR_BALANCES[userId].balance < price * quantity) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "User does not have enough balance." });
    return;
  }

  if (stockType === "yes") {
    buyStock(userId, stockSymbol, "yes", "no", quantity, price);

    res
      .status(ResponseStatus.Success)
      .json({ message: "Yes Stock bought successfully." });
  } else if (stockType === "no") {
    buyStock(userId, stockSymbol, "no", "yes", quantity, price);
    res
      .status(ResponseStatus.Success)
      .json({ message: "No Stock bought successfully." });
  } else {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please enter a valid stock Type" });
  }
};

export { buyYesAndNo };
