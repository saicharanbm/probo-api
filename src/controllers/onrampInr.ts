import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { generateUniqueId } from "../utils/generateUniqueId";
import { publisherClient } from "../utils/createPublisherAndSubscriberClient";
import { waitForTheResponse } from "../utils/waitForTheResponse";
const onrampInr = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  console.log(userId, amount);
  if (!userId || !amount) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide all the fields." });
    return;
  }
  if (typeof amount != "number" && amount < 0) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Amount should be greater than 0." });
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
      type: "addMoney",
      data: {
        userId,
        amount,
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

export { onrampInr };
