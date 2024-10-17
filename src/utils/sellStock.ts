import { ORDERBOOK } from "./data";

const sellStock = (
  userId: string,
  stockSymbol: string,
  stockType: string,
  price: number,
  quantity: number
) => {
  if (!(stockType == "yes" || stockType === "no")) {
    return;
  }
  if (!ORDERBOOK[stockSymbol][stockType][price]) {
    ORDERBOOK[stockSymbol][stockType][price] = {
      total: 0,
      orders: {
        sell: {},
        req: {},
      },
    };
  }
  ORDERBOOK[stockSymbol][stockType][price].total += quantity;
  if (!ORDERBOOK[stockSymbol][stockType][price].orders.sell[userId]) {
    ORDERBOOK[stockSymbol][stockType][price].orders.sell = {
      ...ORDERBOOK[stockSymbol][stockType][price].orders.sell,
      [userId]: quantity,
    };
  } else {
    ORDERBOOK[stockSymbol][stockType][price].orders.sell[userId] += quantity;
  }
};

export { sellStock };
