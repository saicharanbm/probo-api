import { balance, orderBook, stockBalance, StockDetails } from "./types";

const INR_BALANCES: balance = {
  user1: {
    balance: 10000,
    locked: 1300,
  },
  user2: {
    balance: 20,
    locked: 2750,
  },
  user3: {
    balance: 20,
    locked: 0,
  },
};
// for v1 make stock price as number
const ORDERBOOK: orderBook = {
  BTC_USDT_10_Oct_2024_9_30: {
    yes: {
      950: {
        total: 12,
        orders: {
          user1: 2,
          user2: 10,
        },
      },
      850: {
        total: 6,
        orders: {
          user1: 3,
          user2: 3,
        },
      },
      400: {
        total: 3,
        orders: {
          user2: 3,
        },
      },
    },
    no: {
      100: {
        total: 1,
        orders: {
          user1: 1,
        },
      },
    },
  },
};

const STOCK_BALANCES: stockBalance = {
  user1: {
    BTC_USDT_10_Oct_2024_9_30: {
      yes: {
        900: {
          unmatched: 1,
          matched: 0,
        },
        400: {
          unmatched: 0,
          matched: 4,
        },
      },
      no: {
        50: {
          unmatched: 2,
          matched: 0,
        },
        150: {
          unmatched: 3,
          matched: 0,
        },
      },
    },
  },
  user2: {
    BTC_USDT_10_Oct_2024_9_30: {
      no: {
        600: {
          unmatched: 3,
          matched: 4,
        },
        50: {
          unmatched: 10,
          matched: 0,
        },
        150: {
          unmatched: 3,
          matched: 0,
        },
      },
    },
  },
};

const STOCK_DETAILS: StockDetails = {
  BTC_USDT_10_Oct_2024_9_30: {
    owner: "user1", // Owner of the stock symbol

    description: "This is a description",
    createdAt: "2024-10-10T09:30:00Z",
    endTime: "2024-10-10T09:30:00Z", // Time of result announcement

    isActive: true,
  },
};
let ADMIN_Balance: Record<string, number> = {
  balance: 4000,
};

export {
  INR_BALANCES,
  ORDERBOOK,
  STOCK_BALANCES,
  STOCK_DETAILS,
  ADMIN_Balance,
};
