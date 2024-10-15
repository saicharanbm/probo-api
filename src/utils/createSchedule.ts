import cron from "node-cron";
import { STOCK_DETAILS } from "./data";
import { rewardWinners } from "./rewardWinner";

const createSchedule = (time: string, stockSymbol: string) => {
  cron.schedule(
    time,
    () => {
      STOCK_DETAILS[stockSymbol].isActive = false;
      const result = Math.random() < 0.5 ? "yes" : "no";

      rewardWinners(stockSymbol, result);
      console.log("The winning stock is", result);
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

export { createSchedule };
