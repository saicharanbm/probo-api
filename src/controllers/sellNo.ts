import { Request, Response } from "express";
const sellNo = (req: Request, res: Response) => {
  res.status(200).send("Request sent");
};

export { sellNo };
