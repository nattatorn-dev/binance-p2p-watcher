import { sortOrderWithPrice, sortOrderWithPriceAndFinishRate } from "./main";
import { IOrder } from "./p2p";

test("should sort order by lowest price correctly", () => {
  const orders = [
    {
      adv: {
        price: 100,
      },
    },
    {
      adv: {
        price: 4,
      },
    },
    {
      adv: {
        price: 0.12,
      },
    },
  ] as any as IOrder[];

  const result = sortOrderWithPrice(orders);
  expect(result).toEqual([
    {
      adv: {
        price: 0.12,
      },
    },
    {
      adv: {
        price: 4,
      },
    },
    {
      adv: {
        price: 100,
      },
    },
  ]);
});

test("should sort order by lowest price and high finish rate correctly", () => {
  const orders = [
    {
      adv: {
        price: 33.12,
      },
      advertiser: {
        monthFinishRate: 0.9
      }
    },
    {
      adv: {
        price: 33.1,
      },
      advertiser: {
        monthFinishRate: 0.99
      }
    },
  ] as any as IOrder[];

  const result = sortOrderWithPriceAndFinishRate(orders);
  expect(result).toEqual([
    {
      adv: {
        price: 33.1,
      },
      advertiser: {
        monthFinishRate: 0.99
      }
    },
    {
      adv: {
        price: 33.12,
      },
      advertiser: {
        monthFinishRate: 0.9
      }
    },
  ]);
});
