import { STOCK_BALANCES, ADMIN_Balance, INR_BALANCES } from "./data";

const rewardWinners = (stockSymbol: string, result: "yes" | "no") => {
  for (let userId in STOCK_BALANCES) {
    const userStocks = STOCK_BALANCES[userId];
    if (!userStocks) continue;

    for (let stockSymb in userStocks) {
      if (stockSymb === stockSymbol) {
        const winningStock = userStocks[stockSymbol];

        if (!winningStock) continue;

        const stockWinnerTypeData = winningStock[result];
        if (!stockWinnerTypeData) continue;
        for (const stockPrice in stockWinnerTypeData) {
          const stockDetails = stockWinnerTypeData;
          if (stockDetails) {
            // This is where you can safely access stockDetails.matched and stockDetails.locked
            const { quantity, locked } = stockDetails;

            if (quantity > 0) {
              ADMIN_Balance.balance -= quantity * 1000;
              INR_BALANCES[userId].balance += quantity * 1000;
            }
            if (locked > 0) {
              INR_BALANCES[userId].locked -= locked * Number(stockPrice);
              INR_BALANCES[userId].balance += locked * Number(stockPrice);
            }
          }
        }
        const losingStock = result === "yes" ? "no" : "yes";
        const stockLoserTypeData = winningStock[losingStock];
        if (!stockLoserTypeData) continue;
        for (const stockPrice in stockLoserTypeData) {
          const stockDetails = stockLoserTypeData;
          if (stockDetails) {
            // This is where you can safely access stockDetails.matched and stockDetails.locked
            const { quantity, locked } = stockDetails;

            if (locked > 0) {
              INR_BALANCES[userId].locked -= locked * Number(stockPrice);
              INR_BALANCES[userId].balance += locked * Number(stockPrice);
            }
          }
        }
      }
    }
  }
};

export { rewardWinners };
