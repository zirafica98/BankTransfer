import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const sameAccountValidation: ValidatorFn = (group: AbstractControl): ValidationErrors | null =>{
    const mainAccount = group.get("mainAccountId")?.value;
    const secondAccount = group.get("secondAccountId")?.value;

    if(mainAccount && secondAccount && mainAccount === secondAccount){
        return{sameAccount:true};
    }
    return null;
}