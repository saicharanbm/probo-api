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
          const stockDetails = stockWinnerTypeData[stockPrice];
          if (stockDetails) {
            // This is where you can safely access stockDetails.matched and stockDetails.unmatched
            const { matched, unmatched } = stockDetails;

            if (matched > 0) {
              ADMIN_Balance.balance -= matched * 1000;
              INR_BALANCES[userId].balance += matched * 1000;
            }
            if (unmatched > 0) {
              INR_BALANCES[userId].locked -= unmatched * Number(stockPrice);
              INR_BALANCES[userId].balance += unmatched * Number(stockPrice);
            }
          }
        }
        const losingStock = result === "yes" ? "no" : "yes";
        const stockLoserTypeData = winningStock[losingStock];
        if (!stockLoserTypeData) continue;
        for (const stockPrice in stockLoserTypeData) {
          const stockDetails = stockLoserTypeData[stockPrice];
          if (stockDetails) {
            // This is where you can safely access stockDetails.matched and stockDetails.unmatched
            const { matched, unmatched } = stockDetails;

            if (unmatched > 0) {
              INR_BALANCES[userId].locked -= unmatched * Number(stockPrice);
              INR_BALANCES[userId].balance += unmatched * Number(stockPrice);
            }
          }
        }
      }
    }
  }
};

export { rewardWinners };
