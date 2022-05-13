import * as inquirer from "inquirer";
import * as chalk from "chalk";
import axios, {AxiosError, AxiosResponse} from "axios";
import * as R from "ramda";
// @ts-expect-error
import * as Table from "cli-table";
import * as logUpdate from "log-update";

const DELAY_SECONDS = 2000;
const P2P_ENDPOINT = "https://p2p.binance.com";
const P2P_ROW_REQUEST = 5;
const DEFAULT_CRYPTO = "USDT";
const DEFAULT_FIAT = "CAD";
const DEFAULT_TRADE_TYPE = "BUY";
const DEFAULT_PAY_TYPE = "All Payments";

import {
  IPSPRequestOption,
  Crypto,
  Fiat,
  TradeType,
  IP2PResponse,
  IOrder,
  PayType
} from "./p2p";

const log = console.log;

function askCryptoQuestion(list: Crypto[]): inquirer.ListQuestionOptions {
  const defaultCrypto = DEFAULT_CRYPTO || "USDT";
  return {
    type: "list",
    name: "crypto",
    message: `Select crypto (default '${defaultCrypto}')`,
    choices: list,
    default: defaultCrypto,
  };
}

function askFiatQuestion(list: Fiat[]): inquirer.ListQuestionOptions {
  const defaultFiat = DEFAULT_FIAT || "CAD";
  return {
    type: "list",
    name: "fiat",
    message: `Select fiat (default '${defaultFiat}')`,
    choices: list,
    default: defaultFiat,
  };
}

function askTradeTypeQuestion(list: TradeType[]): inquirer.ListQuestionOptions {
  const defaultTradeType = DEFAULT_TRADE_TYPE || "BUY";
  return {
    type: "list",
    name: "tradeType",
    message: `Select exchange type (default: '${defaultTradeType}')`,
    choices: list,
    default: defaultTradeType || "BUY",
  };
}

function askPayTypeQuestion(list: PayType[]): inquirer.ListQuestionOptions {
  const defaultPayType = DEFAULT_PAY_TYPE || 'All Payments';
  return {
    type: "list",
    name: "payType",
    message: `Select payment type (default: '${defaultPayType}')`,
    choices: list,
    default: defaultPayType,
  }
}

function askTransAmountQuestion(): inquirer.ListQuestionOptions {
  return {
    type: "input",
    name: "transAmount",
    message: "Enter Amount",
  };
}

interface IAskResponse {
  crypto: Crypto;
  fiat: Fiat;
  tradeType: TradeType;
  transAmount: string;
  payType: PayType;
}

async function askQuestion(): Promise<IAskResponse> {
  const cryptoList: Crypto[] = ["USDT", "BTC", "BNB", "BUSD", "ETH", "DAI"];
  const askCrypto = askCryptoQuestion(cryptoList);

  const fiatList: Fiat[] = [
    "ARS",
    "EUR",
    "USD",
    "AED",
    "AUD",
    "BDT",
    "BHD",
    "BOB",
    "BRL",
    "CAD",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "CZK",
    "DOP",
    "DZD",
    "EGP",
    "GBP",
    "GEL",
    "GHS",
    "HKD",
    "IDR",
    "INR",
    "JPY",
    "KES",
    "KHR",
    "KRW",
    "KWD",
    "KZT",
    "LAK",
    "LBP",
    "LKR",
    "MAD",
    "MMK",
    "MXN",
    "MYR",
    "NGN",
    "OMR",
    "PAB",
    "PEN",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RUB",
    "SAR",
    "SDG",
    "SEK",
    "SGD",
    "THB",
    "TND",
    "TRY",
    "TWD",
    "UAH",
    "UGX",
    "UYU",
    "VES",
    "VND",
    "ZAR",
  ];
  const askFiat = askFiatQuestion(fiatList);

  const payTypeList: PayType[] = ["All Payments", "Tinkoff", "CIBCbank", "Zelle"];
  const askPayType = askPayTypeQuestion(payTypeList);

  const tradeTypeList: TradeType[] = ["BUY", "SELL"];
  const askTradeType = askTradeTypeQuestion(tradeTypeList);

  const askTransAmount = askTransAmountQuestion();

  const askList = [askCrypto, askFiat, askPayType, askTradeType, askTransAmount];

  return inquirer.prompt<IAskResponse>(askList);
}

async function requestBinanceP2P(
  requestOptions: IPSPRequestOption
): Promise<IP2PResponse> {
  const url = `${P2P_ENDPOINT}/bapi/c2c/v2/friendly/c2c/adv/search`;

  const headers = {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  };

  const response = await axios.post<IPSPRequestOption,
    AxiosResponse<IP2PResponse>>(url, requestOptions, {
    headers,
  });
  return response.data;
}

async function requestP2P(options: IPSPRequestOption): Promise<IP2PResponse> {
  try {
    const p2pResponse = await requestBinanceP2P(options);
    return p2pResponse;
  } catch (error) {
    if (error && error.response) {
      const axiosError = error as AxiosError<IP2PResponse>;
      return axiosError.response.data;
    }

    throw error;
  }
}


