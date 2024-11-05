import { Request, Response } from "express";
// import { orderBook, ResponseStatus } from "../utils/types";
import { generateUniqueId } from "../utils/generateUniqueId";
import { publisherClient } from "../utils/createPublisherAndSubscriberClient";
import { waitForTheResponse } from "../utils/waitForTheResponse";
const getOrderBook = async (req: Request, res: Response) => {
  // res.status(ResponseStatus.Success).send(ORDERBOOK);
  const id = generateUniqueId();
  waitForTheResponse(id)
    .then((data) => {
      res.status(data.statusCode).send(data.response);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
  publisherClient.lPush(
    "requests",
    JSON.stringify({ id, type: "getOrderBook", data: {} })
  );
};

export { getOrderBook };
