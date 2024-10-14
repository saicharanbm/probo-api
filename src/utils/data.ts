import { balance, orderBook, stockBalance } from "./types";

const INR_BALANCES: balance = {
  user1: {
    balance: 10,
    locked: 0,
  },
  user2: {
    balance: 20,
    locked: 10,
  },
};
// for v1 make stock price as number
const ORDERBOOK: orderBook = {
  BTC_USDT_10_Oct_2024_9_30: {
    yes: {
      "9.5": {
        total: 12,
        orders: {
          user1: 2,
          user2: 10,
        },
      },
      "8.5": {
        total: 12,
        orders: {
          user1: 3,
          user2: 3,
          user3: 6,
        },
      },
    },
    no: {},
  },
};

const STOCK_BALANCES: stockBalance = {
  user1: {
    BTC_USDT_10_Oct_2024_9_30: {
      yes: {
        quantity: 1,
        locked: 0,
      },
    },
  },
  user2: {
    BTC_USDT_10_Oct_2024_9_30: {
      no: {
        quantity: 3,
        locked: 4,
      },
    },
  },
};

export { INR_BALANCES, ORDERBOOK, STOCK_BALANCES };
