import { Injectable } from '@angular/core';
import { currencies } from './data';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  public getAvailableCurrencies(): { [key: string]: string } {
    return currencies;
  }

  public async convert(from: string, to: string, amount: number): Promise<string> {
    if (!currencies[from] || !currencies[to]) {
      return Promise.reject("The origin or target currency you entered is not supported. Look up the available currencies in the section above");
    } else {
      return fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`)
        .then((resp) => resp.json())
        .then((data) => Promise.resolve((amount * data.rates[to]).toFixed(2)));
    }
  }
}
