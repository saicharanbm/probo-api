import { Request, Response } from "express";
const sellYesAndNo = (req: Request, res: Response) => {
  res.status(200).send("Request sent");
};

export { sellYesAndNo };
