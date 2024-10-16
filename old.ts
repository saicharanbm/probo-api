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
        const userToBeMatched =Object.keys(requestOrders)[0];
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
    }

    // Check if require stock is greater than requested stocks by the user who bought the opposite stock
    //
    if (
      requiredStocks >=
      ORDERBOOK[stockSymbol][userStock][price].orders[userToBeMatched]
    ) {
      // now when the required stock is greater than the stock requested
      //available balance is the number if stocks that the user how bought the opposite stock has requested for.
      // const availableStocks =
      //   ORDERBOOK[stockSymbol][userStock][price].orders[userToBeMatched];
      // // Deduct the available stocks from requiredStocks
      // requiredStocks -= availableStocks;
      // Deduct the stock cost from balance
      // INR_BALANCES[userId].balance -= price * availableStocks;
      // ADMIN_Balance.balance += price * availableStocks;
      // Deduct the locked stock amount from the matched user
      // INR_BALANCES[userToBeMatched].locked -=
      //   oppositeStockPrice * availableStocks;
      // ADMIN_Balance.balance += oppositeStockPrice * availableStocks;
      // Deduct the matched stock count from the total stocks
      // ORDERBOOK[stockSymbol][userStock][price].total -= availableStocks;
      // Remove the matched user from the orders
      // delete ORDERBOOK[stockSymbol][userStock][price].orders[userToBeMatched];
      // Ensure STOCK_BALANCES exists for userToBeMatched
      // if (!STOCK_BALANCES[userToBeMatched]) {
      //   STOCK_BALANCES[userToBeMatched] = {};
      // }
      // if (!STOCK_BALANCES[userToBeMatched][stockSymbol]) {
      //   STOCK_BALANCES[userToBeMatched][stockSymbol] = { no: {}, yes: {} };
      // }
      // if (!STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock]) {
      //   STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock] = {};
      // }
      // if (
      //   !STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
      //     oppositeStockPrice
      //   ]
      // ) {
      //   STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
      //     oppositeStockPrice
      //   ] = { unmatched: 0, matched: 0 };
      // }
      // Modify the stock balances of the matched user
      // let unmatched =
      //   STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
      //     oppositeStockPrice
      //   ].unmatched;
      // let matched =
      //   STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
      //     oppositeStockPrice
      //   ].matched;
      // unmatched -= availableStocks;
      // matched += availableStocks;
      // STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
      //   oppositeStockPrice
      // ] = {
      //   unmatched,
      //   matched,
      // };
    } else {
      // ORDERBOOK[stockSymbol][userStock][price].orders[userToBeMatched] -=
      //   requiredStocks;
      //since the required stock is less than the stock requested

      // Deduct the stock cost from balance for the user who is buying the stock
      // INR_BALANCES[userId].balance -= price * requiredStocks;
      // ADMIN_Balance.balance += price * requiredStocks;

      //Deduct the locked stock amount from the matched user
      // INR_BALANCES[userToBeMatched].locked -=
      //   oppositeStockPrice * requiredStocks;
      // ADMIN_Balance.balance += oppositeStockPrice * requiredStocks;

      // ORDERBOOK[stockSymbol][userStock][price].total -= requiredStocks;
      //   if (!STOCK_BALANCES[userToBeMatched][stockSymbol]) {
      //     STOCK_BALANCES[userToBeMatched][stockSymbol] = { no: {}, yes: {} };
      //   }
      //   if (!STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock]) {
      //     STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock] = {};
      //   }

      //   if (
      //     !STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
      //       oppositeStockPrice
      //     ]
      //   ) {
      //     STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock][
      //       oppositeStockPrice
      //     ] = { unmatched: 0, matched: 0 };
      //   }
      //   let unmatched =
      //     STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock]?.[
      //       oppositeStockPrice
      //     ].unmatched;
      //   let matched =
      //     STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock]?.[
      //       oppositeStockPrice
      //     ].matched;

      //   unmatched -= requiredStocks;
      //   matched += requiredStocks;

      //   STOCK_BALANCES[userToBeMatched][stockSymbol][oppositeStock]![
      //     oppositeStockPrice
      //   ] = {
      //     unmatched,
      //     matched,
      //   };
      //   requiredStocks = 0;
      // }

      if (ORDERBOOK[stockSymbol][userStock][price].total <= 0) {
        delete ORDERBOOK[stockSymbol][userStock][price];
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
        ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice].orders
      ) {
        ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice].orders[
          userId
        ] += requiredStocks;
      } else {
        ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice].orders[
          userId
        ] = requiredStocks;
      }
    } else {
      ORDERBOOK[stockSymbol][oppositeStock][requiredMatchPrice] = {
        total: requiredStocks,
        orders: {
          [userId]: requiredStocks,
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
