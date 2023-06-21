import {makeObservable, observable, computed, runInAction, action} from 'mobx';
import {Stock} from '../../types/common';
import {BaseStore} from './base-store';
import {parseStocks} from './parsers';
import {getMockStock} from '../../testing/mocks';

class Stocks extends BaseStore {
  public stocks: Stock[] = [];

  private entity = 'stocks' as const;

  public get stocksCount() {
    return this.stocks.length;
  }

  constructor(stocks = []) {
    super();
    makeObservable(this, {
      stocks: observable,
      stocksCount: computed,
      fetchOne: action,
    });
    this.stocks = stocks;
  }

  public async fetchOne({onSuccess}: {onSuccess?: () => void} = {}) {
    // const stock = yield this.getRequest({entity: this.entity,});
    try {
      // const stock = await this.getRequest({entity: 'random-stock'});
      const stock = getMockStock();
      if (!stock.Ticker) {
        throw new Error('What a hell, dude?');
      }
      if (this.stocks.some(st => st.ticker === stock.Ticker)) {
        throw new Error('GOT THE SAME ONE BITCH');
      }
      runInAction(() => {
        const [parsedStock] = parseStocks([stock]);
        this.stocks.push(parsedStock);
        onSuccess?.();
      });
    } catch (e) {
      // runInAction(() => {
      console.log(e);
      // });
    }
  }
}

export const stocksStore = new Stocks([]);

// import {makeObservable, observable, computed, action, flow} from 'mobx';

// class Doubler {
//   value;

//   constructor(value) {
//     makeObservable(this, {
//       value: observable,
//       double: computed,
//       increment: action,
//       fetch: flow,
//     });
//     this.value = value;
//   }

//   get double() {
//     return this.value * 2;
//   }

//   increment() {
//     this.value++;
//   }

//   *fetch() {
//     const response = yield fetch('/api/value');
//     this.value = response.json();
//   }
// }
