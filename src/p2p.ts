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

export interface IAdvertising {
  advNo: string;
  classify: string;
  tradeType: TradeType;
  asset: string;
  fiatUnit: string;
  price: string;
  initAmount: string;
  surplusAmount: string;
  amountAfterEditing: string;
  maxSingleTransAmount: string;
  minSingleTransAmount: string;
  remarks?: string;
  autoReplyMsg: string;
  payTimeLimit?: string;
  tradeMethods?: ITradeMethods;
  createTime?: string;
  advUpdateTime?: string;
  fiatVo?: string;
  assetVo?: string;
  advVisibleRet?: string;
  assetLogo?: string;
  assetScale: number;
  fiatScale: number;
  priceScale: number;
  fiatSymbol: string;
  isTradable: boolean;
  dynamicMaxSingleTransAmount: string;
  minSingleTransQuantity: string;
  maxSingleTransQuantity: string;
  dynamicMaxSingleTransQuantity: string;
}

export type PayType = "BANK";

export interface ITradeMethods {
  payId?: string;
  payType: string;
  payAccount?: string;
  payBank?: PayType;
  paySubBank?: string;
  identifier: string;
  iconUrlColor: string;
  tradeMethodName: string;
  tradeMethodShortName: string;
  tradeMethodBgColor: string;
}

export interface IAdvertiser {
  userNo: string;
  realName?: string;
  nickName: string;
  margin?: number;
  marginUnit?: number;
  orderCount?: number;
  monthOrderCount: number;
  monthFinishRate: number;
  advConfirmTime: number;
  email?: string;
  registrationTime?: string;
  mobile?: string;
  userType: string;
  tagIconUrls?: string[];
}
