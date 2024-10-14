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
  [key: string]: orderDetails;
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
  quantity: number;
  locked: number;
}
interface stockType {
  yes: stockQuantity;
  no: stockQuantity;
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

export { balance, orderBook, stockBalance, ResponseStatus };
