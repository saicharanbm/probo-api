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
    // let requiredStocks = quantity;

    // const oppositeStockPrice = 1000 - price;

    //step 1: check is the required quantity of stocks is present in order book and assign
    // what ever is available to the user.
    // if (ORDERBOOK[stockSymbol]["yes"][price]) {
    //   while (ORDERBOOK[stockSymbol]["yes"][price] && requiredStocks > 0) {
    //     const userToBeMatched = Object.keys(
    //       ORDERBOOK[stockSymbol]["yes"][price].orders
    //     )[0];

    //     //check if available stock is greater than required stocks
    //     if (
    //       requiredStocks >=
    //       ORDERBOOK[stockSymbol]["yes"][price].orders[userToBeMatched]
    //     ) {
    //       const availableStocks =
    //         ORDERBOOK[stockSymbol]["yes"][price].orders[userToBeMatched];

    //       requiredStocks -= availableStocks;
    //       //deduct the stock cost from balance
    //       INR_BALANCES[userId].balance -= price * availableStocks;
    //       ADMIN_Balance.balance += price * availableStocks;

    //       //deduct the locked stock amount from the matched user
    //       INR_BALANCES[userToBeMatched].locked -=
    //         oppositeStockPrice * availableStocks;
    //       ADMIN_Balance.balance += oppositeStockPrice * availableStocks;

    //       ORDERBOOK[stockSymbol]["yes"][price].total -= availableStocks;
    //       delete ORDERBOOK[stockSymbol]["yes"][price].orders[userToBeMatched];

    //       // Ensure STOCK_BALANCES exists for userToBeMatched
    //       if (!STOCK_BALANCES[userToBeMatched][stockSymbol]) {
    //         STOCK_BALANCES[userToBeMatched][stockSymbol] = { no: {} };
    //       }

    //       //modify the stock balances of the matched user.
    //       let unmatched =
    //         STOCK_BALANCES[userToBeMatched][stockSymbol]["no"]?.[
    //           oppositeStockPrice
    //         ].unmatched ?? 0;
    //       let matched =
    //         STOCK_BALANCES[userToBeMatched][stockSymbol]["no"]?.[
    //           oppositeStockPrice
    //         ].matched ?? 0;

    //       unmatched -= availableStocks;
    //       matched += availableStocks;

    //       STOCK_BALANCES[userToBeMatched][stockSymbol]["no"]![
    //         oppositeStockPrice
    //       ] = {
    //         unmatched,
    //         matched,
    //       };
    //     } else {
    //       ORDERBOOK[stockSymbol]["yes"][price].orders[userToBeMatched] -=
    //         requiredStocks;

    //       INR_BALANCES[userId].balance -= price * requiredStocks;
    //       ADMIN_Balance.balance += price * requiredStocks;

    //       INR_BALANCES[userToBeMatched].locked -=
    //         oppositeStockPrice * requiredStocks;
    //       ADMIN_Balance.balance += oppositeStockPrice * requiredStocks;

    //       ORDERBOOK[stockSymbol]["yes"][price].total -= requiredStocks;

    //       let unmatched =
    //         STOCK_BALANCES[userToBeMatched][stockSymbol]["no"]?.[
    //           oppositeStockPrice
    //         ].unmatched ?? 0;
    //       let matched =
    //         STOCK_BALANCES[userToBeMatched][stockSymbol]["no"]?.[
    //           oppositeStockPrice
    //         ].matched ?? 0;

    //       unmatched -= requiredStocks;
    //       matched += requiredStocks;

    //       STOCK_BALANCES[userToBeMatched][stockSymbol]["no"]![
    //         oppositeStockPrice
    //       ] = {
    //         unmatched,
    //         matched,
    //       };
    //       requiredStocks = 0;
    //     }

    //     if (ORDERBOOK[stockSymbol]["yes"][price].total <= 0) {
    //       delete ORDERBOOK[stockSymbol]["yes"][price];
    //     }
    //   }

    //   // Update stock balances for the current user after matching
    //   if (STOCK_BALANCES[userId][stockSymbol]["yes"]?.[price]) {
    //     STOCK_BALANCES[userId][stockSymbol]["yes"][price].matched +=
    //       quantity - requiredStocks;
    //   }
    // }

    // if (requiredStocks > 0) {
    //   //now add a request entry in the order book for the opposite stock.
    //   const requiredMatchPeice = 1000 - price;
    //   if (ORDERBOOK[stockSymbol]["no"][requiredMatchPeice]) {
    //     const total =
    //       ORDERBOOK[stockSymbol]["no"][requiredMatchPeice].total +
    //       requiredStocks;
    //     ORDERBOOK[stockSymbol]["no"][requiredMatchPeice].total = total;
    //     if (userId in ORDERBOOK[stockSymbol]["no"][requiredMatchPeice].orders) {
    //       ORDERBOOK[stockSymbol]["no"][requiredMatchPeice].orders[userId] +=
    //         requiredStocks;
    //     } else {
    //       ORDERBOOK[stockSymbol]["no"][requiredMatchPeice].orders[userId] =
    //         requiredStocks;
    //     }
    //   } else {
    //     ORDERBOOK[stockSymbol]["no"][requiredMatchPeice] = {
    //       total: requiredStocks,
    //       orders: {
    //         [userId]: requiredStocks,
    //       },
    //     };
    //   }
    // }
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
