var hold = {price : 0, amount : 0}
var _Gear = 0
function main(){
    var initAccount = _C(exchange.GetAccount)
    Log(initAccount, "#FF0000")
    while(1){
        var ticker = _C(exchange.GetTicker)
        if(hold.amount == 0){
            var firstInfo = $.Sell(_FirstAmount)
            hold.amount = firstInfo.amount
            hold.price = firstInfo.price
        } else {
            if(ticker.Buy < hold.price - _StopWin){
                var coverStopWinInfo = $.Buy(hold.amount)
                hold.price = 0
                hold.amount = 0
                _Gear = 0
            } else if(ticker.Buy > hold.price + _StopLoss && _Gear < _MaxGear){
                $.Buy(hold.amount)
                var amount = hold.amount * 2
                var addInfo = $.Sell(amount)
                hold.price = addInfo.price
                hold.amount = addInfo.amount
                _Gear++
            }
        }
        LogStatus(_D(), "加倍下注次数：", _Gear, "\n", "当前持仓：", hold)
        Sleep(500)
    }
}