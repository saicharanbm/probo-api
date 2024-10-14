import { Request, Response } from "express";
const viewOrderBook = (req: Request, res: Response) => {
  res.status(200).send("Request sent");
};

export { viewOrderBook };
