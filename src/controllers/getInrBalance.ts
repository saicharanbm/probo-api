import { Request, Response } from "express";
import { generateUniqueId } from "../utils/generateUniqueId";
import { publisherClient } from "../utils/createPublisherAndSubscriberClient";
import { ResponseStatus } from "../utils/types";
import { waitForTheResponse } from "../utils/waitForTheResponse";
const getInrBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide a userId" });
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
    JSON.stringify({ id, type: "getUserBalance", data: { userId } })
  );
  // try {
  //   const data: {
  //     response: { balance: number; locked: number } | { error: string };
  //     statusCode: ResponseStatus;
  //   } = (await waitForTheResponse(id)) as {
  //     response: { balance: number; locked: number } | { error: string };
  //     statusCode: ResponseStatus;
  //   };
  //   res.status(data.statusCode).send(data.response);
  // } catch (error) {
  //   res.status(400).send(error);
  // }
};

export { getInrBalance };
