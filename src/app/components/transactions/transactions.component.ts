import { Component, Signal } from '@angular/core';
import { BankingService } from '../../core/services/banking.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-transactions',
  imports: [CommonModule, MatTableModule , CurrencyPipe, DatePipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.sass'
})
export class TransactionsComponent {
  public transactions: Signal<any[]>;
  displayedColumns: string[] = ['id', 'from', 'to', 'amount', 'date'];

  constructor(public bankingService:BankingService) {
    this.transactions = this.bankingService.getTransactions();
  }

}
