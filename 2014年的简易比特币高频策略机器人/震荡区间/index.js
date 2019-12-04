function getPrice(type) {
  var depth = _C(exchange.GetDepth);
  var Bids = depth.Bids[0].Price;
  var Asks = depth.Asks.Price;
  if (type === "buy") {
    return Bids;
  }
  return Asks;
}

function cancelOrder() {
  var orders = _C(exchange.GetOrders);
  for (var i = 0; i < orders.length; i++) {
    exchange.CancelOrder(orders[i].Id);
  }
}

function main() {
  Log(basePrice, differPrice);
  var sellPrice = getPrice("sell");
  var buyPrice = getPrice("buy");
  Log(buyPrice, "buyPrice");
  Log(sellPrice, "sellPrice");
  //获取账户信息，确定目前账户存在多少钱和多少币
  var account = _C(exchange.GetAccount);
  //可买的比特币量
  var amountBuy = _N(account.Balance / buyPrice - 0.1, 2);
  //可卖的比特币量，注意到没有仓位的限制，有多少就买卖多少，因为我当时的钱很少
  var amountSell = _N(account.Stocks, 2);
  cancelOrder();

  if (buyPrice - basePrice > differPrice) {
    exchange.Buy(buyPrice, amountBuy);
  }

  if (basePrice - sellPrice > differPrice) {
    exchange.Sell(sellPrice, amountSell);
  }
  //休眠，进入下一轮循环
  Sleep(1000);
}
