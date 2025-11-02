import { Routes } from '@angular/router';
import { TransferComponent } from './components/transfer/transfer.component';
import { Transaction } from './models/transaction.model';
import { TransactionsComponent } from './components/transactions/transactions.component';
export const routes: Routes = [
  { path: 'transfer', component: TransferComponent },
  {path:'transactions', component:TransactionsComponent},
  { path: '', redirectTo: 'transfer', pathMatch: 'full' },
  { path: '**', redirectTo: 'transfer' }
];

