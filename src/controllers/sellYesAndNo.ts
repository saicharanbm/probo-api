import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { generateUniqueId } from "../utils/generateUniqueId";
import { publisherClient } from "../utils/createPublisherAndSubscriberClient";
import { waitForTheResponse } from "../utils/waitForTheResponse";
const sellYesAndNo = async (req: Request, res: Response) => {
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
      type: "sellStock",
      data: {
        userId,
        stockSymbol,
        quantity,
        price,
        stockType,
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

export { sellYesAndNo };
