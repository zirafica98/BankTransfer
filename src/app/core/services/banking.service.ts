import { Injectable, signal } from '@angular/core';
import { AccountModel } from '../../models/account.model';
import { BehaviorSubject, Observable, switchMap, throwError, timer } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankingService {

  private accountsList:AccountModel[] = [
    {id:"123-456-789",balance:12500,owner:"Pera Peric"},
    {id:"987-654-321",balance:5400,owner:"Marko Zivkovic"}
  ]

  private accountsSubject = new BehaviorSubject<AccountModel[]>(this.accountsList);
  public accounts$:Observable<AccountModel[]> = this.accountsSubject.asObservable();

  private transactionList = signal<Transaction[]>([]);
  

  constructor() { }

  public transfer(mainAccountId:string,secondAccountId:string,amount:number):Observable<Transaction>{
    
    const listAccounts = this.accountsSubject.getValue();
    const mainAccount = listAccounts.find(acc => acc.id ==mainAccountId)
    const secondAccount = listAccounts.find(acc => acc.id == secondAccountId)

    if(mainAccountId === secondAccountId){
      return throwError(() => new Error("Account is same"))
    }

    if(!mainAccount || !secondAccount){
      return throwError(()=> new Error("Accounts not found"))
    }

    if(Number(mainAccount.balance) < Number(amount)){
      return throwError(()=> new Error("Insufficient funds. Check your account balance."))
    }

    const update = listAccounts.map(account => {
      if(account.id === mainAccountId){
        return{ ...account,balance: Number(account.balance) - Number(amount)};
      }

      if(account.id === secondAccountId){
        return {...account,balance: Number(account.balance) + Number(amount)};
      }

      return account;
    })

    const transaction: Transaction ={
      id:crypto.randomUUID(),
      fromAccountId:mainAccount.id,
      toAccountId:secondAccount.id,
      amount:amount,
      date:new Date()
    }

    return timer(1000).pipe(
      switchMap(() => {
        this.accountsSubject.next(update);
        this.transactionList.update(list => [...list, transaction]);
        return of(transaction);
      })
    );

  }

  getTransactions(){
    return this.transactionList.asReadonly();
  }    
}
