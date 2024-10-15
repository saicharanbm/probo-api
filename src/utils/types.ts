//for INR_BALANCES
interface userFields {
  balance: number;
  locked: number;
}
interface balance {
  [key: string]: userFields;
}

// for ORDERBOOK

interface orderDetails {
  total: number;
  orders: Record<string, number>;
}
interface orderCost {
  [key: number]: orderDetails;
}
type orderKey = "yes" | "no";
interface orderType {
  yes: orderCost;
  no: orderCost;
}
interface orderBook {
  [key: string]: orderType;
}

//for STOCK_BALANCES

interface stockQuantity {
  unmatched: number;
  matched: number;
}
interface stockCost {
  [key: number]: stockQuantity;
}
interface stockType {
  yes: stockCost;
  no: stockCost;
}
interface stock {
  [key: string]: Partial<stockType>;
}
interface stockBalance {
  [key: string]: stock;
}

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  Error = 500,
  BadRequest = 400,
  Unauthorized = 401,
  Conflict = 409,
}

interface StockCredentials {
  owner: string; // Owner of the stock symbol

  description: string;
  createdAt: string; // Time of result announcement
  endTime: string; // Time of result announcement

  isActive: boolean;
}
interface StockDetails {
  [key: string]: StockCredentials;
}

export { balance, orderBook, stockBalance, ResponseStatus, StockDetails };
