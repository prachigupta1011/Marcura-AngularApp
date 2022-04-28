import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    costs = null;
    totalQuoted = null;
    totalScreened = null;
    options: any[] = [];
    selectedValue = null;
    selectedCurrency = null;
    exchangeRate = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAllCosts()
        .pipe(first())
        .subscribe(costs => this.costs = costs);
        this.getPaymentCurrencies();
    }

    getPaymentCurrencies() {
      this.accountService.getPaymentCurrencies()
        .pipe(first())
        .subscribe(rates => {
          this.options = rates.paymentCurrencies;
          // this.selectedValue = this.options[0];
          console.log('this.options', this.options);
        });
    }

  // tslint:disable-next-line:typedef
    getItem(costs) {
      costs.forEach(cost => {
        if (cost.type === 'Quoted'){
          console.log('cost12234', cost.amount);
          return cost.amount;
        }
      });
    }

  getTotalQuoted(items) {
    this.totalQuoted = null;
    // tslint:disable-next-line:prefer-const
    items.costItems.forEach( item => {
        this.totalQuoted += item.costs[0].amount;
      });
    return this.totalQuoted;
  }

  getTotalScreened(items) {
    this.totalScreened = null;
    // tslint:disable-next-line:prefer-const
    items.costItems.forEach( item => {
      this.totalScreened += item.costs[1].amount;
    });
    return this.totalScreened;
  }

  getUSDValue(costs, amount){
      console.log('value ', amount * costs.baseCurrency.exchangeRate);
      return Math.round((amount * costs.baseCurrency.exchangeRate) * 100) / 100;
  }

  getTotalUSDValue(costs, item){
    return Math.round((item * costs.baseCurrency.exchangeRate) * 100) / 100;
  }

  onChange(event){
    this.selectedCurrency = JSON.parse(event);
    this.selectedValue = this.selectedCurrency.toCurrency;
    this.costs.daCurrency.currency = this.selectedCurrency.toCurrency;
    this.exchangeRate = this.selectedCurrency.exchangeRate;
  }

  getExchangeRate(cost){
    return Math.round((cost * this.exchangeRate) * 100) / 100;
  }
}
