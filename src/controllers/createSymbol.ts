import { Request, Response } from "express";
import { INR_BALANCES, ORDERBOOK, STOCK_DETAILS } from "../utils/data";
import { ResponseStatus } from "../utils/types";
import { createSchedule } from "../utils/createSchedule";
const createSymbol = (req: Request, res: Response) => {
  const { stockSymbol } = req.params;
  const { userId, description, endTime } = req.body;
  // let { result } = req.body;
  if (!userId || !stockSymbol || !description || !endTime) {
    res.status(ResponseStatus.BadRequest).json({
      error: "Please fill all the fields.",
    });
    return;
  }

  if (!INR_BALANCES[userId]) {
    res.status(ResponseStatus.BadRequest).json({
      error: "User with this id does not exists.",
    });
    return;
  }
  if (ORDERBOOK[stockSymbol] || STOCK_DETAILS[stockSymbol]) {
    res
      .status(ResponseStatus.Conflict)
      .json({ error: "Stock with this symbol already exist." });
    return;
  }

  if (typeof endTime != "string") {
    res
      .status(ResponseStatus.BadRequest)
      .json({ error: "Please provide a valid end time." });
    return;
  }
  ORDERBOOK[stockSymbol] = {
    yes: {},
    no: {},
  };
  const time = new Date();
  const minute = time.getMinutes();
  const hour = time.getHours();
  const day = time.getDate();
  const month = time.getMonth() + 1;
  const year = time.getFullYear();
  const createdAt = `${day}-${month}-${year}T${hour}:${minute} `;

  STOCK_DETAILS[stockSymbol] = {
    owner: userId,

    description,
    createdAt,
    endTime,

    isActive: true,
  };
  createSchedule(endTime, stockSymbol);
  res
    .status(ResponseStatus.Success)
    .json({ message: "Stock symbol created successfully." });
};

export { createSymbol };
