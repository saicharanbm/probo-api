import { Router } from "express";
import {
  buyYesAndNo,
  createSymbol,
  createUser,
  getAdminBAlance,
  getInrBalance,
  getInrBalances,
  getOrderBook,
  getStockBalance,
  getStockBalances,
  mintTokens,
  onrampInr,
  sellYesAndNo,
} from "../controllers";
import { viewOrderBook } from "../controllers/viewOrderBook";
const router = Router();

router.route("/user/create/:userId").post(createUser);
router.route("/symbol/create/:stockSymbol").post(createSymbol);
router.route("/orderbook").get(getOrderBook);
router.route("/balances/inr").get(getInrBalances);
router.route("/balances/stock").get(getStockBalances);
router.route("/balance/inr/:userId").get(getInrBalance);
router.route("/onramp/inr").post(onrampInr);
router.route("/balance/stock/:userId").get(getStockBalance);
router.route("/order/buy").post(buyYesAndNo);
router.route("/order/sell").post(sellYesAndNo);
router.route("/admin/balance").get(getAdminBAlance);
// router.route("/order/buy/no").post(buyNo);
// router.route("/order/sell/no").post(sellNo);
router.route("/orderbook/:stockSymbol").get(viewOrderBook);
router.route("/trade/mint").post(mintTokens);

export { router };
