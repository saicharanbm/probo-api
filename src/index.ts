import express from "express";
import { router } from "./routes/routes";
import { rewardWinners } from "./utils/rewardWinner";
const app = express();

app.use(express.json());
app.use(router);
app.listen(3000, () => {
  console.log("Listening to port 3000");
});
