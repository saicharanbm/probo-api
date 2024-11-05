import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { generateUniqueId } from "../utils/generateUniqueId";
import { publisherClient } from "../utils/createPublisherAndSubscriberClient";
import { waitForTheResponse } from "../utils/waitForTheResponse";

const buyYesAndNo = async (req: Request, res: Response) => {
  const { userId, stockSymbol, quantity, price, stockType } = req.body;
  if (!userId || !stockSymbol || !quantity || !price || !stockType) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please fill all the fields." });
    return;
  }
  if (
    typeof quantity !== "number" ||
    typeof price != "number" ||
    quantity < 0 ||
    price < 50 ||
    price > 950
  ) {
    res.status(ResponseStatus.BadRequest).json({
      error: "Please provide a valid quantity and price.",
    });
    return;
  }
  if (price % 50 !== 0) {
    res.status(ResponseStatus.BadRequest).json({
      error: "The price should be a multiple of 50 paise.",
    });
    return;
  }
  if (stockType !== "yes" && stockType !== "no") {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please enter a valid stock Type" });
    return;
  }

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
      type: "buyStock",
      data: {
        userId,
        stockSymbol,
        quantity,
        price,
        stockType,
      },
    })
  );
};

export { buyYesAndNo };
