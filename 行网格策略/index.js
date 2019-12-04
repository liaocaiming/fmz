var _StopLoss = 0
var _StopWin = 0
var _Grid = []

function UpdateGrid(nowBidsPrice, nowAsksPrice, direction) {    // up 1, down -1
	if (_Grid.length == 0 || (direction == 1 && nowBidsPrice - _Grid[_Grid.length - 1].price > _GridPointDis) ||
		(direction == -1 && _Grid[_Grid.length - 1].price - nowAsksPrice > _GridPointDis)) {

		var nowPrice = direction == 1 ? nowBidsPrice : nowAsksPrice
		_Grid.push({
			price: _Grid.length == 0 ? nowPrice : _Grid[_Grid.length - 1].price + _GridPointDis * direction,
			hold: { price: 0, amount: 0 },
			coverPrice: _Grid.length == 0 ? nowPrice - direction * _GridCovDis : _Grid[_Grid.length - 1].price + _GridPointDis * direction - direction * _GridCovDis
		})

		var tradeInfo = direction == 1 ? $.Sell(_GridPointAmount) : $.Buy(_GridPointAmount)
		_Grid[_Grid.length - 1].hold.price = tradeInfo.price
		_Grid[_Grid.length - 1].hold.amount = tradeInfo.amount
		$.PlotFlag(new Date().getTime(), JSON.stringify(tradeInfo), "O")
	}
	if (_Grid.length > 0 &&
		((direction == 1 && nowAsksPrice < _Grid[_Grid.length - 1].coverPrice) || (direction == -1 && nowBidsPrice > _Grid[_Grid.length - 1].coverPrice))) {

		var coverInfo = direction == 1 ? $.Buy(_Grid[_Grid.length - 1].hold.amount) : $.Sell(_Grid[_Grid.length - 1].hold.amount)
		_Grid.pop()
		$.PlotFlag(new Date().getTime(), JSON.stringify(coverInfo), "C")
		_StopWin++
	} else if (_Grid.length > _GridNum) {
		var coverfirstInfo = direction == 1 ? $.Buy(_Grid[0].hold.amount) : $.Sell(_Grid[0].hold.amount)
		_Grid.shift()
		$.PlotFlag(new Date().getTime(), JSON.stringify(coverfirstInfo), "C")
		_StopLoss++
	}

}

function main() {
	while (1) {
		var ticker = _C(exchange.GetTicker)
		var records = _C(exchange.GetRecords)
		$.PlotRecords(records, "kline")
		UpdateGrid(ticker.Buy, ticker.Sell, direction)
		var msg = ""
		for (var i = 0; i < _Grid.length; i++) {
			msg += JSON.stringify(_Grid[i]) + "\n"
		}
		LogStatus(_D(), "_StopWin:", _StopWin, "_StopLoss:", _StopLoss, _C(exchange.GetAccount), "\n", "_Grid.length:", _Grid.length, "_GridNum:", _GridNum, "\n", msg)
		Sleep(500)
	}
}