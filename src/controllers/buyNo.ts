import { Request, Response } from "express";
const buyNo = (req: Request, res: Response) => {
  res.status(200).send("Request sent");
};

export { buyNo };
