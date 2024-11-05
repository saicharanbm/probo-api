import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { generateUniqueId } from "../utils/generateUniqueId";
import { publisherClient } from "../utils/createPublisherAndSubscriberClient";
import { waitForTheResponse } from "../utils/waitForTheResponse";
const createSymbol = async (req: Request, res: Response) => {
  const { stockSymbol } = req.params;
  const { userId, description, endTime } = req.body;
  console.log(stockSymbol, userId);
  // let { result } = req.body;
  if (!userId || !stockSymbol) {
    res.status(ResponseStatus.BadRequest).json({
      error: "Please fill all the fields.",
    });
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
      type: "createSymbol",
      data: { userId, stockSymbol, description, endTime },
    })
  );
};

export { createSymbol };
