import { Request, Response } from "express";
const mintTokens = (req: Request, res: Response) => {
  res.status(200).send("Request sent");
};

export { mintTokens };
