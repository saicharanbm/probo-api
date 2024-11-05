import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { generateUniqueId } from "../utils/generateUniqueId";
import { publisherClient } from "../utils/createPublisherAndSubscriberClient";
import { waitForTheResponse } from "../utils/waitForTheResponse";
const cancelOrder = async (req: Request, res: Response) => {
  const { userId, stockSymbol, stockType, quantity, price } = req.body;
  if (
    !userId ||
    !stockSymbol ||
    !stockType ||
    !quantity ||
    !price ||
    typeof userId !== "string" ||
    typeof stockSymbol !== "string" ||
    typeof stockType !== "string" ||
    typeof price !== "number"
  ) {
    // this function gives the user the ability to cancel the stocks of the users which are not matched
    //what we do is when the user requests to cancel the order we look at the order book for the opposite stock type at the (10-price) per  stock.
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide all the details." });
    return;
  }
  if (!(stockType == "yes" || stockType === "no")) {
    res.status(ResponseStatus.BadRequest).json({
      error: `Stock Type should be yes or no.`,
    });
    return;
  }
  const oppositeStockType = stockType === "yes" ? "no" : "yes";
  const oppositeStockPrice = 1000 - price;

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
    JSON.stringify({
      id,
      type: "cancelOrder",
      data: {
        userId,
        stockSymbol,
        quantity,
        price,
        oppositeStockType,
        oppositeStockPrice,
      },
    })
  );

  // try {
  //   const data: {
  //     response: { message: string } | { error: string };
  //     statusCode: ResponseStatus;
  //   } = (await waitForTheResponse(id)) as {
  //     response: { message: string } | { error: string };
  //     statusCode: ResponseStatus;
  //   };
  //   res.status(data.statusCode).send(data.response);
  // } catch (error) {
  //   res.status(400).send(error);
  // }
};
export { cancelOrder };
