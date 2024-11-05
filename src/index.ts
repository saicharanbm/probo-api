import express from "express";
import { router } from "./routes/routes";
import cors from "cors";
import { connectToRedis } from "./utils/createPublisherAndSubscriberClient";
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.listen(3000, () => {
  console.log("Listening to port 3000");
});
connectToRedis();
