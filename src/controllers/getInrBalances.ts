import { Request, Response } from "express";
// import { balance, ResponseStatus } from "../utils/types";
import { publisherClient } from "../utils/createPublisherAndSubscriberClient";
import { generateUniqueId } from "../utils/generateUniqueId";
import { waitForTheResponse } from "../utils/waitForTheResponse";
const getInrBalances = async (req: Request, res: Response) => {
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
    JSON.stringify({ id, type: "balance", data: {} })
  );
  // try {
  //   const data: {
  //     response: balance | { error: string };
  //     statusCode: ResponseStatus;
  //   } = (await waitForTheResponse(id)) as {
  //     response: balance | { error: string };
  //     statusCode: ResponseStatus;
  //   };
  //   res.status(data.statusCode).send(data.response);
  // } catch (error) {
  //   res.status(400).send(error);
  // }
};

export { getInrBalances };
