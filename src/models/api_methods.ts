export type PublicMethod =
    'Time' | 'Assets' | 'AssetPairs' | 'Ticker' |
    'Depth' | 'Trades' | 'Spread' | 'OHLC';

export type PrivateMethod =
    'Balance' | 'TradeBalance' | 'OpenOrders' | 'ClosedOrders' |
    'QueryOrders' | 'TradesHistory' | 'QueryTrades' | 'OpenPositions' |
    'Ledgers' | 'QueryLedgers' | 'TradeVolume' | 'AddOrder' |
    'CancelOrder' | 'DepositMethods' | 'DepositAddresses' | 'DepositStatus' |
    'WithdrawInfo' | 'Withdraw' | 'WithdrawStatus' | 'WithdrawCancel' |
    'GetWebSocketsToken' | 'AddExport' | 'ExportStatus' | 'RetrieveExport' | 'RemoveExport';
