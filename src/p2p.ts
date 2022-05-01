export type Crypto = "USDT" | "BTC" | "BNB" | "BUSD" | "ETH" | "DAI";
export type TradeType = "Buy" | "Sell";
export type Fiat =
  | "ARS"
  | "EUR"
  | "USD"
  | "AED"
  | "AUD"
  | "BDT"
  | "BHD"
  | "BOB"
  | "BRL"
  | "CAD"
  | "CLP"
  | "CNY"
  | "COP"
  | "CRC"
  | "CZK"
  | "DOP"
  | "DZD"
  | "EGP"
  | "GBP"
  | "GEL"
  | "GHS"
  | "HKD"
  | "IDR"
  | "INR"
  | "JPY"
  | "KES"
  | "KHR"
  | "KRW"
  | "KWD"
  | "KZT"
  | "LAK"
  | "LBP"
  | "LKR"
  | "MAD"
  | "MMK"
  | "MXN"
  | "MYR"
  | "NGN"
  | "OMR"
  | "PAB"
  | "PEN"
  | "PHP"
  | "PKR"
  | "PLN"
  | "PYG"
  | "QAR"
  | "RON"
  | "RUB"
  | "SAR"
  | "SDG"
  | "SEK"
  | "SGD"
  | "THB"
  | "TND"
  | "TRY"
  | "TWD"
  | "UAH"
  | "UGX"
  | "UYU"
  | "VES"
  | "VND"
  | "ZAR";

export interface IPSPRequestOption {
  page: number;
  rows: number;
  asset: Crypto;
  tradeType: TradeType;
  fiat: Fiat;
  transAmount: string;
  payTypes: PayType[];
}

export interface IP2PResponse {
  code: string;
  message?: string;
  messageDetail?: string;
  data: IOrder[];
  total: number;
  success: boolean;
}

export interface IOrder {
  adv: IAdvertising;
  advertiser: IAdvertiser;
}

export type Classify = "mass" | "profession";

export interface IAdvertising {
  advNo: string;
  classify: Classify;
  tradeType: TradeType;
  asset: Crypto;
  fiatUnit: Fiat;
  price: string;
  initAmount: string;
  surplusAmount: string;
  amountAfterEditing: string;
  maxSingleTransAmount: string;
  minSingleTransAmount: string;
  remarks?: string;
  payTimeLimit?: string;
  tradeMethods?: ITradeMethods[];
  fiatSymbol: string;
  dynamicMaxSingleTransAmount: string;
  minSingleTransQuantity: string;
  maxSingleTransQuantity: string;
  dynamicMaxSingleTransQuantity: string;
}

export type PayType =
  | "All Payments"
  | "BANK"
  | "TrueMoney"
  | "ShopeePay"
  | "CashDeposit"
  | "LINEPay"
  | "Paypal"
  | "WesternUnion"
  | "FPS"
  | "NGNfiatbalance"
  | "Tinkoff"
  | "CIBCbank"
  | "Zelle"
  | "jkopay";

export interface ITradeMethods {
  payId?: string;
  payType: string;
  payAccount?: string;
  payBank?: PayType;
  paySubBank?: string;
  identifier: string;
}

export type UserType = "user" | "merchant";

export interface IAdvertiser {
  userNo: string;
  realName?: string;
  nickName: string;
  orderCount?: number;
  monthOrderCount: number;
  monthFinishRate: number;
  email?: string;
  userType?: UserType;
}