function prepareP2POption(answers: IAskResponse): IPSPRequestOption {
  let payType;
  (answers.payType == 'All Payments') ? payType = [] : payType = new Array(answers.payType);
  const options: IPSPRequestOption = {
    page: 1,
    rows: P2P_ROW_REQUEST || 5,
    asset: answers.crypto,
    tradeType: answers.tradeType,
    fiat: answers.fiat,
    transAmount: answers.transAmount,
    payTypes: payType,
  };
  return options;
}

export function sortOrderWithPriceAndFinishRate(orders: IOrder[]): IOrder[] {
  const priceAscend = R.ascend(R.path(["adv", "price"]));
  const priceDescend = R.descend(R.path(["adv", "price"]));
  const finishRateDescend = R.descend(
    R.path(["advertiser", "monthFinishRate"])
  );
  const sortWithPriceAndFinishRate = R.sortWith([
    orders[0].adv.tradeType == 'SELL' ? priceAscend : priceDescend,
    finishRateDescend,
  ]);
  const sorted = sortWithPriceAndFinishRate(orders);

  return sorted;
}

export function sortOrderWithPrice(orders: IOrder[]): IOrder[] {
  const priceAscend = R.ascend(R.path(["adv", "price"]));
  const priceDescend = R.descend(R.path(["adv", "price"]));
  const sortWithPrice = R.sortWith([orders[0].adv.tradeType == 'SELL' ? priceAscend : priceDescend]);
  const sorted = sortWithPrice(orders);

  return sorted;
}

function mapColor(orders: IOrder[]): Record<string, { color: string }> {
  const ascendPriceColorMapped: Record<string, { color: string }> = {};

  let colorCounter = 0;
  for (let index = 0; index < orders.length; index++) {
    const order: IOrder = orders[index];
    if (!ascendPriceColorMapped[order.adv.price]) {
      ascendPriceColorMapped[order.adv.price] = {
        color: Colors[RateMapper[colorCounter]] || Colors.normal,
      };
      colorCounter++;
    }
  }
  return ascendPriceColorMapped;
}

enum Colors {
  best = "#00ff00",
  good = "#ffff00",
  medium = "#ffbf00",
  normal = "#ffff",
}

const RateMapper = {
  0: "best",
  1: "good",
  2: "medium",
};

function thousandSeparator(number: number, fractionDigits: number = 0): string {
  const defaultLocale = undefined;
  const formatted = number.toLocaleString(defaultLocale, {
    minimumFractionDigits: fractionDigits,
  });
  return formatted;
}

function generateTable(orders: IOrder[], answers: IAskResponse) {
  const table = new Table({
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: " ",
    },
    style: {"padding-left": 0, "padding-right": 0},
    colWidths: [10, 12, 18, 8, 25, 95],
    colAligns: ["left", "right", "right", "right", "left", "left"],
    head: [
      "Success",
      `Price ${answers.fiat}`,
      `Available ${answers.crypto}`,
      "Order",
      "Name",
      "Link",
    ],
  });

  const ascendPriceSorted = sortOrderWithPrice(orders);
  const ascendPriceColorMapped = mapColor(ascendPriceSorted);
  for (const order of orders) {
    const monthOrderCount = order.advertiser.monthOrderCount;
    const monthFinishRate = order.advertiser.monthFinishRate * 100;
    const nickName = order.advertiser.nickName;
    const price = order.adv.price;
    const advertiserNo = order.advertiser.userNo;
    const available = order.adv.surplusAmount;
    const monthFinishRatePercent = `${monthFinishRate.toFixed(2)}%`;
    const userType = order.advertiser.userType;
    const nickNameWithUserType =
      userType === "merchant"
        ? `${nickName} ${chalk.hex(Colors.best)(` ${userType} `)}`
        : nickName;

    table.push([
      monthFinishRate === 100
        ? chalk.hex(Colors.best)(monthFinishRatePercent)
        : monthFinishRatePercent,
      chalk.hex(ascendPriceColorMapped[price].color)(price),
      thousandSeparator(parseFloat(available), 2),
      thousandSeparator(monthOrderCount),
      nickNameWithUserType,
      `${P2P_ENDPOINT}/en/advertiserDetail?advertiserNo=${advertiserNo}`,
    ]);
  }

  return table;
}

function setIntervalImmediately(func: Function, interval: number) {
  func();
  return setInterval(func, interval);
}

(async () => {
  log(`💰  ${chalk.bold.underline(`P2P: BUY/SELL Questions\n`)}`);
  const answers = await askQuestion();

  log("\n");
  log(`P2P: ${chalk.bold.underline(P2P_ENDPOINT)} \n`);

  const run = async () => {
    const requestOptions = prepareP2POption(answers);
    const p2pResponse = await requestP2P(requestOptions);
    const orders = p2pResponse.data;
    const sorted = sortOrderWithPriceAndFinishRate(orders);
    const table = generateTable(sorted, answers);

    logUpdate(`DATE: ${chalk.bold.underline(
      new Date().toLocaleString()
    )}  (refresh ${DELAY_SECONDS / 1000}s)

${table.toString()}

`);
  };

  setIntervalImmediately(run, DELAY_SECONDS);
})();
