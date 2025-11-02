import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { BankingService } from '../../core/services/banking.service';
import { sameAccountValidation } from './transfer.validator';
import { finalize, Subscription } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-transfer',
  imports: [ReactiveFormsModule,CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent {
  public transferForm: FormGroup;
  public isLoading:boolean = false;
  public errorMessage:String | null= "";
  public successMessage: String | null = "";

  private transferSubscription: Subscription | null = null;

  constructor(public bankingService:BankingService, private fb:FormBuilder){
    this.transferForm = this.fb.group({
      mainAccountId: ['',[Validators.required]],
      secondAccountId:['',[Validators.required]],
      amount:[0,[Validators.required ,Validators.min(0.01)]]
    },
    {validators: sameAccountValidation}
    )
  }

  ngOnDestroy():void{
    this.transferSubscription?.unsubscribe();
  }

    async onSubmit(){
      this.successMessage = null;
      this.errorMessage = null;
      if(this.transferForm.invalid){
        this.transferForm.markAsTouched()
        console.error("Form is not valid");
        return
      }

      const{mainAccountId,secondAccountId,amount} = this.transferForm.value;

      this.isLoading = true;

      this.transferSubscription = this.bankingService.transfer(mainAccountId,secondAccountId,amount).pipe(
        finalize(()=>{
          this.isLoading = false;
        })
      ).subscribe({
        next:(transaction: any) =>{
          this.successMessage = "Transfer successful!"; 
          this.errorMessage = null;
          this.transferForm.reset();
        },
        error:(error:any)=>{
          this.errorMessage = error.message;
        }
      })
           
    }
}
