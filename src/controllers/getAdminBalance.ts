import { Request, Response } from "express";
import { ResponseStatus } from "../utils/types";
import { generateUniqueId } from "../utils/generateUniqueId";
import { publisherClient } from "../utils/createPublisherAndSubscriberClient";
import { waitForTheResponse } from "../utils/waitForTheResponse";
const getAdminBAlance = async (req: Request, res: Response) => {
  // res.status(ResponseStatus.Success).json(ADMIN_Balance);
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
    JSON.stringify({ id, type: "getAdminBalance", data: {} })
  );
};

export { getAdminBAlance };
