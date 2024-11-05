import { Request, response, Response } from "express";
import { generateUniqueId } from "../utils/generateUniqueId";
import { publisherClient } from "../utils/createPublisherAndSubscriberClient";
import { ResponseStatus } from "../utils/types";
import { waitForTheResponse } from "../utils/waitForTheResponse";
const getStockBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide the userId." });
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
    JSON.stringify({ id, type: "getUserStockBalance", data: { userId } })
  );
};

export { getStockBalance };
