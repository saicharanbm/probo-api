import { ORDERBOOK, INR_BALANCES, STOCK_BALANCES, ADMIN_Balance } from "./data";

const buyStock = (
  userId: string,
  stockSymbol: string,
  userStock: "yes" | "no",
  oppositeStock: "yes" | "no",
  quantity: number,
  price: number
) => {
  let requiredStocks = quantity;
  const oppositeStockPrice = 1000 - price;

  // Step 1: Check if the required quantity of stocks is present in the order book and assign
  // whatever is available to the user.
  if (
    // ORDERBOOK[stockSymbol] &&
    // ORDERBOOK[stockSymbol][userStock] &&
    ORDERBOOK[stockSymbol][userStock][price]
  ) {
    while (ORDERBOOK[stockSymbol][userStock][price] && requiredStocks > 0) {
      //now check for the request stock if you find one then do the matching if you dont find one, you check the selling stock
      //get the first user id of the required stock

      if (ORDERBOOK[stockSymbol][userStock][price].orders.req) {
        const requestOrders =
          ORDERBOOK[stockSymbol][userStock][price].orders.req;
        const userToBeMatched = Object.keys(requestOrders)[0];
        if (requiredStocks >= requestOrders[userToBeMatched]) {
          //available balance is the number of stocks that the user who bought the opposite stock has requested for.
          const availableStocks = requestOrders[userToBeMatched];

          // Deduct the available stocks from requiredStocks
          requiredStocks -= availableStocks;

          // Deduct the stock cost from balance
          INR_BALANCES[userId].balance -= price * availableStocks;
          ADMIN_Balance.balance += price * availableStocks;

          // Deduct the locked stock amount from the matched user
          INR_BALANCES[userToBeMatched].locked -=
            oppositeStockPrice * availableStocks;
          ADMIN_Balance.balance += oppositeStockPrice * availableStocks;

          // Deduct the matched stock count from the total stocks
          ORDERBOOK[stockSymbol][userStock][price].total -= availableStocks;

          // Remove the matched user from the orders
          delete requestOrders[userToBeMatched];

          //now start updating the order book with respect to the matches that you have made.
          if (!STOCK_BALANCES[userToBeMatched][stockSymbol]) {
            STOCK_BALANCES[userToBeMatched][stockSymbol] = {
              no: {},
              yes: {},
            };
          }
          if (!STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock]) {
            STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock] = {};
          }

          if (
            !STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
              oppositeStockPrice
            ]
          ) {
            STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
              oppositeStockPrice
            ] = { unmatched: 0, matched: 0 };
          }

          let unmatched =
            STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
              oppositeStockPrice
            ].unmatched;
          let matched =
            STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
              oppositeStockPrice
            ].matched;

          unmatched -= availableStocks;
          matched += availableStocks;
          STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
            oppositeStockPrice
          ] = {
            unmatched,
            matched,
          };
        } else {
          requestOrders[userToBeMatched] -= requiredStocks;

          //since the required stock is less than the stock requested

          // Deduct the stock cost from balance for the user who is buying the stock
          INR_BALANCES[userId].balance -= price * requiredStocks;
          ADMIN_Balance.balance += price * requiredStocks;

          //Deduct the locked stock amount from the matched user
          INR_BALANCES[userToBeMatched].locked -=
            oppositeStockPrice * requiredStocks;
          ADMIN_Balance.balance += oppositeStockPrice * requiredStocks;
          //remove the matched stocks from the total in order book.
          ORDERBOOK[stockSymbol][userStock][price].total -= requiredStocks;

          // modify the stockbalance on the basis of stocked matched.
          if (!STOCK_BALANCES[userToBeMatched][stockSymbol]) {
            STOCK_BALANCES[userToBeMatched][stockSymbol] = {
              no: {},
              yes: {},
            };
          }
          if (!STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock]) {
            STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock] = {};
          }

          if (
            !STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
              oppositeStockPrice
            ]
          ) {
            STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
              oppositeStockPrice
            ] = { unmatched: 0, matched: 0 };
          }
          let unmatched =
            STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock]?.[
              oppositeStockPrice
            ].unmatched;
          let matched =
            STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock]?.[
              oppositeStockPrice
            ].matched;

          unmatched -= requiredStocks;
          matched += requiredStocks;

          STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock]![
            oppositeStockPrice
          ] = {
            unmatched,
            matched,
          };
          requiredStocks = 0;
        }
        if (ORDERBOOK[stockSymbol][userStock][price].total <= 0) {
          delete ORDERBOOK[stockSymbol][userStock][price];
        }
      }
    }
    //Now since you have iterated through the request stoks now look for the selling stocks before making the request
    while (ORDERBOOK[stockSymbol][userStock][price] && requiredStocks > 0) {
      if (ORDERBOOK[stockSymbol][userStock][price].orders.sell) {
        const sellOrders = ORDERBOOK[stockSymbol][userStock][price].orders.sell;
        const userSellingTheStock = Object.keys(sellOrders)[0];
        const availableStocks = sellOrders[userSellingTheStock];
        if (requiredStocks >= availableStocks) {
          requiredStocks -= availableStocks;
          //award the seller with the buyers money

          INR_BALANCES[userSellingTheStock].balance += price * availableStocks;
          //deduct the price for the stock from the users account.
          INR_BALANCES[userId].balance -= price * availableStocks;

          //now remove the stock from the stock balance of the seller and award it to the new buyer.
          if (!STOCK_BALANCES[userSellingTheStock][stockSymbol][userStock]) {
            STOCK_BALANCES[userSellingTheStock][stockSymbol][userStock] = {};
          }
          STOCK_BALANCES[userSellingTheStock][stockSymbol][userStock][
            price
          ].matched -= availableStocks;

          //award the stock to the buyer this will be done out side of the loop so that we can do it for all the stocks pought at a time.
          // if (!STOCK_BALANCES[userId][stockSymbol][userStock]) {
          //   STOCK_BALANCES[userId][stockSymbol][userStock] = {};
          // }
          // if (!STOCK_BALANCES[userId][stockSymbol][userStock][price]) {
          //   STOCK_BALANCES[userId][stockSymbol][userStock][price] = {
          //     matched: 0,
          //     unmatched: 0,
          //   };
          // }
          // STOCK_BALANCES[userId][stockSymbol][userStock][price].matched +=
          //   availableStocks;
          //remove the selling order from the order book.
          sellOrders[userSellingTheStock] = 0;
          //delete the user record from the sell in the orderbook
          delete sellOrders[userSellingTheStock];
        } else {
          // since there are more selling order than the requested stocks what we will do is
          //deduct the selling order with the required stocks.
          sellOrders[userSellingTheStock] -= requiredStocks;

          //then award the user who sold the stocks.
          INR_BALANCES[userSellingTheStock].balance += price * requiredStocks;

          //now deduct the stock price for the quantity of stock bought from the buyer.
          INR_BALANCES[userId].balance -= price * requiredStocks;

          //now remove the stock from the stock balance of the seller and award it to the new buyer.
          if (!STOCK_BALANCES[userSellingTheStock][stockSymbol][userStock]) {
            STOCK_BALANCES[userSellingTheStock][stockSymbol][userStock] = {};
          }
          STOCK_BALANCES[userSellingTheStock][stockSymbol][userStock][
            price
          ].matched -= requiredStocks;

          // Since we are able to fulfill all the requested stocks we will change it to 0.
          requiredStocks = 0;
        }
      }
    }
    // Update stock balances for the current user after matching thestocks

    if (!STOCK_BALANCES[userId]) {
      STOCK_BALANCES[userId] = {};
    }
    if (!STOCK_BALANCES[userId][stockSymbol]) {
      STOCK_BALANCES[userId][stockSymbol] = { no: {}, yes: {} };
    }
    if (!STOCK_BALANCES[userId][stockSymbol][userStock]) {
      STOCK_BALANCES[userId][stockSymbol][userStock] = {};
    }
    if (!STOCK_BALANCES[userId][stockSymbol][userStock][price]) {
      STOCK_BALANCES[userId][stockSymbol][userStock][price] = {
        unmatched: 0,
        matched: 0,
      };
    }
    STOCK_BALANCES[userId][stockSymbol][userStock][price].matched +=
      quantity - requiredStocks;
  }
  if (requiredStocks > 0) {
    // Now add a request entry in the order book for the opposite stock
    const requiredMatchPrice = 1000 - price;

    if (
      ORDERBOOK[stockSymbol] &&
      ORDERBOOK[stockSymbol][oppositeStock] &&
      ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice]
    ) {
      const total =
        ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice].total +
        requiredStocks;
      ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice].total = total;

      if (
        userId in
        ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice].orders.req
      ) {
        ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice].orders.req[
          userId
        ] += requiredStocks;
      } else {
        ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice].orders.req[
          userId
        ] = requiredStocks;
      }
    } else {
      ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice] = {
        total: requiredStocks,
        orders: {
          sell: {},
          req: {
            [userId]: requiredStocks,
          },
        },
      };
    }

    //now make an entry into the stock balance for the opposite user
    if (!STOCK_BALANCES[userId][stockSymbol]) {
      STOCK_BALANCES[userId][stockSymbol] = { no: {}, yes: {} };
    }
    if (!STOCK_BALANCES[userId][stockSymbol][userStock]) {
      STOCK_BALANCES[userId][stockSymbol][userStock] = {};
    }
    if (!STOCK_BALANCES[userId][stockSymbol][userStock][price]) {
      STOCK_BALANCES[userId][stockSymbol][userStock][price] = {
        unmatched: 0,
        matched: 0,
      };
    }
    STOCK_BALANCES[userId][stockSymbol][userStock][price].unmatched +=
      requiredStocks;

    //deduct lock the user balance
    INR_BALANCES[userId].locked += requiredStocks * price;
    INR_BALANCES[userId].balance -= requiredStocks * price;
  }
};

export { buyStock };
